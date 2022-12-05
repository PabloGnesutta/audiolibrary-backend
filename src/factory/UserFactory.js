const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../model/User');
const TokenFactory = require('../factory/TokenFactory');

class UserFactory {
  static async user(user) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const emailToken = await TokenFactory.generate();
    const emailTokenExpiration = Date.now() + config.emailTokenExpirationInMs;
    return new User({
      email: user.email,
      name: user.name,
      password: hashedPassword,

      lastFileSeen: null,

      folders: [{
        id: 0,
        name: 'Desktop',
        lastFileSeen: null,
        permissions: 'x',
      }],
      folderIdCounter: 1,
      lastFolderSeen: 0,

      emailToken,
      emailTokenExpiration,
      emailVerified: false,
      createdAt: new Date(),
    });
  }
}

module.exports = UserFactory;