import { WalletUnlocked, Provider } from 'fuels';
import { config } from './config/config';
import { logger } from './utils/logger';

/**
 * Liquidation result
 */
export interface LiquidationResult {
    success: boolean;
    txHash?: string;
    error?: string;
}

/**
 * Liquidator for executing liquidations on Fuel Network
 */
export class Liquidator {
    private wallet!: WalletUnlocked;
    private provider!: Provider;
    private contractId: string;
    private initialized: boolean = false;

    constructor() {
        this.contractId = config.fuel.contractId;
    }

    /**
     * Initialize the liquidator (must be called before use)
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;

        // Initialize provider (SDK v0.102.0+ uses direct constructor)
        this.provider = await new Provider(config.fuel.rpcUrl);

        // Initialize wallet with private key (WalletUnlocked for signing)
        this.wallet = new WalletUnlocked(config.fuel.privateKey, this.provider);

        this.initialized = true;

        logger.info('Liquidator initialized', {
            walletAddress: this.wallet.address.toB256(),
            rpcUrl: config.fuel.rpcUrl,
            dryRun: config.bot.dryRun,
        });
    }

    /**
     * Execute liquidation for a loan
     */
    async liquidateLoan(loanId: string): Promise<LiquidationResult> {
        try {
            if (config.bot.dryRun) {
                logger.warn(`[DRY RUN] Would liquidate loan ${loanId}`, {
                    loanId,
                });
                return {
                    success: true,
                    txHash: `0xDRYRUN_${loanId}_${Date.now()}`,
                };
            }

            logger.info(`Liquidating loan ${loanId}`, { loanId });

            // Use typegen-generated contract class (properly handles ABI types)
            const { AxiosFuelCore } = await import('./abitypes/AxiosFuelCore');

            // Create contract instance with the wallet
            const contract = new AxiosFuelCore(this.contractId, this.wallet);
            const loanIdNum = Number(loanId);

            // PRE-FLIGHT VALIDATION: Check on-chain status before attempting liquidation
            if (config.bot.preFlightValidation) {
                try {
                    const { value: status } = await contract.functions
                        .get_loan_status(loanIdNum)
                        .dryRun();

                    const statusNum = Number(status);

                    if (statusNum !== 2) {
                        const statusMap: Record<number, string> = {
                            0: 'requested',
                            1: 'cancelled',
                            2: 'active',
                            3: 'repaid',
                            4: 'liquidated',
                            5: 'claimed',
                        };

                        const statusName = statusMap[statusNum] || 'unknown';
                        logger.warn(`Pre-flight check: Loan ${loanId} is not active (status=${statusName})`, {
                            loanId,
                            status: statusNum,
                            statusName,
                        });

                        return {
                            success: false,
                            error: `Loan not active (status=${statusName})`,
                        };
                    }

                    logger.debug(`Pre-flight check passed for loan ${loanId}`, { loanId });
                } catch (preFlightError) {
                    logger.warn(`Pre-flight check failed for loan ${loanId}, proceeding anyway`, {
                        loanId,
                        error: preFlightError instanceof Error ? preFlightError.message : 'Unknown error',
                    });
                }
            }

            // Call liquidate_loan function
            const { waitForResult } = await contract.functions
                .liquidate_loan(loanIdNum)
                .call();

            // Wait for transaction to be mined
            const result = await waitForResult();

            logger.info(`Liquidation successful for loan ${loanId}`, {
                loanId,
                transactionId: result.transactionId,
            });

            return {
                success: true,
                txHash: result.transactionId,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // Categorize error types
            if (errorMessage.includes('ECannotLiquidate')) {
                logger.warn(`Loan ${loanId} cannot be liquidated (likely race condition)`, {
                    loanId,
                    error: errorMessage,
                });
            } else {
                logger.error(`Failed to liquidate loan ${loanId}`, error);
            }

            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Liquidate a loan with retry logic
     */
    async liquidateLoanWithRetry(loanId: string): Promise<LiquidationResult> {
        let lastError: string = '';

        for (let attempt = 1; attempt <= config.bot.maxRetries; attempt++) {
            try {
                logger.info(`Liquidation attempt ${attempt}/${config.bot.maxRetries}`, {
                    loanId,
                    attempt,
                });

                const result = await this.liquidateLoan(loanId);

                if (result.success) {
                    logger.info(`Liquidation successful on attempt ${attempt}`, {
                        loanId,
                        txHash: result.txHash,
                        attempt,
                    });
                    return result;
                }

                lastError = result.error || 'Unknown error';

                // Wait before retrying (exponential backoff)
                if (attempt < config.bot.maxRetries) {
                    const waitMs = Math.min(1000 * Math.pow(2, attempt), 10000);
                    logger.info(`Retrying in ${waitMs}ms`, { loanId, waitMs });
                    await this.sleep(waitMs);
                }
            } catch (error) {
                lastError = error instanceof Error ? error.message : 'Unknown error';
                logger.error(`Liquidation attempt ${attempt} failed`, error);
            }
        }

        logger.error(`All liquidation attempts failed for loan ${loanId}`, {
            loanId,
            attempts: config.bot.maxRetries,
            lastError,
        });

        return {
            success: false,
            error: `Failed after ${config.bot.maxRetries} attempts: ${lastError}`,
        };
    }

    /**
     * Get wallet balance (ETH/base asset)
     */
    async getBalance(): Promise<string> {
        try {
            // Use provider to get balance for wallet address
            const balances = await this.provider.getBalances(this.wallet.address);
            // Get the base asset (ETH) balance
            const baseBalance = balances.balances[0]?.amount || '0';
            return baseBalance.toString();
        } catch (error) {
            logger.error('Failed to fetch wallet balance', error);
            throw error;
        }
    }

    /**
     * Check if wallet has sufficient gas
     */
    async hasSufficientGas(minGasRequired: number): Promise<boolean> {
        try {
            const balance = await this.getBalance();
            return parseFloat(balance) >= minGasRequired;
        } catch (error) {
            logger.error('Failed to check gas balance', error);
            return false;
        }
    }

    /**
     * Helper function to sleep
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
