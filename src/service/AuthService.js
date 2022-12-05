const BusinessError = require('../exception/BusinessError');
const AuthHelper = require('../helper/AuthHelper');
const UserHelper = require('../helper/UserHelper');
const UserFactory = require('../factory/UserFactory');
const EmailService = require('../service/EmailService');

const config = require('../config');
const accessTokenExp = config.accessTokenExpiration;
const refreshTokenExp = config.refreshTokenExpiration;

const bcrypt = require('bcryptjs');

class AuthService {
  static async signUp(userData) {
    try {
      const invalidEmailMsg = await AuthHelper.validateEmail(userData.email);
      if (invalidEmailMsg) throw new BusinessError(invalidEmailMsg);

      const user = await UserFactory.user(userData);
      const responseUser = await UserHelper.saveUser(user);
      if (!responseUser) throw new BusinessError('Unable to save user');

      // EmailService.sendVerifyEmailMail({
      //   to: user.email,
      //   token: user.emailToken,
      // });
      return responseUser;
    } catch (_err) {
      throw _err;
    }
  }

  static async verifyEmail(token) {
    try {
      const user = await UserHelper.getUserByToken(token);
      if (!user) throw new BusinessError('Wrong email confirmation link');
      user.emailToken = undefined;
      user.emailTokenExpiration = undefined;
      user.emailVerified = true;
      await UserHelper.saveUser(user);
      return user.email;
    } catch (_err) {
      throw _err;
    }
  }

  static async login(loginData) {
    try {
      const hashedPassword = await bcrypt.hash('qwe', 12);
      // console.log(hashedPassword)
      const user = await UserHelper.getUserByEmail(loginData.email, {
        emailVerified: true,
      });
      if (!user) throw new BusinessError('Wrong credentials [user]');

      const password = await AuthHelper.verifyPassword(
        loginData.password,
        user.password
      );
      if (!password) throw new BusinessError('Wrong credentials [password]');
      console.log(' -success]');
      const accessToken = this.createAccessToken(user, accessTokenExp);
      const refreshToken = this.createRefreshToken(user, refreshTokenExp);
      const clientData = await UserHelper.clientData(user, {
        accessToken,
        refreshToken,
      });
      return clientData;
    } catch (_err) {
      throw _err;
    }
  }

  static createAccessToken(user, expiration) {
    try {
      const token = AuthHelper.createAccessToken(
        { userId: user._id, email: user.email },
        expiration
      );
      if (!token) throw new SystemError('Error al generar token');
      return token;
    } catch (_err) {
      throw _err;
    }
  }

  static createRefreshToken(user, expiration) {
    try {
      const token = AuthHelper.createRefreshToken(user._id, expiration);
      if (!token) throw new SystemError('Error al generar token');
      return token;
    } catch (_err) {
      throw _err;
    }
  }

  static async validateToken(token) {
    try {
      return AuthHelper.validateToken(token);
    } catch (_err) {
      throw _err;
    }
  }
}

module.exports = AuthService;
