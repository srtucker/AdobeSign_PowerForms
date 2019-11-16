const webpack = require('webpack');
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const yargs = require('yargs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

// Load settings from settings.yml
var config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config', 'config.yaml'), 'utf-8'));

// detect if webpack bundle is being processed in a production or development env
const isDev = !(yargs.argv.env == "production" || false);
const isDevClient = (yargs.argv.devClient || false);
const isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1;

const buildFolder = isDev ? 'client/dev' : 'client/dist';

var webpackConfig = {
  mode: isDev ? 'development' : 'production',
  context: path.resolve(__dirname, 'client'),
  entry: {
    client: ['./src/js/index.js']
  },
  output: {
    filename: 'js/bundle.js?[hash]',
    chunkFilename: 'js/[name].js?[hash]',
    path: path.resolve(__dirname, buildFolder),
    sourceMapFilename: '[file].map',
    publicPath: config.publicPath,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules(?!(\/|\\)(autotrack|dom-utils|query-string|strict-uri-encode|split-on-first))/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              cacheDirectory: "temp/babel-cache",
              plugins: ['lodash'],
            }
          }
        ]
      },
      /*{
        // make all files ending in .json5 use the `json5-loader`
        test: /\.json5$/,
        use: ['json5-loader']
      },*/
      {
        test: /\.(scss$|css$)$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: (loader) => [
                require('autoprefixer')(),
                require('cssnano')()
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                //includePaths: config.CSS.sassLibs
              }
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?name=fonts/[name].[ext]?[hash]&limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=fonts/[name].[ext]?[hash]"
      },
      {
          test: /\.png$/,
          loader: "file-loader?name=images/[name].[ext]?[hash]&mimetype=image/png"
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dynamic Workflow',
      filename: 'index.html',
      template: 'src/pages/index.html',
      ClientConfig: config.ClientConfig
    }),
    //new CopyWebpackPlugin([
    //  {from: 'src/assets'}
    //]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/styles.css?[contenthash]',
      chunkFilename: 'css/[name].css?[contenthash]',
    }),
    new LodashModuleReplacementPlugin,
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, 'client', 'src'),
      "node_modules",
      path.resolve(__dirname, "client/src/hbsTemplates")
    ],
  },
  node: {
    fs: "empty", // avoids error messages
    net: "empty",
    tls: "empty"
  },
  devServer: {
    contentBase: buildFolder,
    compress: true,
    port: config.PORT,
    overlay: true,
    publicPath: config.publicPath,
    historyApiFallback: {
      index: config.publicPath + 'index.html',
      htmlAcceptHeaders: ['text/html'],
      disableDotRule: true
    },
    host: "0.0.0.0",
  },
  devtool: isDev ? "inline-source-map" : "source-map"
};

if(yargs.argv.profile) {
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: "0.0.0.0",
      analyzerPort: config.PORT,
      openAnalyzer: false
    })
  );
}

if(!isDevServer && !isDevClient) {
  webpackConfig.plugins.push(
    new CleanWebpackPlugin()
  );
}

module.exports = webpackConfig;
