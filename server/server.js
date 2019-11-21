//include modules
const yargs = require('yargs');
const fallback = require('express-history-api-fallback');
const express = require('express');
const async = require('express-async-await');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../config');

// detect if running in a production or development env
const isDev = !(process.env.NODE_ENV === 'production' || yargs.argv.env == "production" || false);
const isDevClient = (yargs.argv.devClient || false);

// SEVER SETUP
// =============================================================================

// Main App
const app = express();
app.locals.config = config;

// Configuration
var clientFolder = path.join(__dirname, (isDev ? '../client/dev' : '../client/dist'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//log endpoint
app.use(function (req, res, next) {
  console.info('REQUEST %s %s', req.method, req.originalUrl)
  next() // pass control to the next handler
});

if (isDevClient) {
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.babel.js');

  //reload=true:Enable auto reloading when changing JS files or content
  //timeout=1000:Time from disconnecting from server to reconnecting
  webpackConfig.entry.client.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');

  //Add HMR plugin
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  const webpackCompiler = webpack(webpackConfig);

  //Enable "webpack-dev-middleware"
  app.use(webpackDevMiddleware(webpackCompiler, {
    publicPath: config.publicPath
  }));

  //Enable "webpack-hot-middleware"
  app.use(webpackHotMiddleware(webpackCompiler));
}

// ROUTES
// =============================================================================
// Serve static files
app.use(config.publicPath, express.static(clientFolder));

// API Route
app.use(config.publicPath + 'api', require('./routes/api.js'));

// Fallback for HTML5 History API
app.use(fallback('index.html', {
  root: clientFolder,
}));

// START THE SERVER
// =============================================================================
app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});
