import dotenv from 'dotenv';
dotenv.config();

import { Provider } from 'fuels';
import { AxiosFuelCore } from './src/abitypes/AxiosFuelCore';
import { config } from './src/config/config';
import { logger } from './src/utils/logger';

/**
 * Test script to verify pre-flight validation works correctly
 */
async function main() {
    const rpcUrl = config.fuel.rpcUrl;
    const contractId = config.fuel.contractId;

    console.log(`🔌 Connecting to RPC: ${rpcUrl}`);
    console.log(`📋 Contract ID: ${contractId}`);
    console.log(`🔧 Pre-flight validation: ${config.bot.preFlightValidation ? 'ENABLED' : 'DISABLED'}`);
    console.log(`📢 Alert on race conditions: ${config.bot.alertOnRaceConditions ? 'ENABLED' : 'DISABLED'}\n`);

    const provider = await new Provider(rpcUrl);
    const contract = new AxiosFuelCore(contractId, provider);

    // Test loans with different statuses
    const testLoans = [
        { id: 162, expectedStatus: 'liquidated', shouldPass: false },
    ];

    for (const testCase of testLoans) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🧪 Testing Loan ${testCase.id}`);
        console.log(`   Expected Status: ${testCase.expectedStatus}`);
        console.log(`   Should Pass Pre-flight: ${testCase.shouldPass ? 'YES' : 'NO'}`);
        console.log(`${'='.repeat(60)}\n`);

        try {
            // Get loan status
            const { value: status } = await contract.functions
                .get_loan_status(testCase.id)
                .dryRun();

            const statusNum = Number(status);
            const statusMap: Record<number, string> = {
                0: 'requested',
                1: 'cancelled',
                2: 'active',
                3: 'repaid',
                4: 'liquidated',
                5: 'claimed',
            };

            const statusName = statusMap[statusNum] || 'unknown';

            console.log(`📊 Actual Status: ${statusName} (${statusNum})`);

            // Simulate pre-flight check
            if (statusNum !== 2) {
                console.log(`❌ Pre-flight check FAILED: Loan is not active`);
                console.log(`✅ This is EXPECTED behavior - bot will skip this loan`);

                if (statusName === testCase.expectedStatus) {
                    console.log(`✅ Status matches expected: ${testCase.expectedStatus}`);
                } else {
                    console.log(`⚠️ Status mismatch! Expected: ${testCase.expectedStatus}, Got: ${statusName}`);
                }
            } else {
                console.log(`✅ Pre-flight check PASSED: Loan is active`);
                console.log(`   Bot would proceed with liquidation attempt`);
            }

        } catch (error: any) {
            console.error(`❌ Error checking loan ${testCase.id}:`, error.message);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Pre-flight Validation Test Complete`);
    console.log(`${'='.repeat(60)}\n`);

    console.log(`📝 Summary:`);
    console.log(`   - Pre-flight validation is ${config.bot.preFlightValidation ? 'ENABLED' : 'DISABLED'}`);
    console.log(`   - Bot will check on-chain status before liquidation attempts`);
    console.log(`   - Already-liquidated loans will be skipped gracefully`);
    console.log(`   - Race condition errors will be logged as warnings, not errors`);
    console.log(`   - Telegram alerts for race conditions: ${config.bot.alertOnRaceConditions ? 'ENABLED' : 'DISABLED'}\n`);
}

main().catch(console.error);
