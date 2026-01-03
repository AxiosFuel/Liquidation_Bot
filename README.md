# Axios Liquidation Bot

> Autonomous liquidation bot for Axios Finance lending protocol on Fuel Network

## Overview

This bot monitors active loans on the Axios Finance platform and automatically executes liquidations when:
1. **Time-based**: Loan duration has expired
2. **Health Factor**: Collateral value falls below loan value threshold

## Features

- ✅ Real-time monitoring of active loans via Supabase
- ✅ TAI64 timestamp conversion for Fuel Network compatibility
- ✅ Health factor calculation using live price feeds
- ✅ Automatic liquidation execution on Fuel Network
- ✅ Telegram notifications for transparency
- ✅ Retry logic with exponential backoff
- ✅ Dry-run mode for testing
- ✅ Comprehensive logging
- ✅ Environment-agnostic deployment

## Architecture

```
┌─────────────────┐
│   Supabase DB   │
│  (Active Loans) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Data Fetcher   │◄─────┤ Price Oracle │
└────────┬────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐
│ Health Checker  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   Liquidator    │──────►│ Fuel Network │
└────────┬────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐
│ Telegram Client │
└─────────────────┘
```

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd axios-liquidation-bot

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FUEL_PRIVATE_KEY` | Private key for liquidation wallet | ✅ |
| `FUEL_RPC_URL` | Fuel Network RPC endpoint | ✅ |
| `LOAN_CONTRACT_ID` | Axios loan contract address | ✅ |
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | ✅ |
| `TELEGRAM_CHAT_ID` | Telegram group chat ID | ✅ |
| `PRICE_API_PROVIDER` | Price oracle provider | ❌ (default: coingecko) |
| `SCAN_INTERVAL_MS` | Scan frequency in milliseconds | ❌ (default: 60000) |
| `HEALTH_FACTOR_THRESHOLD` | Liquidation threshold | ❌ (default: 1.0) |
| `DRY_RUN` | Enable dry-run mode | ❌ (default: false) |

See [`.env.example`](.env.example) for complete configuration template.

## Usage

### Development Mode
```bash
# Run with auto-reload
npm run dev
```

### Production Mode
```bash
# Build TypeScript
npm run build

# Run compiled code
npm start
```

### Dry Run Mode
```bash
# Test without executing liquidations
npm run dry-run
```

## Project Structure

```
axios-liquidation-bot/
├── src/
│   ├── index.ts              # Main bot orchestrator
│   ├── fetcher.ts            # Supabase data fetcher
│   ├── health-checker.ts     # Health factor calculator
│   ├── liquidator.ts         # Fuel Network liquidator
│   ├── price-client.ts       # Price oracle client
│   ├── telegram-client.ts    # Telegram notifications
│   └── utils/
│       ├── logger.ts         # Logging utility
│       └── timestamp.ts      # TAI64 conversion
├── config/
│   └── config.ts             # Configuration loader
├── .env.example              # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

### 1. Scan Cycle
Every `SCAN_INTERVAL_MS` (default: 1 minute):
1. Fetch all active loans from Supabase
2. For each loan:
   - Check if duration expired (TAI64 → Unix conversion)
   - If not expired, calculate health factor:
     ```
     Health Factor = (Collateral Value USD) / (Loan Value USD)
     ```
   - If health factor < threshold (default: 1.0), mark for liquidation

### 2. Liquidation Execution
For each loan marked for liquidation:
1. Call `liquidate_loan(loan_id)` on Fuel contract
2. Retry up to `MAX_RETRIES` times on failure
3. Send Telegram notification with result

### 3. Notifications
- **Scan Complete**: Sent after each cycle
- **Liquidation Event**: Sent for each liquidation
- **Error Alert**: Sent on failures

## Development

### Adding Contract Integration

The contract interaction is currently a TODO. To implement:

1. Get the contract ABI
2. Update `src/liquidator.ts`:
   ```typescript
   import { Contract } from 'fuels';
   import contractAbi from './abi/loan-contract.json';
   
   const contract = new Contract(this.contractId, contractAbi, this.wallet);
   const tx = await contract.functions.liquidate_loan(loanId).call();
   await tx.waitForResult();
   ```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Security

> [!CAUTION]
> **Critical Security Requirements**

- ✅ Never commit `.env` file
- ✅ Store private keys in environment variables only
- ✅ Use minimal gas ETH in liquidation wallet
- ✅ Regularly rotate private keys
- ✅ Monitor wallet balance for suspicious activity
- ✅ Use separate wallets for different environments

## Deployment

### Railway / Render
```bash
# Set environment variables in dashboard
# Deploy from GitHub repository
```

### Docker
```bash
# Build image
docker build -t axios-liquidation-bot .

# Run container
docker run -d --env-file .env axios-liquidation-bot
```

### PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start dist/index.js --name liquidation-bot

# Monitor
pm2 logs liquidation-bot
```

## Monitoring

### Health Check
The bot provides a health check endpoint (if HTTP server is added):
```json
{
  "isRunning": true,
  "walletBalance": "0.05",
  "lastScanTime": 1234567890
}
```

### Telegram Notifications
All events are logged to the configured Telegram group for transparency.

## Troubleshooting

### Bot not starting
- Check environment variables are set correctly
- Verify Supabase and Fuel RPC connectivity
- Check logs for detailed error messages

### No liquidations happening
- Ensure loans exist in database with `status = 'active'`
- Verify price API is responding
- Check health factor threshold configuration
- Enable `DRY_RUN=true` to test logic

### Telegram notifications not working
- Verify bot token and chat ID
- Ensure bot is added to the group
- Check bot has permission to send messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

MIT

## Support

For issues and questions:
- GitHub Issues: <repository-url>/issues
- Telegram: @axios-finance

---

**Built with ❤️ for Axios Finance**
