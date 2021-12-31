const express = require('express');

const user = require('@routes/user');
const contact = require('@routes/contact');

module.exports = () => {
  const router = express.Router();

  user(router);
  contact(router);

  return router;
};
