const mongoose = require('mongoose');

const config = require('@globals/config');
const logger = require('@loaders/logger');

const connect = async () => {
  await mongoose.connect(`${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.name}`, {
    useNewUrlParser: true,
  });
};

mongoose.connection.on('error', (error) => {
  logger.error(error);
  process.exit(1);
});

mongoose.connection.on('connected', () => {
  logger.info(`${config.app.name} server connected to database ${config.mongodb.name}`);
});

module.exports = connect;
