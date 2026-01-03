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

            // Use minimal ABI to avoid "Maximum call stack size exceeded" bug
            // in Fuel SDK v0.96.x caused by complex generic types in full ABI
            const { AXIOS_ABI_MINIMAL } = await import('./abi/axios-abi-minimal');
            const { Contract } = await import('fuels');

            // Create contract instance with wallet (wallet is an Account)
            const contract = new Contract(this.contractId, AXIOS_ABI_MINIMAL as any, this.wallet);

            // Call liquidate_loan function
            const loanIdNum = Number(loanId);
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
            logger.error(`Failed to liquidate loan ${loanId}`, error);

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
