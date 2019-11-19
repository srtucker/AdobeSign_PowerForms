//include modules
const yargs = require('yargs');
const express = require('express');
const async = require('express-async-await');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config.js');

// detect if running in a production or development env
const isDev = !(process.env.NODE_ENV === 'production' || yargs.argv.env == "production" || false);
const isDevClient = (yargs.argv.devClient || false);
//console.log({isDev, isDevClient})

// SEVER SETUP
// =============================================================================

// Main App
const app = express();
app.locals.config = config;

// Configuration
var port = process.env.PORT || config.port || 80;
var publicPath = config.publicPath || "/";
var clientFolder = isDev ? 'client/dev' : 'client/dist';

//rewrite urls to root for workflow
app.use(function(req, res, next) {
  if (/\/workflow\/\S*$/.test(req.url)) {
    req.url = publicPath;
  }
  next();
});

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
      publicPath: publicPath
  }));

  //Enable "webpack-hot-middleware"
  app.use(webpackHotMiddleware(webpackCompiler));
}

// ROUTES
// =============================================================================
// Serve static files
app.use(publicPath, express.static(path.join(__dirname, '../', clientFolder)));

app.use(publicPath + 'api', require('./routes/api.js'));

// START THE SERVER
// =============================================================================
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
