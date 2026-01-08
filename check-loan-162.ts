import dotenv from 'dotenv';
dotenv.config();

import { Provider } from 'fuels';
import { AxiosFuelCore } from './src/abitypes/AxiosFuelCore';

async function main() {
    const rpcUrl = process.env.FUEL_RPC_URL || 'https://mainnet.fuel.network/v1/graphql';
    const contractId = process.env.LOAN_CONTRACT_ID;

    if (!contractId) {
        console.error('❌ Missing Contract ID');
        process.exit(1);
    }

    console.log(`🔌 Connecting to RPC: ${rpcUrl}`);
    console.log(`📋 Contract ID: ${contractId}`);

    const provider = await new Provider(rpcUrl);
    const contract = new AxiosFuelCore(contractId, provider);

    const loanId = 162;

    console.log(`\n🔍 Checking Loan ${loanId}`);
    console.log('------------------------------------------------------------');

    try {
        // 1. Get loan details
        const { value: loan } = await contract.functions.get_loan(loanId).dryRun();
        const { value: status } = await contract.functions.get_loan_status(loanId).dryRun();

        console.log(`\n📊 Loan Details:`);
        console.log(`   Status:       ${status} (0=requested, 1=cancelled, 2=active, 3=repaid, 4=liquidated, 5=claimed)`);
        console.log(`   Borrower:     ${loan.borrower?.bits || loan.borrower}`);
        console.log(`   Lender:       ${loan.lender?.bits || loan.lender}`);
        console.log(`   Asset:        ${loan.asset}`);
        console.log(`   Collateral:   ${loan.collateral}`);
        console.log(`   Asset Amount: ${loan.asset_amount.toString()}`);
        console.log(`   Repay Amount: ${loan.repayment_amount.toString()}`);
        console.log(`   Collat Amt:   ${loan.collateral_amount.toString()}`);
        console.log(`   Start Time:   ${loan.start_timestamp.toString()}`);
        console.log(`   Duration:     ${loan.duration.toString()}`);

        // 2. Check if oracle-based liquidation
        const { value: isOracleLiq } = await contract.functions
            .is_loan_liquidation_by_oracle(loanId)
            .dryRun();

        console.log(`\n🔍 Liquidation Checks:`);
        console.log(`   Oracle-based: ${isOracleLiq ? '✅ YES' : '❌ NO'}`);

        // 3. Check liquidation status
        try {
            const { value: liqStatus } = await contract.functions
                .calculate_liquidation_status_public(loanId)
                .dryRun();

            const [assetPrice, collateralPrice, colAmount, lendAmount, liqFee, protoFee, canLiquidate] = liqStatus;

            console.log(`\n💰 Liquidation Status:`);
            console.log(`   Can Liquidate: ${canLiquidate ? '✅ YES' : '❌ NO'}`);
            console.log(`   Asset Price:   ${assetPrice.toString()}`);
            console.log(`   Collat Price:  ${collateralPrice.toString()}`);
            console.log(`   Collat Amount: ${colAmount.toString()}`);
            console.log(`   Lend Amount:   ${lendAmount.toString()}`);
            console.log(`   Liquidator Fee: ${liqFee.toString()}`);
            console.log(`   Protocol Fee:   ${protoFee.toString()}`);

            const healthFactor = (Number(colAmount) * Number(collateralPrice)) / (Number(lendAmount) * Number(assetPrice));
            console.log(`   Health Factor: ${healthFactor.toFixed(4)}`);

        } catch (e: any) {
            console.log(`   ⚠️ Liquidation Status Check Failed: ${e.message}`);
        }

        // 4. Time check
        const now = Math.floor(Date.now() / 1000);
        const endsAt = Number(loan.start_timestamp) + Number(loan.duration);
        const isExpired = now > endsAt;
        const hoursOverdue = (now - endsAt) / 3600;

        console.log(`\n⏰ Time Check:`);
        console.log(`   Start Time:    ${loan.start_timestamp.toString()}`);
        console.log(`   Duration:      ${loan.duration.toString()} seconds`);
        console.log(`   Ends At:       ${endsAt}`);
        console.log(`   Current Time:  ${now}`);
        console.log(`   Expired:       ${isExpired ? `✅ YES (${hoursOverdue.toFixed(1)}h overdue)` : '❌ NO'}`);

        // 5. Liquidation flag
        console.log(`\n🚩 Liquidation Config:`);
        console.log(`   Threshold (bps): ${loan.liquidation?.liquidation_threshold_in_bps?.toString() || 'N/A'}`);
        console.log(`   Internal Flag:   ${loan.liquidation?.liquidation_flag_internal ? 'true' : 'false'}`);

        console.log(`\n📝 Summary:`);
        if (status !== 2) {
            console.log(`   ❌ Loan is not active (status=${status}). Cannot liquidate.`);
        } else if (!isOracleLiq && !isExpired) {
            console.log(`   ❌ Loan is not oracle-based AND not expired. Cannot liquidate.`);
        } else if (isOracleLiq && !isExpired) {
            console.log(`   ⚠️ Loan is oracle-based but not expired. Check health factor.`);
        } else if (isExpired) {
            console.log(`   ✅ Loan is expired. Should be liquidatable.`);
        }

    } catch (error: any) {
        console.error(`❌ Error checking loan ${loanId}:`, error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

main().catch(console.error);
