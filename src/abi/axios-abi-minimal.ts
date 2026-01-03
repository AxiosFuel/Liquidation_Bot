/**
 * Minimal ABI for liquidation bot
 * 
 * This stripped-down ABI only includes the `liquidate_loan` function
 * to avoid the "Maximum call stack size exceeded" bug in Fuel SDK v0.96.x
 * caused by complex generic types like Vec<TemporalNumericValueInput>.
 * 
 * The full ABI has circular type references that cause infinite recursion
 * in the SDK's structuredClone during ABI type resolution.
 */
export const AXIOS_ABI_MINIMAL = {
    "programType": "contract",
    "specVersion": "1.1",
    "encodingVersion": "1",
    "concreteTypes": [
        {
            "type": "()",
            "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
            "type": "u64",
            "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
    ],
    "metadataTypes": [],
    "functions": [
        {
            "name": "liquidate_loan",
            "inputs": [
                {
                    "name": "loan_id",
                    "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
                }
            ],
            "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
            "attributes": [
                {
                    "name": "storage",
                    "arguments": [
                        "read",
                        "write"
                    ]
                }
            ]
        }
    ],
    "loggedTypes": [],
    "messagesTypes": [],
    "configurables": [],
    "errorCodes": {},
    "panickingCalls": {}
} as const;
