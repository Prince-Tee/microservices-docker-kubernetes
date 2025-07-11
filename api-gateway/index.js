const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Proxy requests to Auth Service
app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:5001',
  changeOrigin: true
}));

// Proxy requests to Products Service
app.use('/products', createProxyMiddleware({
  target: 'http://products-service:5002',
  changeOrigin: true
}));

// Proxy requests to Orders Service
app.use('/orders', createProxyMiddleware({
  target: 'http://orders-service:5003',
  changeOrigin: true
}));

app.listen(5000, () => console.log('API Gateway running on port 5000'));

