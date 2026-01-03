export const AXIOS_ABI = 
{
  "programType": "contract",
  "specVersion": "1.1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "b256",
      "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
    },
    {
      "type": "bool",
      "concreteTypeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
    },
    {
      "type": "enum interface::Error",
      "concreteTypeId": "0fe12ec05d225d08dc236ce4be213977fa8c3aeb6ecf2ea110db0c98562addbf",
      "metadataTypeId": 0
    },
    {
      "type": "struct events::ClaimExpiredLoanOfferEvent",
      "concreteTypeId": "a95db35f41d9d9477af218f5e6a37f413e7c4317b8899d2df6fea6731e9a2fbc",
      "metadataTypeId": 3
    },
    {
      "type": "struct events::ClaimExpiredLoanReqEvent",
      "concreteTypeId": "f6df2022fdb75087ab418ac68cbfed3fa909a6c6a1e4486312567b04dba1366b",
      "metadataTypeId": 4
    },
    {
      "type": "struct events::LoanCancelledEvent",
      "concreteTypeId": "bcc38605ef8c3b26805a90de68ef3a0d989dcc8ad1ec93862aff659a8c2e8c41",
      "metadataTypeId": 5
    },
    {
      "type": "struct events::LoanFilledEvent",
      "concreteTypeId": "64a67c4185ba6b7aeb197b01932d8daa08bcf7dfa434490666c0edfe1b5b1b57",
      "metadataTypeId": 6
    },
    {
      "type": "struct events::LoanLiquidatedEvent",
      "concreteTypeId": "074dc5f60836a66affaf06a376fb5ec0fd1e72acbe77891b3605feb941b2da1d",
      "metadataTypeId": 7
    },
    {
      "type": "struct events::LoanOfferFilledEvent",
      "concreteTypeId": "379926cbfc86ebd5d85757c0f1709c6394d4c9ca64953ed66eea3393475b4fd7",
      "metadataTypeId": 8
    },
    {
      "type": "struct events::LoanOfferedCancelledEvent",
      "concreteTypeId": "e7ae153e834c2c41b423b9a343a66a98834c30592f409dc92ba11125d1f8c2fd",
      "metadataTypeId": 9
    },
    {
      "type": "struct events::LoanOfferedEvent",
      "concreteTypeId": "e5196a0e505d21852ba02a5b3ff27dbcad96828a949951e1200aa92421d3f020",
      "metadataTypeId": 10
    },
    {
      "type": "struct events::LoanRepaidEvent",
      "concreteTypeId": "152547fa3cae0aa57ddf87d5f01d1b96dad81aee6f0e124f59023bd6f16576c9",
      "metadataTypeId": 11
    },
    {
      "type": "struct events::LoanRequestedEvent",
      "concreteTypeId": "48f15918f9934b0487f9e55e43010ac7509effcf7882aa810b05b0572e602921",
      "metadataTypeId": 12
    },
    {
      "type": "struct interface::Loan",
      "concreteTypeId": "d635a9535cd3bd9339b6dad49390fcf19e0b368b03b253e24712f9dcdebf9936",
      "metadataTypeId": 14
    },
    {
      "type": "struct interface::ProtocolConfig",
      "concreteTypeId": "7a94afc93fd21a44afcd786c9743f83e8a51997d7b272189264803d57f3c337e",
      "metadataTypeId": 15
    },
    {
      "type": "struct std::address::Address",
      "concreteTypeId": "f597b637c3b0f588fb8d7086c6f4735caa3122b85f0423b82e489f9bb58e2308",
      "metadataTypeId": 17
    },
    {
      "type": "struct std::vec::Vec<struct stork_sway_sdk::interface::TemporalNumericValueInput>",
      "concreteTypeId": "e67278f564f3da524afebc87950681dff66e11946370df7f4c68b5f01329590b",
      "metadataTypeId": 20,
      "typeArguments": [
        "672654baba0e998dd82f818c92c2b544c9275ee09007b0f65f59195a94a916d6"
      ]
    },
    {
      "type": "struct stork_sway_sdk::interface::TemporalNumericValueInput",
      "concreteTypeId": "672654baba0e998dd82f818c92c2b544c9275ee09007b0f65f59195a94a916d6",
      "metadataTypeId": 21
    },
    {
      "type": "u256",
      "concreteTypeId": "1b5759d94094368cfd443019e7ca5ec4074300e544e5ea993a979f5da627261e"
    },
    {
      "type": "u64",
      "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
    }
  ],
  "metadataTypes": [
    {
      "type": "enum interface::Error",
      "metadataTypeId": 0,
      "components": [
        {
          "name": "EMsgSenderAndBorrowerNotSame",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EMsgSenderAndLenderNotSame",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EAmountLessThanOrEqualToRepaymentAmount",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ESameAssetSameCollateral",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EInvalidDuration",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EInvalidDecimal",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EInvalidStatus",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EAlreadyExpired",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EInvalidCollateral",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EInvalidCollateralAmount",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EInvalidAsset",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EInvalidAssetAmount",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EDurationNotFinished",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ELoanReqNotExpired",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ELoanOfferNotExpired",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ENoOracleFeedAvailable",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EInvalidLiqThreshold",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EOracleNotSet",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EOraclePriceZero",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EOraclePriceStale",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ENotEnoughForOracleUpdate",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ENotOracleBaseAssetId",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ENotProtocolOwner",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ENotProtocolAdmin",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EProtocolConfigNotSet",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EProtocolPaused",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EOralceCollateralNotSet",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "EOralceAssetNotSet",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "generic T",
      "metadataTypeId": 1
    },
    {
      "type": "enum std::identity::Identity",
      "metadataTypeId": 2,
      "components": [
        {
          "name": "Address",
          "typeId": 17
        },
        {
          "name": "ContractId",
          "typeId": 20
        }
      ]
    },
    {
      "type": "struct events::ClaimExpiredLoanOfferEvent",
      "metadataTypeId": 3,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "lender",
          "typeId": 17
        },
        {
          "name": "asset",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct events::ClaimExpiredLoanReqEvent",
      "metadataTypeId": 4,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "borrower",
          "typeId": 17
        },
        {
          "name": "collateral",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct events::LoanCancelledEvent",
      "metadataTypeId": 5,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "borrower",
          "typeId": 17
        },
        {
          "name": "collateral",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct events::LoanFilledEvent",
      "metadataTypeId": 6,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "borrower",
          "typeId": 17
        },
        {
          "name": "lender",
          "typeId": 17
        },
        {
          "name": "asset",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "liquidation",
          "typeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
        }
      ]
    },
    {
      "type": "struct events::LoanLiquidatedEvent",
      "metadataTypeId": 7,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "borrower",
          "typeId": 17
        },
        {
          "name": "lender",
          "typeId": 17
        },
        {
          "name": "liquidator",
          "typeId": 2
        },
        {
          "name": "collateral_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "lender_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "liquidator_fee",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "protocol_fee",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "borrower_refund",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "asset_price",
          "typeId": "1b5759d94094368cfd443019e7ca5ec4074300e544e5ea993a979f5da627261e"
        },
        {
          "name": "collateral_price",
          "typeId": "1b5759d94094368cfd443019e7ca5ec4074300e544e5ea993a979f5da627261e"
        }
      ]
    },
    {
      "type": "struct events::LoanOfferFilledEvent",
      "metadataTypeId": 8,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "borrower",
          "typeId": 17
        },
        {
          "name": "lender",
          "typeId": 17
        },
        {
          "name": "asset",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "duration",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "liquidation",
          "typeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
        }
      ]
    },
    {
      "type": "struct events::LoanOfferedCancelledEvent",
      "metadataTypeId": 9,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "lender",
          "typeId": 17
        },
        {
          "name": "asset",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct events::LoanOfferedEvent",
      "metadataTypeId": 10,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "lender",
          "typeId": 17
        },
        {
          "name": "asset",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "asset_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "collateral",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "collateral_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "duration",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "repayment_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "liquidation",
          "typeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
        }
      ]
    },
    {
      "type": "struct events::LoanRepaidEvent",
      "metadataTypeId": 11,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "borrower",
          "typeId": 17
        },
        {
          "name": "lender",
          "typeId": 17
        },
        {
          "name": "asset",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "repayment_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct events::LoanRequestedEvent",
      "metadataTypeId": 12,
      "components": [
        {
          "name": "loan_id",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "borrower",
          "typeId": 17
        },
        {
          "name": "asset",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "asset_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "collateral",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "collateral_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "duration",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "repayment_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "liquidation",
          "typeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
        }
      ]
    },
    {
      "type": "struct interface::Liquidation",
      "metadataTypeId": 13,
      "components": [
        {
          "name": "liquidation_threshold_in_bps",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "liquidation_flag_internal",
          "typeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
        }
      ]
    },
    {
      "type": "struct interface::Loan",
      "metadataTypeId": 14,
      "components": [
        {
          "name": "borrower",
          "typeId": 17
        },
        {
          "name": "lender",
          "typeId": 17
        },
        {
          "name": "asset",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "collateral",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "asset_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "repayment_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "collateral_amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "created_timestamp",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "start_timestamp",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "duration",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "status",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "liquidation",
          "typeId": 13
        }
      ]
    },
    {
      "type": "struct interface::ProtocolConfig",
      "metadataTypeId": 15,
      "components": [
        {
          "name": "protocol_fee_receiver",
          "typeId": 17
        },
        {
          "name": "protocol_fee",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "protocol_liquidation_fee",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "liquidator_fee",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "time_request_loan_expires",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "oracle_max_stale",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "min_loan_duration",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct signed_int::i128::I128",
      "metadataTypeId": 16,
      "components": [
        {
          "name": "underlying",
          "typeId": 18
        }
      ]
    },
    {
      "type": "struct std::address::Address",
      "metadataTypeId": 17,
      "components": [
        {
          "name": "bits",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ]
    },
    {
      "type": "struct std::u128::U128",
      "metadataTypeId": 18,
      "components": [
        {
          "name": "upper",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "lower",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ]
    },
    {
      "type": "struct std::vec::RawVec",
      "metadataTypeId": 19,
      "components": [
        {
          "name": "ptr",
          "typeId": 2
        },
        {
          "name": "cap",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "typeParameters": [
        1
      ]
    },
    {
      "type": "struct std::vec::Vec",
      "metadataTypeId": 20,
      "components": [
        {
          "name": "buf",
          "typeId": 19,
          "typeArguments": [
            {
              "name": "",
              "typeId": 1
            }
          ]
        },
        {
          "name": "len",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "typeParameters": [
        1
      ]
    },
    {
      "type": "struct stork_sway_sdk::interface::TemporalNumericValueInput",
      "metadataTypeId": 21,
      "components": [
        {
          "name": "temporal_numeric_value",
          "typeId": 22
        },
        {
          "name": "id",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "publisher_merkle_root",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "value_compute_alg_hash",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "r",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "s",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "v",
          "typeId": 23
        }
      ]
    },
    {
      "type": "struct stork_sway_sdk::temporal_numeric_value::TemporalNumericValue",
      "metadataTypeId": 22,
      "components": [
        {
          "name": "timestamp_ns",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "quantized_value",
          "typeId": 16
        }
      ]
    },
    {
      "type": "u8",
      "metadataTypeId": 23
    }
  ],
  "functions": [
    {
      "name": "add_admin",
      "inputs": [
        {
          "name": "admin",
          "concreteTypeId": "f597b637c3b0f588fb8d7086c6f4735caa3122b85f0423b82e489f9bb58e2308"
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
    },
    {
      "name": "cancel_lender_offer",
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
    },
    {
      "name": "cancel_loan",
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
    },
    {
      "name": "claim_expired_loan_offer",
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
    },
    {
      "name": "claim_expired_loan_req",
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
    },
    {
      "name": "fill_lender_request",
      "inputs": [
        {
          "name": "loan_id",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "name": "fill_loan_request",
      "inputs": [
        {
          "name": "loan_id",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "name": "get_loan",
      "inputs": [
        {
          "name": "loan_id",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "output": "d635a9535cd3bd9339b6dad49390fcf19e0b368b03b253e24712f9dcdebf9936",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "name": "get_loan_length",
      "inputs": [],
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "name": "get_loan_status",
      "inputs": [
        {
          "name": "loan_id",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "name": "get_price_from_oracle",
      "inputs": [
        {
          "name": "feed_id",
          "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ],
      "output": "1b5759d94094368cfd443019e7ca5ec4074300e544e5ea993a979f5da627261e",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "name": "get_protocol_admin",
      "inputs": [],
      "output": "f597b637c3b0f588fb8d7086c6f4735caa3122b85f0423b82e489f9bb58e2308",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "name": "get_protocol_owner",
      "inputs": [],
      "output": "f597b637c3b0f588fb8d7086c6f4735caa3122b85f0423b82e489f9bb58e2308",
      "attributes": null
    },
    {
      "name": "is_loan_liquidation_by_oracle",
      "inputs": [
        {
          "name": "loan_id",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "output": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
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
    },
    {
      "name": "offer_loan",
      "inputs": [
        {
          "name": "loan_info",
          "concreteTypeId": "d635a9535cd3bd9339b6dad49390fcf19e0b368b03b253e24712f9dcdebf9936"
        }
      ],
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "name": "pay_and_update_price_feeds",
      "inputs": [
        {
          "name": "update_data",
          "concreteTypeId": "e67278f564f3da524afebc87950681dff66e11946370df7f4c68b5f01329590b"
        }
      ],
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "name": "protocol_config",
      "inputs": [],
      "output": "7a94afc93fd21a44afcd786c9743f83e8a51997d7b272189264803d57f3c337e",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "name": "protocol_status",
      "inputs": [],
      "output": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "name": "repay_loan",
      "inputs": [
        {
          "name": "loan_id",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "name": "request_loan",
      "inputs": [
        {
          "name": "loan_info",
          "concreteTypeId": "d635a9535cd3bd9339b6dad49390fcf19e0b368b03b253e24712f9dcdebf9936"
        }
      ],
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "name": "update_oracle_contract",
      "inputs": [
        {
          "name": "addr",
          "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
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
    },
    {
      "name": "update_oracle_feed_id",
      "inputs": [
        {
          "name": "base_asset_id",
          "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "feed_id",
          "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
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
    },
    {
      "name": "update_protocol_config",
      "inputs": [
        {
          "name": "config",
          "concreteTypeId": "7a94afc93fd21a44afcd786c9743f83e8a51997d7b272189264803d57f3c337e"
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
    },
    {
      "name": "update_protocol_status",
      "inputs": [
        {
          "name": "flag",
          "concreteTypeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
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
  "loggedTypes": [
    {
      "logId": "1144247184059948296",
      "concreteTypeId": "0fe12ec05d225d08dc236ce4be213977fa8c3aeb6ecf2ea110db0c98562addbf"
    },
    {
      "logId": "16694304226943970369",
      "concreteTypeId": "e7ae153e834c2c41b423b9a343a66a98834c30592f409dc92ba11125d1f8c2fd"
    },
    {
      "logId": "13601862659640933158",
      "concreteTypeId": "bcc38605ef8c3b26805a90de68ef3a0d989dcc8ad1ec93862aff659a8c2e8c41"
    },
    {
      "logId": "12204107786951973191",
      "concreteTypeId": "a95db35f41d9d9477af218f5e6a37f413e7c4317b8899d2df6fea6731e9a2fbc"
    },
    {
      "logId": "17788972387794374791",
      "concreteTypeId": "f6df2022fdb75087ab418ac68cbfed3fa909a6c6a1e4486312567b04dba1366b"
    },
    {
      "logId": "4006276001079684053",
      "concreteTypeId": "379926cbfc86ebd5d85757c0f1709c6394d4c9ca64953ed66eea3393475b4fd7"
    },
    {
      "logId": "7252620870785067898",
      "concreteTypeId": "64a67c4185ba6b7aeb197b01932d8daa08bcf7dfa434490666c0edfe1b5b1b57"
    },
    {
      "logId": "526294391962642026",
      "concreteTypeId": "074dc5f60836a66affaf06a376fb5ec0fd1e72acbe77891b3605feb941b2da1d"
    },
    {
      "logId": "16508342518813630853",
      "concreteTypeId": "e5196a0e505d21852ba02a5b3ff27dbcad96828a949951e1200aa92421d3f020"
    },
    {
      "logId": "1523703189020215973",
      "concreteTypeId": "152547fa3cae0aa57ddf87d5f01d1b96dad81aee6f0e124f59023bd6f16576c9"
    },
    {
      "logId": "5256080203919346436",
      "concreteTypeId": "48f15918f9934b0487f9e55e43010ac7509effcf7882aa810b05b0572e602921"
    }
  ],
  "messagesTypes": [],
  "configurables": [
    {
      "name": "PROTOCOL_OWNER",
      "concreteTypeId": "f597b637c3b0f588fb8d7086c6f4735caa3122b85f0423b82e489f9bb58e2308",
      "offset": 71632,
      "indirect": false
    }
  ],
  "errorCodes": {},
  "panickingCalls": {}
} as const;
