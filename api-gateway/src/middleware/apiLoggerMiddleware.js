import Logger from '../logs/logger.js';

const logger = new Logger('apiLoggerMiddleware');
export const apiLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
    });
  });

  next();
};
