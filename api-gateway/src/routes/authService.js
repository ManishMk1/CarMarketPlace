import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

 const setAuthRoutes=()=>{
    console.log('Setting up auth routes');
    console.log(`Auth service URL: ${process.env.AUTH_SERVICE_URL}`);
    return  createProxyMiddleware({
  target: 'http://localhost:3000/',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
})
}
    

export default setAuthRoutes;
