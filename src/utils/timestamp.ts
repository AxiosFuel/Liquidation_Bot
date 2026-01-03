/**
 * TAI64 timestamp conversion utilities
 * TAI64 is used by Fuel Network for timestamps
 */

/**
 * TAI64 epoch offset
 * TAI64 timestamps are 64-bit and include leap seconds
 */
const TAI64_EPOCH_OFFSET = BigInt('4611686018427387914'); // 2^62 + 10

/**
 * Convert TAI64 timestamp to Unix timestamp (seconds since epoch)
 * @param tai64 - TAI64 timestamp as string or bigint
 * @returns Unix timestamp in seconds
 */
export function tai64ToUnix(tai64: string | bigint): number {
    const tai64Big = BigInt(tai64);
    const unixBig = tai64Big - TAI64_EPOCH_OFFSET;
    return Number(unixBig);
}

/**
 * Convert Unix timestamp to TAI64
 * @param unixSeconds - Unix timestamp in seconds
 * @returns TAI64 timestamp as bigint
 */
export function unixToTai64(unixSeconds: number): bigint {
    return BigInt(unixSeconds) + TAI64_EPOCH_OFFSET;
}

/**
 * Check if a loan has expired based on start time and duration
 * @param startedAtTai64 - Loan start timestamp in TAI64 format
 * @param durationSeconds - Loan duration in seconds
 * @returns true if loan has expired
 */
export function isLoanExpired(
    startedAtTai64: string | bigint,
    durationSeconds: number
): boolean {
    const startedAtUnix = tai64ToUnix(startedAtTai64);
    const expiryTime = startedAtUnix + durationSeconds;
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime >= expiryTime;
}

/**
 * Get time remaining until loan expires
 * @param startedAtTai64 - Loan start timestamp in TAI64 format
 * @param durationSeconds - Loan duration in seconds
 * @returns Seconds remaining (negative if expired)
 */
export function getTimeRemaining(
    startedAtTai64: string | bigint,
    durationSeconds: number
): number {
    const startedAtUnix = tai64ToUnix(startedAtTai64);
    const expiryTime = startedAtUnix + durationSeconds;
    const currentTime = Math.floor(Date.now() / 1000);

    return expiryTime - currentTime;
}
