const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '/../config/config.yaml'), 'utf-8'));

//Set default values if not set
config.port = process.env.PORT || config.PORT || 80;

if(!config.publicPath) {
  config.publicPath = "/";
}

if(!config.ClientConfig.apiBaseURL) {
  config.ClientConfig.apiBaseURL = config.publicPath;
}

//manual fixes
config.adobeApi.url = config.adobeApi.host + config.adobeApi.endpoint;
config.ClientConfig.baseURL = config.publicPath;

module.exports = config;
