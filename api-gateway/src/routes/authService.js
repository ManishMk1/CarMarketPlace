// // import express from 'express';
// // import { createProxyMiddleware } from 'http-proxy-middleware';

// //  const setAuthRoutes=()=>{
// //     console.log('Setting up auth routes');
// //     console.log(`Auth service URL: ${process.env.AUTH_SERVICE_URL}`);
// //     return createProxyMiddleware({
// //         target: " http://localhost:3000/",
// //         changeOrigin: true,
// //         pathRewrite: { '^/api/auth/': '' },
// //     });
// // }
    

// // export default setAuthRoutes;
// import { createProxyMiddleware } from 'http-proxy-middleware';
// import {authenticate} from '../middleware/authMiddleware.js'
// // import { authenticate } from '../middleware/authMiddleware';
// const authProxy = createProxyMiddleware({
//   target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
//   changeOrigin: true,
//   pathRewrite: {
//     '^/api/auth': '', // Remove `/api/auth` from the path
//   },
// });

// // Custom middleware to conditionally apply proxy
// const setAuthRoutes = () => {
//   return (req, res, next) => {
//     const excludedPaths = ['/api/auth/login', '/api/auth/signup'];
//     if (excludedPaths.includes(req.path)) {
//         authenticate(req, res, next);
//       return next(); // Skip proxy
//     }
//     return authProxy(req, res, next); // Apply proxy
//   };
// };

// export default setAuthRoutes;


import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticate } from '../middleware/authMiddleware.js';

const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '', // Remove `/api/auth` from the path
  },
});

const setAuthRoutes = () => {
  return async (req, res, next) => {
    const publicPaths = ['/login', '/signup'];

    if (publicPaths.includes(req.path)) {
      // Don't authenticate, just proxy
      return authProxy(req, res, next);
    }

    // First authenticate, then proxy
    try {
      await authenticate(req, res, async () => {
        return authProxy(req, res, next);
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

export default setAuthRoutes;
