const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const config = require('@globals/config');
const User = require('@models/user');
const O3Error = require('@utils/error');
const emailer = require('@utils/emailer');

module.exports.deleteMany = async () => {
  if (config.env === 'test') {
    await User.deleteMany();
  } else throw new Error('Cannot exeute deleteMany in current environment');
};

module.exports.registerForTest = async ({ user }) => {
  if (config.env === 'test') {
    const userInstance = new User(user);
    userInstance.password = bcrypt.hashSync(user.password, config.password.salt);
    userInstance.verified = true;
    userInstance.session = mongoose.Types.ObjectId();

    await userInstance.save();

    const token = jwt.sign({
      _id: userInstance._id,
      action: config.app.actions.AUTH,
      session: userInstance.session,
    }, config.jwt.secret,
    {
      algorithm: config.jwt.algorithm,
    });

    return {
      token,
    };
  } throw new Error('Cannot exeute registerForTest in current environment');
};

module.exports.register = async ({ user }) => {
  const userInstance = new User(user);
  userInstance.password = bcrypt.hashSync(user.password, config.password.salt);
  userInstance.verified = false;
  userInstance.session = mongoose.Types.ObjectId();

  await userInstance.save();

  const token = jwt.sign({
    email: userInstance.email,
    action: config.app.actions.VERIFICATION,
  }, config.jwt.secret,
  {
    algorithm: config.jwt.algorithm,
    expiresIn: '15m',
  });

  userInstance.password = '';

  emailer.sendUserEmailVerificationLink({
    token,
    user: userInstance,
  });

  return {
    user: userInstance,
    token: ['dev', 'test'].indexOf(config.env) > -1 ? token : '',
  };
};

module.exports.verify = async ({ }, { }, { token }) => {
  const { email, action } = await jwt.verify(token, config.jwt.secret);

  if (action === config.app.actions.VERIFICATION) {
    const userInstance = await User.findOne({
      email,
    });

    if (userInstance === null) {
      throw new O3Error('User not found', 404, {
        email,
      });
    } else {
      userInstance.verified = true;
      await userInstance.save();

      return {
        user: userInstance,
      };
    }
  } else {
    throw new O3Error('Invalid action', 400, {

    });
  }
};

module.exports.login = async ({ user }) => {
  const userInstance = await User.findOne({
    email: user.email,
  });

  if (userInstance === null) {
    throw new O3Error('User not found', 404, {
      email: user.email,
    });
  } else if (userInstance.verified === false) {
    throw new O3Error('User not has not been verified', 400, {
      email: user.email,
    });
  } else {
    if (bcrypt.compareSync(user.password, userInstance.password)) {
      userInstance.session = mongoose.Types.ObjectId();
      await userInstance.save();

      const token = jwt.sign({
        _id: userInstance._id,
        action: config.app.actions.AUTH,
        session: userInstance.session,
      }, config.jwt.secret,
      {
        algorithm: config.jwt.algorithm,
      });

      return {
        token,
        user: userInstance,
      };
    }
    throw new O3Error('Authentication failed', 401, {
      user,
    });
  }
};
