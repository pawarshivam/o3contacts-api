const express = require('express');

const userBL = require('@bl/user');
const integration = require('@utils/integration');

const R = express.Router();

module.exports = (router) => {
  router.use('/user', R);

  R.post('/register', integration(userBL.register));
  R.get('/verify/:token', integration(userBL.verify));
  R.post('/login', integration(userBL.login));
};
