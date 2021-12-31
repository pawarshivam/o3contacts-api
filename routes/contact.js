const express = require('express');

const contactBL = require('@bl/contact');
const authorize = require('@utils/authorize');
const integration = require('@utils/integration');

const R = express.Router();

module.exports = (router) => {
  router.use('/contact', R);

  R.put('/', authorize(), integration(contactBL.save));
  R.get('/', authorize(), integration(contactBL.getAll));
  R.post('/search', authorize(), integration(contactBL.search));
  R.delete('/:_id', authorize(), integration(contactBL.delete));
};
