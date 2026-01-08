import dotenv from 'dotenv';
dotenv.config();

import { PriceClient } from './src/price-client';

async function testPriceFetching() {
    console.log('🧪 Testing Price Fetching with CoinGecko\n');

    const priceClient = new PriceClient();

    const testAssets = [
        'ETH',
        'BTC',
        'USDC',
        'FUEL'
    ];

    console.log('Fetching prices for:', testAssets.join(', '));
    console.log('------------------------------------------------------------\n');

    for (const asset of testAssets) {
        try {
            const price = await priceClient.getPrice(asset);
            console.log(`✅ ${asset.padEnd(6)} $${price.toFixed(2)}`);
        } catch (error: any) {
            console.error(`❌ ${asset.padEnd(6)} Failed: ${error.message}`);
        }
    }

    console.log('\n------------------------------------------------------------');
    console.log('✅ Price fetching test complete!');
}

testPriceFetching().catch(console.error);
