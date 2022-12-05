const BusinessError = require('../exception/BusinessError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserHelper = require('./UserHelper');

class AuthHelper {
  static async verifyPassword(raw, hashed) {
    const password = await bcrypt.compare(raw, hashed);
    return password;
  }
  static async validateEmail(email) {
    if (!this.isValidEmailFormat(email)) return 'Invalid email';
    const user = await UserHelper.getUserByEmail(email);
    if (user) return 'Email already taken';
    return null;
  }

  static isValidEmailFormat(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  static async executeValidations(userData) {
    await this.validateEmail(userData.email);
    await this.validateName(userData.name);
  }

  static createAccessToken(data, expiration) {
    return jwt.sign({ data }, process.env.SECRET_KEY, {
      expiresIn: expiration,
    });
  }

  static createRefreshToken(userId, expiration) {
    return jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: expiration,
    });
  }

  static validateToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (!err) resolve(decoded);

        if (err.message == 'jwt expired') {
          reject({
            status: 401,
            message: 'Token expired',
          });
        } else {
          reject({
            status: 403,
            message: 'You have no permissions to access this resource',
          });
        }
      });
    });
  }
}

module.exports = AuthHelper;
