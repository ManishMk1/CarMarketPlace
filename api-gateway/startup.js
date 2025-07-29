import cors from 'cors';
import morgan from 'morgan';
import Logger from './src/logs/logger.js';
import authRoutes from './src/routes/authService.js';
import { apiLogger } from './src/middleware/apiLoggerMiddleware.js';


export const initStartup = (app) => {
const logger = new Logger('initStartup');
app.use(apiLogger);
const allowedOrigins=process.env.ALLOWED_ORIGINS.split(',');

 app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan('combined'));
app.use('/api/auth', authRoutes());
app.post("/health", (req, res, next) => {
  logger.error( 'Health check endpoint hit', {email: process.env.MAIL_SENDER, receivers: process.env.MAIL_RECEIVERS });
  res.status(500).json({ message: 'Internal Server Error' });
});

};
