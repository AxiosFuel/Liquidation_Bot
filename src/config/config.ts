import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration interface for the liquidation bot
 */
export interface Config {
    // Fuel Network
    fuel: {
        privateKey: string;
        rpcUrl: string;
        contractId: string;
    };

    // Supabase
    supabase: {
        url: string;
        anonKey: string;
    };

    // Price Oracle
    priceOracle: {
        provider: 'coingecko' | 'coinmarketcap' | 'pyth' | 'chainlink';
        url: string;
        apiKey?: string;
        coingeckoApiKey?: string;  // CoinGecko Demo API key for higher rate limits
        pythHermesUrl: string;     // Pyth Hermes endpoint URL
        cacheTtlMs: number;        // Price cache TTL in milliseconds
    };

    // Telegram
    telegram: {
        botToken: string;
        chatId: string;
    };

    // Bot Settings
    bot: {
        scanIntervalMs: number;
        healthFactorThreshold: number;
        dryRun: boolean;
        gasMultiplier: number;
        maxRetries: number;
        preFlightValidation: boolean;  // Enable on-chain status check before liquidation
        alertOnRaceConditions: boolean; // Send Telegram alerts for race conditions
    };

    // Logging
    logging: {
        level: 'debug' | 'info' | 'warn' | 'error';
    };
}

/**
 * Validate and return configuration
 */
function loadConfig(): Config {
    // Required environment variables
    const requiredVars = [
        'FUEL_PRIVATE_KEY',
        'FUEL_RPC_URL',
        'LOAN_CONTRACT_ID',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'TELEGRAM_BOT_TOKEN',
        'TELEGRAM_CHAT_ID',
    ];

    // Check for missing variables
    const missing = requiredVars.filter(v => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return {
        fuel: {
            privateKey: process.env.FUEL_PRIVATE_KEY!,
            rpcUrl: process.env.FUEL_RPC_URL!,
            contractId: process.env.LOAN_CONTRACT_ID!,
        },
        supabase: {
            url: process.env.SUPABASE_URL!,
            anonKey: process.env.SUPABASE_ANON_KEY!,
        },
        priceOracle: {
            provider: (process.env.PRICE_API_PROVIDER || 'coingecko') as 'coingecko' | 'coinmarketcap' | 'pyth' | 'chainlink',
            url: process.env.PRICE_API_URL || 'https://api.coingecko.com/api/v3',
            apiKey: process.env.PRICE_API_KEY,
            coingeckoApiKey: process.env.COINGECKO_API_KEY,
            pythHermesUrl: process.env.PYTH_HERMES_URL || 'https://hermes.pyth.network',
            cacheTtlMs: parseInt(process.env.PRICE_CACHE_TTL_MS || '300000', 10), // 5 min default
        },
        telegram: {
            botToken: process.env.TELEGRAM_BOT_TOKEN!,
            chatId: process.env.TELEGRAM_CHAT_ID!,
        },
        bot: {
            scanIntervalMs: parseInt(process.env.SCAN_INTERVAL_MS || '60000', 10),
            healthFactorThreshold: parseFloat(process.env.HEALTH_FACTOR_THRESHOLD || '1.0'),
            dryRun: process.env.DRY_RUN === 'true',
            gasMultiplier: parseFloat(process.env.GAS_MULTIPLIER || '1.2'),
            maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
            preFlightValidation: process.env.PRE_FLIGHT_VALIDATION !== 'false', // Default: true
            alertOnRaceConditions: process.env.ALERT_ON_RACE_CONDITIONS === 'true', // Default: false
        },
        logging: {
            level: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
        },
    };
}

// Export singleton config instance
export const config = loadConfig();
