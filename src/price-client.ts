import axios, { AxiosInstance } from 'axios';
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
 * Price client for fetching asset prices from external APIs
 */
export class PriceClient {
    private client: AxiosInstance;
    private provider: string;
    private cache: Map<string, { price: number; expiry: number }>;
    private readonly CACHE_TTL_MS = 30000; // 30 seconds

    constructor() {
        this.provider = config.priceOracle.provider;
        this.client = axios.create({
            baseURL: config.priceOracle.url,
            timeout: 10000,
            headers: config.priceOracle.apiKey
                ? { 'X-API-Key': config.priceOracle.apiKey }
                : {},
        });
        this.cache = new Map();
    }

    /**
     * Get price for an asset in USD
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

        try {
            let price: number;

            switch (this.provider) {
                case 'coingecko':
                    price = await this.getPriceFromCoinGecko(asset);
                    break;
                case 'coinmarketcap':
                    price = await this.getPriceFromCoinMarketCap(asset);
                    break;
                case 'pyth':
                    price = await this.getPriceFromPyth(asset);
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
                expiry: Date.now() + this.CACHE_TTL_MS,
            });

            logger.debug(`Fetched price for ${asset}`, { price, provider: this.provider });
            return price;
        } catch (error) {
            logger.error(`Failed to fetch price for ${asset}`, error);
            throw error;
        }
    }

    /**
     * Get price from CoinGecko API
     */
    private async getPriceFromCoinGecko(asset: string): Promise<number> {
        // Map asset symbols to CoinGecko IDs
        const idMap: Record<string, string> = {
            ETH: 'ethereum',
            BTC: 'bitcoin',
            USDC: 'usd-coin',
            USDT: 'tether',
            DAI: 'dai',
            FUEL: 'fuel-network', // Assuming 'fuel-network' is the ID on CoinGecko, or might need to check
            // Add more mappings as needed
        };

        const coinId = idMap[asset.toUpperCase()];
        if (!coinId) {
            throw new Error(`Unknown asset for CoinGecko: ${asset}`);
        }

        const response = await this.client.get('/simple/price', {
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
        // CMC uses standard symbols usually, but we can verify
        const symbol = asset.toUpperCase();

        try {
            // Using quotes/latest endpoint
            // Headers for CMC are usually 'X-CMC_PRO_API_KEY'
            const response = await this.client.get('/v1/cryptocurrency/quotes/latest', {
                params: {
                    symbol: symbol,
                    convert: 'USD',
                },
                // Override headers if needed, though config should have set X-API-Key which might need adjustment
                // Config sets 'X-API-Key'. CMC expects 'X-CMC_PRO_API_KEY'.
                // We'll adjust the header here if the config one isn't right, or rely on the user to set it correctly in config if strictly generic.
                // Better to force the correct header for CMC here.
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
     * Get price from Pyth Network
     * TODO: Implement Pyth integration
     */
    private async getPriceFromPyth(_asset: string): Promise<number> {
        throw new Error('Pyth integration not yet implemented');
    }

    /**
     * Get price from Chainlink
     * TODO: Implement Chainlink integration
     */
    private async getPriceFromChainlink(_asset: string): Promise<number> {
        throw new Error('Chainlink integration not yet implemented');
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
