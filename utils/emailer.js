const nodemailer = require('nodemailer');
const config = require('@globals/config');
const logger = require('@loaders/logger');

module.exports.sendUserEmailVerificationLink = ({ token, user }) => {
  const transporter = nodemailer.createTransport(config.mailer);
  
  if (['production', 'dev'].indexOf(config.env) > -1) {
    const options = {
      from: config.mailer.auth.user,
      to: user.email,
      subject: 'O3 Contacts Email Verification',
      text: `/user/verify/${token}`,
    };

    transporter.sendMail(options, (error, info) => {
      if (error) {
        logger.error(error);
      } else {
        logger.info(info);
      }
    });
  } else {
    logger.info(`User: ${user.email}`);
    logger.info(`Link: /user/verify/${token}`);
  }
};
