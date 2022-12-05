const config = require('../config');
const AuthService = require('../service/AuthService');
const ErrorFactory = require('../factory/ErrorFactory');
const UserHelper = require('../helper/UserHelper');
const BusinessError = require('../exception/BusinessError');

exports.signUp =
  (req, res, next) => {
    console.log('signUp', req.body);
    AuthService.signUp(req.body)
      .then(() => {
        res.json({
          msg: "Account created, waiting for email verification"
        });
      })
      .catch(_err => {
        next(ErrorFactory.create(_err, "Error while creating account"));
      });
  };

exports.verifyEmail =
  (req, res, next) => {
    console.log('verifyEmail', req.body);
    AuthService.verifyEmail(req.body.token)
      .then(email => {
        res.json({ email });
      })
      .catch(_err => {
        next(ErrorFactory.create(_err, "Error while verifying email address"));
      });
  };

exports.login =
  (req, res, next) => {
    console.log('login', req.body);
    AuthService.login(req.body)
      .then(clientData => {
        res.json(clientData);
      })
      .catch(_err => {
        next(ErrorFactory.create(_err, "Error while logging in"));
      });
  };

exports.authorizationMiddleware =
  (req, res, next) => {
    console.log('authorizationMiddleware');
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) {
      return res.status(403).json("Permission denied");
    }

    const token = bearerHeader.split(" ")[1];
    AuthService.validateToken(token)
      .then(decoded => {
        return UserHelper.getUserById(decoded.data.userId);
      })
      .then(user => {
        req.user = user;
        next();
      })
      .catch(_err => {
        res.status(error.status).json(error.msg);
      });
  };

exports.verifySession =
  async (req, res, next) => {
    console.log('verifySession');
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) return res.status(403).json("Permission denied");

    try {
      const accessToken = bearerHeader.split(" ")[1];
      if (!accessToken) return res.status(403).json("Permission denied");

      const decoded = await AuthService.validateToken(accessToken);
      const user = await UserHelper.getUserById(decoded.data.userId);
      if (!user) return res.status(403).json("Permission denied");

      const clientData = await UserHelper.clientData(user);
      res.json(clientData);
    } catch (_err) {
      next(_err);
      // next(ErrorFactory.create(_err, "Error while logging in"));
    }
  };

exports.refreshAccessToken =
  (req, res) => {
    console.log('refreshAccessToken');
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) return res.status(403).json("Permission denied");

    const refreshToken = bearerHeader.split(" ")[1];
    AuthService.validateToken(refreshToken)
      .then(decoded => {
        return UserHelper.getUserById(decoded.userId);
      })
      .then(user => {
        const newAccessToken = AuthService.createAccessToken(user, config.accessTokenExpiration);
        return res.json(newAccessToken);
      })
      .catch(_err => {
        res.status(error.status).json(error.msg);
      });
  };