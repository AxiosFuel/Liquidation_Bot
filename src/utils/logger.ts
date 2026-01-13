/**
 * Simple logger utility for the liquidation bot
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

class Logger {
    private level: LogLevel;

    constructor(level: LogLevel = 'info') {
        this.level = level;
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
    }

    private formatMessage(level: LogLevel, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

        if (data) {
            const logData = data instanceof Error
                ? { ...data, message: data.message, stack: data.stack }
                : data;
            return `${prefix} ${message} ${JSON.stringify(logData, null, 2)}`;
        }
        return `${prefix} ${message}`;
    }

    debug(message: string, data?: any): void {
        if (this.shouldLog('debug')) {
            console.log(this.formatMessage('debug', message, data));
        }
    }

    info(message: string, data?: any): void {
        if (this.shouldLog('info')) {
            console.log(this.formatMessage('info', message, data));
        }
    }

    warn(message: string, data?: any): void {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, data));
        }
    }

    error(message: string, error?: any): void {
        if (this.shouldLog('error')) {
            const errorData = error instanceof Error
                ? { message: error.message, stack: error.stack }
                : error;
            console.error(this.formatMessage('error', message, errorData));
        }
    }

    setLevel(level: LogLevel): void {
        this.level = level;
    }
}

// Export singleton logger
export const logger = new Logger(
    (process.env.LOG_LEVEL as LogLevel) || 'info'
);
