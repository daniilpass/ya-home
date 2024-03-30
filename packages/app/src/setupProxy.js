const {createProxyMiddleware} = require('http-proxy-middleware');

const options = {
    target: process.env.REACT_APP_PROXY_TARGET,
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