const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const logger = require('@loaders/logger');
const routes = require('@routes/index');

module.exports = (app) => {
  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  //
  app.use(express.json({
    strict: true,
    limit: '2kb',
  }));

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // HTTP Requests logger
  app.use(morgan('dev'));

  // ETag
  app.disable('etag');

  // Static content
  app.use(express.static(path.join('static')));

  // Registering routes
  app.use('/', routes());

  // Error handler
  app.use((request, response) => {
    // 404
    if (request.error === undefined) {
      response.status(404).json({
        message: 'Resource not found',
        data: {

        },
      });
    } else {
      const { name } = request.error;

      if (name === 'MongoServerError') {
        // Database and validation errors
        const { code, keyPattern } = request.error;

        if (code === 11000) {
          if (keyPattern.email === 1) {
            response.status(400).json({
              message: 'The email id you are trying to use has already been taken',
              data: {
              },
            });
          } else {
            // Fallback error message
            // Situation should be logged
            response.status(400).json({
              message: 'Duplicate key error on the collection',
              data: {
              },
            });
          }
        } else {
          // Unhandled database and validation errors
          logger.error(request.error);

          response.status(500).json({
            message: 'Oops! Something went wrong',
            data: {
            },
          });
        }
      } else if (name === 'ValidationError') {
        response.status(400).json({
          message: 'Provided data is not valid',
          data: {
            errors: request.error.errors,
          },
        });
      } else if (name === 'O3Error') {
        // Business logic errors
        const { code, message, data } = request.error;

        response.status(code).json({
          message, data,
        });
      } else {
        // Unhandled errors
        console.error(request.error);

        response.status(500).json({
          message: 'Oops! Something went wrong',
          data: {
          },
        });
      }
    }
  });
};
