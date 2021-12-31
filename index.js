require('module-alias/register');
require('dotenv').config({ path: '.env' });

const app = require('express')();
const http = require('http').createServer(app);

const config = require('@globals/config');
const logger = require('@loaders/logger');
const mongodb = require('@loaders/mongoose');

require('@loaders/express')(app);

module.exports = http.listen(config.app.port, async () => {
  logger.info(`${config.app.name} server running on port ${config.app.port} in env ${config.env}`);

  if (config.env === 'test' === false) {
    await mongodb();
  }
});
