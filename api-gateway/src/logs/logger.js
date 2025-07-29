import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { sendErrorEmail } from '../utils/mailService.js';
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const customFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const baseLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  baseLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat)
    })
  );
}

export default class Logger {
  constructor(moduleName = '') {
    this.module = moduleName;
  }

  formatMeta(meta) {
    return {
      ...meta,
      message: meta.message || '',
      module: this.module,
      timestamp: new Date().toISOString()
    };
  }

  log(message, meta = {}) {
    baseLogger.info(message, this.formatMeta(meta));
  }

  debug(message, meta = {}) {
    baseLogger.debug(message, this.formatMeta(meta));
  }

  warn(message, meta = {}) {
    baseLogger.warn(message, this.formatMeta(meta));
  }

  error(error, meta = {}) {
    const message = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : undefined;

    const payload = this.formatMeta({ ...meta,message, stack });
    baseLogger.error(message, payload);

    if (process.env.SEND_ERROR_EMAILS === 'true') {
      sendErrorEmail(
        `Error in ${this.module}`,
        message,
        `<pre>${JSON.stringify(payload, null, 2)}</pre>`
      ).catch(err => {
        console.error('❌ Failed to send error notification:', err.message);
      });

    }
  }
}
