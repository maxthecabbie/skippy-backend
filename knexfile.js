var config = require('./config');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'skippy',
      user: config.dbUser,
      password: config.dbPass
    }
  }
}