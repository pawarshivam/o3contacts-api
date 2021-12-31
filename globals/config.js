module.exports = {
  env: process.env.NODE_ENV,

  /**
    * App
    */
  app: {
    name: 'O3',
    port: parseInt(process.env.APP_PORT, 10),
    actions: {
      AUTH: 1,
      VERIFICATION: 2,
    },
  },

  /**
    * Password
    */
  password: {
    salt: 10,
  },

  /**
    * MongoDB
    */
  mongodb: {
    host: process.env.MONGODB_HOST,
    port: parseInt(process.env.MONGODB_PORT, 10),
    name: process.env.MONGODB_NAME,
  },

  /**
    * JWT
    */
  jwt: {
    secret: process.env.JWT_SECRET,
    algorithm: process.env.JWT_ALGORITHM,
  },

  /**
   * Mailer
   */
  mailer: {
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  },
};
