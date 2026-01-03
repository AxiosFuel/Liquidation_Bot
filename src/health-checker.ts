import { Loan } from './fetcher';
import { PriceClient } from './price-client';
import { config } from './config/config';
import { logger } from './utils/logger';

/**
 * Result of health check
 */
export interface HealthCheckResult {
    shouldLiquidate: boolean;
    reason?: 'time_based' | 'health_factor';
    healthFactor?: number;
    details?: {
        collateralValueUsd: number;
        loanValueUsd: number;
        timeExpired: boolean;
    };
}

/**
 * Health checker for determining if loans should be liquidated
 */
export class HealthChecker {
    private priceClient: PriceClient;

    constructor(priceClient: PriceClient) {
        this.priceClient = priceClient;
    }

    /**
     * Check if a loan should be liquidated
     */
    async checkLoan(loan: Loan): Promise<HealthCheckResult> {
        try {
            // First, check time-based liquidation
            // Timestamps from DB are already Unix seconds
            const endsAtUnix = Number(loan.ends_at);
            const currentTime = Math.floor(Date.now() / 1000);
            const timeExpired = currentTime >= endsAtUnix;

            if (timeExpired) {
                logger.info(`Loan ${loan.id} has expired (time-based)`, {
                    startsAt: loan.starts_at,
                    endsAt: loan.ends_at,
                    endsAtUnix,
                    currentTime
                });

                return {
                    shouldLiquidate: true,
                    reason: 'time_based',
                    details: {
                        collateralValueUsd: 0,
                        loanValueUsd: 0,
                        timeExpired: true,
                    },
                };
            }

            // If not expired, check health factor
            const healthFactor = await this.calculateHealthFactor(loan);

            if (healthFactor < config.bot.healthFactorThreshold) {
                logger.info(`Loan ${loan.id} below health factor threshold`, {
                    healthFactor,
                    threshold: config.bot.healthFactorThreshold,
                });

                return {
                    shouldLiquidate: true,
                    reason: 'health_factor',
                    healthFactor,
                };
            }

            // Loan is healthy
            return {
                shouldLiquidate: false,
                healthFactor,
            };
        } catch (error) {
            logger.error(`Failed to check loan ${loan.id}`, error);
            throw error;
        }
    }

    /**
     * Calculate health factor for a loan
     * Health Factor = (Collateral Value USD) / (Debt Value USD)
     * 
     * IMPORTANT: Debt = repayment_amount (principal + interest), NOT principal_amount
     * Using principal would overestimate health factor and miss liquidatable loans
     */
    private async calculateHealthFactor(loan: Loan): Promise<number> {
        try {
            // Fetch prices for both assets
            const prices = await this.priceClient.getPrices([
                loan.collateral_token,
                loan.asset_token,
            ]);

            const collateralPrice = prices[loan.collateral_token];
            const loanPrice = prices[loan.asset_token];

            if (!collateralPrice || !loanPrice) {
                throw new Error(
                    `Missing price data for ${loan.collateral_token} or ${loan.asset_token}`
                );
            }

            // Calculate values in USD
            const collateralAmount = parseFloat(loan.collateral_amount);
            // CRITICAL: Use repayment_amount (total debt = principal + interest)
            // NOT principal_amount, which would underestimate debt and overestimate HF
            const debtAmount = parseFloat(loan.repayment_amount || loan.principal_amount);

            const collateralValueUsd = collateralAmount * collateralPrice;
            const debtValueUsd = debtAmount * loanPrice;

            // Calculate health factor: HF = Collateral Value / Debt Value
            // HF < 1.0 means undercollateralized (collateral worth less than debt)
            const healthFactor = collateralValueUsd / debtValueUsd;

            logger.debug(`Health factor calculated for loan ${loan.id}`, {
                collateralAmount,
                collateralPrice,
                collateralValueUsd,
                debtAmount,
                loanPrice,
                debtValueUsd,
                healthFactor,
            });

            return healthFactor;
        } catch (error) {
            logger.error(`Failed to calculate health factor for loan ${loan.id}`, error);
            throw error;
        }
    }

    /**
     * Batch check multiple loans
     */
    async checkLoans(loans: Loan[]): Promise<Map<string, HealthCheckResult>> {
        const results = new Map<string, HealthCheckResult>();

        // Process loans in parallel for efficiency
        await Promise.all(
            loans.map(async (loan) => {
                try {
                    const result = await this.checkLoan(loan);
                    results.set(loan.id, result);
                } catch (error) {
                    logger.error(`Failed to check loan ${loan.id}`, error);
                    // Continue processing other loans
                }
            })
        );

        return results;
    }
}
