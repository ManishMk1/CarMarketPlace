import Logger from '../logs/logger.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticate } from '../middleware/authMiddleware.js';
const logger = new Logger('authService');
const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '', 
  },
});

const setAuthRoutes = () => {
  return async (req, res, next) => {
    const publicPaths = ['/login', '/signup'];

    if (publicPaths.includes(req.path)) {
      return authProxy(req, res, next);
    }

    try {
      await authenticate(req, res, async () => {
        return authProxy(req, res, next);
      });
    } catch (error) {
      logger.error('Authentication failed:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

export default setAuthRoutes;
