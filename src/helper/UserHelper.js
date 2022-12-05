const User = require('../model/User');
const FileService = require('../service/FileService');

class UserHelper {

  static async clientData(user, extraParams) {
    const files = await FileService.getUserFiles(user);
    const data = {
      user: {
        email: user.email,
        name: user.name,
        lastFileSeen: user.lastFileSeen,
        lastFolderSeen: user.lastFolderSeen
      },
      folders: user.folders,
      files: files,
    };
    if (extraParams) {
      for (const key in extraParams) {
        data[key] = extraParams[key];
      }
    }

    return data;
  }

  static saveUser(user) {
    return user.save();
  }

  static getUsers() {
    return User.find();
  }

  static getUserById(userId) {
    return User.findById(userId);
  }

  static getUserByEmail(email, options = {}) {
    options.email = email;
    return User.findOne(options);
  }

  static getRegisteredUserByName(name) {
    return User.findOne({
      name,
      emailVerified: true
    });
  }

  static getUserByToken(token) {
    // TODO: if implement expiration, make sure the user can re-register
    // return User.findOne({ emailToken: token, emailTokenExpiration: { $gt: Date.now() } });
    return User.findOne({ emailToken: token });
  }
}

module.exports = UserHelper;