const jwt = require('jsonwebtoken');

const config = require('@globals/config');
const User = require('@models/user');
const O3Error = require('@utils/error');

module.exports = () => async (request, response, next) => {
  if (request.error) next();
  else {
    try {
      if (request.headers.authorization) {
        // Obtaining token
        const token = request.headers.authorization.split(' ').slice(-1).pop();

        const { _id, action, session } = await jwt.verify(token, config.jwt.secret);

        if (action === config.app.actions.AUTH) {
          const userInstance = await User.findOne({
            query: {
              _id,
              session,
            },
          });

          if (userInstance) {
            request.session = {
              user: userInstance,
            };

            next();
          } else {
            // 401
            response.status(401).json({
              message: 'Authorization token has been expired',
              data: {
              },
            });
          }
        } else {
          throw new O3Error('Invalid action', 400, {
          });
        }
      } else {
        // 400
        response.status(400).json({
          message: 'Authorization header missing',
          data: {
          },
        });
      }
    } catch (error) {
      request.error = error;
      next();
    }
  }
};
