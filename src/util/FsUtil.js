const fs = require('fs');
const path = require('path');

class FsUtil {
  static fileExists(pathToFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(pathToFile, (err, data) => {
        if (err)
          if (err.code === 'ENOENT')
            resolve(false);
          else
            reject(err);
        else
          resolve(true);
      });
    });
  }

  static saveFileToDisk(file, path) {
    return new Promise((resolve, reject) => {
      file.mv(path, function (err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  static deleteFile(email, directoryKey, fileName) {
    const deletePath = path.join(__filesdir, email, directoryKey, fileName);

    return new Promise((resolve, reject) => {
      fs.unlink(deletePath, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  static readDir(dir) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err)
          reject(err);
        else {
          resolve(files);
        }
      });
    });
  }

  static readJSONFile(pathToFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(pathToFile, (err, data) => {
        if (err)
          reject(err);
        else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  static async writeJSONFile(pathToFile, json) {
    return new Promise((resolve, reject) => {
      fs.writeFile(pathToFile, JSON.stringify(json), (err) => {
        if (err)
          reject(err);
        else {
          resolve(true);
        }
      });
    });
  }
}

module.exports = FsUtil;