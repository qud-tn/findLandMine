const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/game',
    createProxyMiddleware({
      target: 'http://localhost:80',
      changeOrigin: true,
    })
  );
};