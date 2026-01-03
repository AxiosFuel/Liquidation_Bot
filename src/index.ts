import { SupabaseFetcher } from './fetcher';
import { HealthChecker } from './health-checker';
import { Liquidator } from './liquidator';
import { PriceClient } from './price-client';
import { TelegramClient } from './telegram-client';
import { config } from './config/config';
import { logger } from './utils/logger';

/**
 * Main bot orchestrator
 */
export class LiquidationBot {
    private fetcher: SupabaseFetcher;
    private priceClient: PriceClient;
    private healthChecker: HealthChecker;
    private liquidator: Liquidator;
    private telegramClient: TelegramClient;
    private isRunning: boolean = false;
    private scanIntervalId?: NodeJS.Timeout;

    constructor() {
        this.fetcher = new SupabaseFetcher();
        this.priceClient = new PriceClient();
        this.healthChecker = new HealthChecker(this.priceClient);
        this.liquidator = new Liquidator();
        this.telegramClient = new TelegramClient();
    }

    /**
     * Start the bot
     */
    async start(): Promise<void> {
        if (this.isRunning) {
            logger.warn('Bot is already running');
            return;
        }

        this.isRunning = true;
        logger.info('Starting liquidation bot', {
            scanInterval: config.bot.scanIntervalMs,
            dryRun: config.bot.dryRun,
        });

        // Initialize liquidator
        await this.liquidator.initialize();

        // Send startup notification
        await this.telegramClient.sendStartupNotification();

        // Run initial scan
        await this.runScanCycle();

        // Set up recurring scans
        this.scanIntervalId = setInterval(
            () => this.runScanCycle(),
            config.bot.scanIntervalMs
        );

        logger.info('Bot started successfully');
    }

    /**
     * Stop the bot
     */
    async stop(): Promise<void> {
        if (!this.isRunning) {
            logger.warn('Bot is not running');
            return;
        }

        logger.info('Stopping liquidation bot');

        if (this.scanIntervalId) {
            clearInterval(this.scanIntervalId);
            this.scanIntervalId = undefined;
        }

        this.isRunning = false;
        logger.info('Bot stopped');
    }

    /**
     * Run a single scan cycle
     */
    private async runScanCycle(): Promise<void> {
        try {
            logger.info('Starting scan cycle');

            // Fetch active loans
            const activeLoans = await this.fetcher.fetchActiveLoans();

            if (activeLoans.length === 0) {
                logger.info('No active loans found');
                await this.telegramClient.sendScanNotification(0, 0);
                return;
            }

            // Check health of all loans
            const healthResults = await this.healthChecker.checkLoans(activeLoans);

            // Find loans that should be liquidated
            const loansToLiquidate = Array.from(healthResults.entries())
                .filter(([_, result]) => result.shouldLiquidate)
                .map(([loanId, result]) => ({ loanId, result }));

            logger.info('Scan cycle complete', {
                totalLoans: activeLoans.length,
                liquidatableLoans: loansToLiquidate.length,
            });

            // Send scan notification
            await this.telegramClient.sendScanNotification(
                activeLoans.length,
                loansToLiquidate.length
            );

            // Execute liquidations
            for (const { loanId, result } of loansToLiquidate) {
                await this.executeLiquidation(loanId, result.reason!, result.healthFactor);
            }
        } catch (error) {
            logger.error('Error during scan cycle', error);
            await this.telegramClient.sendErrorAlert(
                'Scan cycle failed',
                { error: error instanceof Error ? error.message : 'Unknown error' }
            );
        }
    }

    /**
     * Execute a liquidation
     */
    private async executeLiquidation(
        loanId: string,
        reason: 'time_based' | 'health_factor',
        healthFactor?: number
    ): Promise<void> {
        try {
            logger.info(`Executing liquidation for loan ${loanId}`, {
                loanId,
                reason,
                healthFactor,
            });

            // Execute liquidation with retry
            const result = await this.liquidator.liquidateLoanWithRetry(loanId);

            if (result.success) {
                // Send success notification
                await this.telegramClient.sendLiquidationNotification(
                    loanId,
                    reason,
                    result.txHash!,
                    healthFactor
                );

                logger.info(`Liquidation successful for loan ${loanId}`, {
                    loanId,
                    txHash: result.txHash,
                });
            } else {
                // Send error notification
                await this.telegramClient.sendErrorAlert(
                    `Liquidation failed for loan ${loanId}`,
                    {
                        loanId,
                        reason,
                        error: result.error,
                    }
                );

                logger.error(`Liquidation failed for loan ${loanId}`, {
                    loanId,
                    error: result.error,
                });
            }
        } catch (error) {
            logger.error(`Error executing liquidation for loan ${loanId}`, error);
            await this.telegramClient.sendErrorAlert(
                `Liquidation error for loan ${loanId}`,
                { loanId, error: error instanceof Error ? error.message : 'Unknown error' }
            );
        }
    }

    /**
     * Check bot health
     */
    async checkHealth(): Promise<{
        isRunning: boolean;
        walletBalance?: string;
        lastScanTime?: number;
    }> {
        const health = {
            isRunning: this.isRunning,
            walletBalance: undefined as string | undefined,
            lastScanTime: Date.now(),
        };

        try {
            health.walletBalance = await this.liquidator.getBalance();
        } catch (error) {
            logger.error('Failed to check wallet balance', error);
        }

        return health;
    }
}

/**
 * Main entry point
 */
async function main() {
    try {
        logger.info('Initializing liquidation bot');

        const bot = new LiquidationBot();

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            logger.info('Received SIGINT, shutting down gracefully');
            await bot.stop();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            logger.info('Received SIGTERM, shutting down gracefully');
            await bot.stop();
            process.exit(0);
        });

        // Start the bot
        await bot.start();
    } catch (error) {
        logger.error('Fatal error', error);
        process.exit(1);
    }
}

// Run if this is the main module
if (require.main === module) {
    main();
}
