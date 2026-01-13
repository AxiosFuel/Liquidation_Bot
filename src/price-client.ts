import axios, { AxiosInstance } from 'axios';
import { HermesClient } from '@pythnetwork/hermes-client';
import { config } from './config/config';
import { logger } from './utils/logger';
import { getSymbolFromAssetId } from './utils/assets';

/**
 * Price data for an asset
 */
export interface PriceData {
    asset: string;
    priceUsd: number;
    timestamp: number;
}

/**
 * Pyth Price Feed IDs for supported assets
 * @see https://pyth.network/developers/price-feed-ids
 * Note: FUEL/USD is NOT available on Pyth - uses CoinGecko fallback
 */
const PYTH_PRICE_FEED_IDS: Record<string, string> = {
    ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    BTC: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    USDC: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
    USDT: '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
    // FUEL: Not available on Pyth - automatically falls back to CoinGecko
};

/**
 * Stork Oracle asset ID mapping
 * Format: {SYMBOL}USD (e.g., FUELUSD, ETHUSD, USDCUSD)
 */
const STORK_ASSET_IDS: Record<string, string> = {
    ETH: 'ETHUSD',
    BTC: 'BTCUSD',
    USDC: 'USDCUSD',
    USDT: 'USDTUSD',
    FUEL: 'FUELUSD',
};

/**
 * Stork Oracle API Response Types
 */
interface StorkSignature {
    r: string;
    s: string;
    v: string;
}

interface StorkTimestampedSignature {
    signature: StorkSignature;
    timestamp: number;
    msg_hash: string;
}

interface StorkCalculationAlgorithm {
    type: string;
    version: string;
    checksum: string;
}

interface StorkSignedPrice {
    public_key: string;
    encoded_asset_id: string;
    price: string;
    timestamped_signature: StorkTimestampedSignature;
    publisher_merkle_root: string;
    calculation_alg: StorkCalculationAlgorithm;
}

interface StorkPublisherSignedPrice {
    publisher_key: string;
    external_asset_id: string;
    signature_type: string;
    price: string;
    timestamped_signature: StorkTimestampedSignature;
}

interface StorkAssetPrice {
    timestamp: number;
    asset_id: string;
    signature_type: string;
    trigger: string;
    price: string;
    stork_signed_price: StorkSignedPrice;
    signed_prices: StorkPublisherSignedPrice[];
}

interface StorkPriceResponse {
    data: {
        [assetId: string]: StorkAssetPrice;
    };
}

/**
 * Price client with multi-provider fallback: Primary → CoinGecko → Pyth
 */
export class PriceClient {
    private client: AxiosInstance;
    private provider: string;
    private cache: Map<string, { price: number; expiry: number }>;
    private readonly cacheTtlMs: number;
    private hermesClient: HermesClient;

    constructor() {
        this.provider = config.priceOracle.provider;
        this.cacheTtlMs = config.priceOracle.cacheTtlMs;

        this.client = axios.create({
            baseURL: config.priceOracle.url,
            timeout: 10000,
            headers: config.priceOracle.apiKey
                ? { 'X-API-Key': config.priceOracle.apiKey }
                : {},
        });

        this.cache = new Map();
        this.hermesClient = new HermesClient(config.priceOracle.pythHermesUrl);

        logger.info('PriceClient initialized', {
            provider: this.provider,
            cacheTtlMs: this.cacheTtlMs,
            pythHermesUrl: config.priceOracle.pythHermesUrl,
            storkUrl: config.priceOracle.storkUrl,
            hasCoinGeckoKey: !!config.priceOracle.coingeckoApiKey,
            hasStorkKey: !!config.priceOracle.storkApiKey,
        });
    }

    /**
     * Get price for an asset in USD with multi-provider fallback
     */
    async getPrice(assetId: string): Promise<number> {
        // Resolve symbol from asset ID
        const asset = getSymbolFromAssetId(assetId);

        // Check cache first
        const cached = this.cache.get(asset);
        if (cached && cached.expiry > Date.now()) {
            logger.debug(`Using cached price for ${asset}`, { price: cached.price });
            return cached.price;
        }

        // Try primary provider first
        try {
            let price: number;

            switch (this.provider) {
                case 'stork':
                    price = await this.getPriceFromStork(asset);
                    break;
                case 'coingecko':
                    price = await this.getPriceFromCoinGecko(asset);
                    break;
                case 'coinmarketcap':
                    price = await this.getPriceFromCoinMarketCap(asset);
                    break;
                case 'pyth':
                    // Check if Pyth supports this asset, otherwise go straight to fallback
                    if (PYTH_PRICE_FEED_IDS[asset.toUpperCase()]) {
                        price = await this.getPriceFromPyth(asset);
                    } else {
                        // Skip Pyth for unsupported assets (e.g., FUEL)
                        logger.debug(`Asset ${asset} not on Pyth, using fallback`);
                        return this.tryFallbackProviders(asset);
                    }
                    break;
                case 'chainlink':
                    price = await this.getPriceFromChainlink(asset);
                    break;
                default:
                    throw new Error(`Unsupported price provider: ${this.provider}`);
            }

            // Cache the price
            this.cache.set(asset, {
                price,
                expiry: Date.now() + this.cacheTtlMs,
            });

            logger.debug(`Fetched price for ${asset}`, { price, provider: this.provider });
            return price;
        } catch (primaryError) {
            // Check if it's a rate limit error (429) or other failure
            const isRateLimitError = axios.isAxiosError(primaryError) && primaryError.response?.status === 429;

            if (isRateLimitError) {
                logger.warn(`Primary provider ${this.provider} rate limited for ${asset}, trying fallback...`);
            } else {
                logger.warn(`Primary provider ${this.provider} failed for ${asset}, trying fallback...`, primaryError);
            }

            // Try fallback chain: CoinGecko → Pyth
            return this.tryFallbackProviders(asset);
        }
    }

    /**
     * Try fallback providers in order: CoinGecko → Pyth
     */
    private async tryFallbackProviders(asset: string): Promise<number> {
        const fallbacks: Array<{ name: string; fn: () => Promise<number> }> = [];

        // Add Stork if not primary (partnership API - most reliable)
        if (this.provider !== 'stork' && STORK_ASSET_IDS[asset.toUpperCase()]) {
            fallbacks.push({
                name: 'Stork',
                fn: () => this.getPriceFromStork(asset),
            });
        }

        // Add CoinGecko if not primary
        if (this.provider !== 'coingecko') {
            fallbacks.push({
                name: 'CoinGecko',
                fn: () => this.getPriceFromCoinGecko(asset),
            });
        }

        // Always add Pyth as last resort (no rate limits)
        if (this.provider !== 'pyth' && PYTH_PRICE_FEED_IDS[asset.toUpperCase()]) {
            fallbacks.push({
                name: 'Pyth',
                fn: () => this.getPriceFromPyth(asset),
            });
        }

        for (const fallback of fallbacks) {
            try {
                const price = await fallback.fn();

                // Cache the fallback price
                this.cache.set(asset, {
                    price,
                    expiry: Date.now() + this.cacheTtlMs,
                });

                logger.info(`Fetched price for ${asset} using fallback (${fallback.name})`, { price });
                return price;
            } catch (error) {
                logger.warn(`Fallback ${fallback.name} failed for ${asset}`, error);
            }
        }

        throw new Error(`All price providers failed for ${asset}`);
    }

    /**
     * Get price from CoinGecko API (with optional Demo API key)
     */
    private async getPriceFromCoinGecko(asset: string): Promise<number> {
        // Map asset symbols to CoinGecko IDs
        const idMap: Record<string, string> = {
            ETH: 'ethereum',
            BTC: 'bitcoin',
            USDC: 'usd-coin',
            USDT: 'tether',
            DAI: 'dai',
            FUEL: 'fuel-network',
        };

        const coinId = idMap[asset.toUpperCase()];
        if (!coinId) {
            throw new Error(`Unknown asset for CoinGecko: ${asset}`);
        }

        // Build headers - include API key if available
        const headers: Record<string, string> = {};
        if (config.priceOracle.coingeckoApiKey) {
            headers['x-cg-demo-api-key'] = config.priceOracle.coingeckoApiKey;
        }

        // Create dedicated CoinGecko client
        const coingeckoClient = axios.create({
            baseURL: 'https://api.coingecko.com/api/v3',
            timeout: 10000,
            headers,
        });

        const response = await coingeckoClient.get('/simple/price', {
            params: {
                ids: coinId,
                vs_currencies: 'usd',
            },
        });

        const price = response.data[coinId]?.usd;
        if (!price) {
            throw new Error(`Price not found for ${asset}`);
        }

        return price;
    }

    /**
     * Get price from CoinMarketCap API
     */
    private async getPriceFromCoinMarketCap(asset: string): Promise<number> {
        const symbol = asset.toUpperCase();

        try {
            const response = await this.client.get('/v1/cryptocurrency/quotes/latest', {
                params: {
                    symbol: symbol,
                    convert: 'USD',
                },
                headers: {
                    'X-CMC_PRO_API_KEY': config.priceOracle.apiKey
                }
            });

            const data = response.data?.data?.[symbol];
            if (!data) {
                throw new Error(`Price not found for ${asset}`);
            }

            const price = data.quote?.USD?.price;
            if (typeof price !== 'number') {
                throw new Error(`Invalid price format for ${asset}`);
            }

            return price;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                logger.error(`CMC API Error: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
            }
            throw error;
        }
    }

    /**
     * Get price from Pyth Network via Hermes API
     */
    private async getPriceFromPyth(asset: string): Promise<number> {
        const feedId = PYTH_PRICE_FEED_IDS[asset.toUpperCase()];
        if (!feedId) {
            throw new Error(`Unknown asset for Pyth: ${asset}`);
        }

        try {
            const priceUpdates = await this.hermesClient.getLatestPriceUpdates([feedId]);

            if (!priceUpdates?.parsed || priceUpdates.parsed.length === 0) {
                throw new Error(`No price update found for ${asset}`);
            }

            const priceFeed = priceUpdates.parsed[0];
            const priceData = priceFeed.price;

            // Pyth prices are in fixed-point format with an exponent
            // price * 10^expo = actual price
            const price = Number(priceData.price) * Math.pow(10, priceData.expo);

            if (isNaN(price) || price <= 0) {
                throw new Error(`Invalid Pyth price for ${asset}: ${price}`);
            }

            logger.debug(`Pyth price for ${asset}`, {
                rawPrice: priceData.price,
                expo: priceData.expo,
                computedPrice: price
            });

            return price;
        } catch (error) {
            logger.error(`Pyth API Error for ${asset}`, error);
            throw error;
        }
    }

    /**
     * Get price from Chainlink
     * TODO: Implement Chainlink integration
     */
    private async getPriceFromChainlink(_asset: string): Promise<number> {
        throw new Error('Chainlink integration not yet implemented');
    }

    /**
     * Get price from Stork Oracle API (partnership)
     * @see https://rest.jp.stork-oracle.network
     */
    private async getPriceFromStork(asset: string): Promise<number> {
        const assetId = STORK_ASSET_IDS[asset.toUpperCase()];
        if (!assetId) {
            throw new Error(`Unknown asset for Stork: ${asset}`);
        }

        if (!config.priceOracle.storkApiKey) {
            throw new Error('Stork API key not configured');
        }

        try {
            const response = await axios.get<StorkPriceResponse>(
                `${config.priceOracle.storkUrl}/v1/prices/latest`,
                {
                    params: { assets: assetId },
                    headers: {
                        'Authorization': config.priceOracle.storkApiKey,
                        'Accept': '*/*',
                    },
                    timeout: 10000,
                }
            );

            const priceData = response.data?.data?.[assetId];
            if (!priceData) {
                throw new Error(`Price not found for ${asset} (${assetId})`);
            }

            // Stork prices are in 18-decimal format, divide by 10^18
            const rawPrice = BigInt(priceData.price);
            const price = Number(rawPrice) / 1e18;

            if (isNaN(price) || price <= 0) {
                throw new Error(`Invalid Stork price for ${asset}: ${price}`);
            }

            logger.debug(`Stork price for ${asset}`, {
                assetId,
                rawPrice: priceData.price,
                computedPrice: price,
                timestamp: priceData.timestamp,
            });

            return price;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                logger.error(`Stork API Error: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
            }
            throw error;
        }
    }

    /**
     * Get prices for multiple assets (batch request)
     */
    async getPrices(assets: string[]): Promise<Record<string, number>> {
        const prices: Record<string, number> = {};

        await Promise.all(
            assets.map(async (asset) => {
                try {
                    prices[asset] = await this.getPrice(asset);
                } catch (error) {
                    logger.error(`Failed to fetch price for ${asset}`, error);
                    throw error;
                }
            })
        );

        return prices;
    }

    /**
     * Clear price cache
     */
    clearCache(): void {
        this.cache.clear();
        logger.debug('Price cache cleared');
    }
}
