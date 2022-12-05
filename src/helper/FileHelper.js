const File = require('../model/File');

class FileHelper {
  static findOneAndDelete(owner, fileName) {
    return File.findOneAndDelete({ owner, name: fileName });
  }

  static getFileById(id) {
    return File.findById(id);
  }

  static getUserFiles(owner) {
    return File.find({ owner });
  }

  static getUserFilesByFolderId(owner, folderId) {
    return File.find({ owner, folderId });
  }

  static getUserFileById(owner, _id) {
    return File.findOne({ owner, _id });
  }

  static saveFile(file) {
    return file.save();
  }
}

module.exports = FileHelper;