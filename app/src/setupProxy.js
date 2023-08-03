const {createProxyMiddleware} = require('http-proxy-middleware');

const options = {
    target: 'http://127.0.0.1:8080/',
    pathRewrite: {
      '^/api/': '/',
    },
  };

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware(options)
  );
};