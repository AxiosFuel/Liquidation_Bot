import TelegramBot from 'node-telegram-bot-api';
import { config } from './config/config';
import { logger } from './utils/logger';

/**
 * Telegram client for sending liquidation notifications
 */
export class TelegramClient {
    private bot: TelegramBot;
    private chatId: string;

    constructor() {
        this.bot = new TelegramBot(config.telegram.botToken);
        this.chatId = config.telegram.chatId;
    }

    /**
     * Send a scan completion notification
     */
    async sendScanNotification(
        activeLoansCount: number,
        liquidatableLoansCount: number
    ): Promise<void> {
        try {
            const message = `
🔍 *Liquidation Scan Complete*

• Active Loans Checked: \`${activeLoansCount}\`
• Liquidatable Loans: \`${liquidatableLoansCount}\`
• Timestamp: \`${new Date().toISOString()}\`
      `.trim();

            await this.bot.sendMessage(this.chatId, message, {
                parse_mode: 'Markdown',
            });

            logger.debug('Scan notification sent', {
                activeLoans: activeLoansCount,
                liquidatable: liquidatableLoansCount,
            });
        } catch (error) {
            logger.error('Failed to send scan notification', error);
        }
    }

    /**
     * Send a liquidation event notification
     */
    async sendLiquidationNotification(
        loanId: string,
        reason: 'time_based' | 'health_factor',
        txHash: string,
        healthFactor?: number
    ): Promise<void> {
        try {
            let message = `
⚡ *Liquidation Executed*

• Loan ID: \`${loanId}\`
• Reason: \`${reason}\`
      `.trim();

            if (healthFactor !== undefined) {
                message += `\n• Health Factor: \`${healthFactor.toFixed(4)}\``;
            }

            message += `
• Transaction Hash: \`${txHash}\`
• Timestamp: \`${new Date().toISOString()}\`
      `.trim();

            await this.bot.sendMessage(this.chatId, message, {
                parse_mode: 'Markdown',
            });

            logger.info('Liquidation notification sent', {
                loanId,
                reason,
                txHash,
                healthFactor,
            });
        } catch (error) {
            logger.error('Failed to send liquidation notification', error);
        }
    }

    /**
     * Send an error alert
     */
    async sendErrorAlert(errorMessage: string, context?: any): Promise<void> {
        try {
            let message = `
🚨 *Liquidation Bot Error*

• Error: \`${errorMessage}\`
• Timestamp: \`${new Date().toISOString()}\`
      `.trim();

            if (context) {
                message += `\n• Context: \`${JSON.stringify(context)}\``;
            }

            await this.bot.sendMessage(this.chatId, message, {
                parse_mode: 'Markdown',
            });

            logger.error('Error alert sent', { errorMessage, context });
        } catch (error) {
            logger.error('Failed to send error alert', error);
        }
    }

    /**
     * Send bot startup notification
     */
    async sendStartupNotification(): Promise<void> {
        try {
            const message = `
✅ *Liquidation Bot Started*

• Environment: \`${config.bot.dryRun ? 'DRY RUN' : 'PRODUCTION'}\`
• Scan Interval: \`${config.bot.scanIntervalMs / 1000}s\`
• Health Factor Threshold: \`${config.bot.healthFactorThreshold}\`
• Timestamp: \`${new Date().toISOString()}\`
      `.trim();

            await this.bot.sendMessage(this.chatId, message, {
                parse_mode: 'Markdown',
            });

            logger.info('Startup notification sent');
        } catch (error) {
            logger.error('Failed to send startup notification', error);
        }
    }
}
