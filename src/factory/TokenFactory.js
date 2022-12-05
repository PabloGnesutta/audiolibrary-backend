const crypto = require('crypto');

class TokenFactory {
  static generate(bytes = 32) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(bytes, (err, buff) => {
        if (err) reject(err);
        resolve(buff.toString('hex'));
      });
    });
  }
}

module.exports = TokenFactory;