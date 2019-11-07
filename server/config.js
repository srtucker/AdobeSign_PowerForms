const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');


const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '/../config/config.yaml'), 'utf-8'));


//manual fixes
config.adobeApi.url = config.adobeApi.host + config.adobeApi.endpoint;


module.exports = config;
