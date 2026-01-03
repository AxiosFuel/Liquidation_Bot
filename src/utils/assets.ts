/**
 * Asset ID to Symbol mapping
 * Used to convert Fuel asset IDs to standard symbols for price fetching
 */
export const ASSET_MAP: Record<string, string> = {
    // ETH
    '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07': 'ETH',

    // USDC (Multiple variants might exist on beta/testnets, adding common ones)
    '0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b': 'USDC',
    '0xd02112ef9c39f1cea7c8527c26242ca1f5d26bcfe8d1564bee054d3b04175471': 'USDC',
    '0xc26c91055de37528492e7e97d91c6f4abe34aae26f2c4d25cff6bfe45b5dc9a9': 'USDC',

    // FUEL
    '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82': 'FUEL',

    // BTC (If known)
    // Add more as needed
};

/**
 * Get symbol from asset ID
 * @param assetId - Asset ID (hex string)
 * @returns Symbol (e.g., 'ETH') or original ID if not found
 */
export function getSymbolFromAssetId(assetId: string): string {
    // Normalize to lowercase for case-insensitive lookup
    const normalizedId = assetId.toLowerCase();

    // Check direct match
    if (ASSET_MAP[normalizedId]) {
        return ASSET_MAP[normalizedId];
    }

    // Check case-insensitive match from map keys
    const match = Object.keys(ASSET_MAP).find(k => k.toLowerCase() === normalizedId);
    if (match) {
        return ASSET_MAP[match];
    }

    // Default to original ID if no mapping found (might be a symbol already)
    return assetId;
}
