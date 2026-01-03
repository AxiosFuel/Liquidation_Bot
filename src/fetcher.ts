import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config/config';
import { logger } from './utils/logger';

/**
 * Loan data structure from Supabase
 */
export interface Loan {
    id: string; // bigint in DB, but returned as string/number by Supabase
    status: string;
    starts_at: number; // Unix timestamp (seconds)
    ends_at: number;   // Unix timestamp (seconds)
    collateral_amount: string; // numeric
    collateral_token: string;  // mapped from collateral_asset
    principal_amount: string;  // numeric, mapped from loan_amount
    asset_token: string;       // mapped from loan_asset
    borrower: string;
    lender: string;
    health_factor?: number;
}

/**
 * Supabase client for fetching loan data
 */
export class SupabaseFetcher {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(
            config.supabase.url,
            config.supabase.anonKey,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
            }
        );
    }

    /**
     * Fetch all active loans
     */
    async fetchActiveLoans(): Promise<Loan[]> {
        try {
            logger.debug('Fetching active loans from Supabase');

            const { data, error } = await this.client
                .from('loans')
                .select('*')
                .eq('status', 'active');

            if (error) {
                throw new Error(`Supabase error: ${error.message}`);
            }

            logger.info(`Fetched ${data?.length || 0} active loans`);
            return (data as Loan[]) || [];
        } catch (error) {
            logger.error('Failed to fetch active loans', error);
            throw error;
        }
    }

    /**
     * Fetch loan details by ID
     */
    async fetchLoanById(loanId: string): Promise<Loan | null> {
        try {
            logger.debug(`Fetching loan details for ID: ${loanId}`);

            const { data, error } = await this.client
                .from('loans')
                .select('*')
                .eq('id', loanId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Not found
                    return null;
                }
                throw new Error(`Supabase error: ${error.message}`);
            }

            return data as Loan;
        } catch (error) {
            logger.error(`Failed to fetch loan ${loanId}`, error);
            throw error;
        }
    }

    /**
     * Fetch loans that are close to expiration (within threshold)
     * Useful for optimizing scan frequency
     */
    async fetchLoansNearExpiration(thresholdSeconds: number): Promise<Loan[]> {
        try {
            const activeLoans = await this.fetchActiveLoans();
            const currentTime = Math.floor(Date.now() / 1000);

            // Filter loans expiring within threshold
            return activeLoans.filter(loan => {
                const endsAt = Number(loan.ends_at);
                const timeUntilExpiry = endsAt - currentTime;
                return timeUntilExpiry <= thresholdSeconds && timeUntilExpiry > 0;
            });
        } catch (error) {
            logger.error('Failed to fetch loans near expiration', error);
            throw error;
        }
    }
}
