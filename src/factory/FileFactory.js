const File = require('../model/File');

class FileFactory {
  static fileObject({ file, key, user, folderId, duration }) {
    return new File({
      key,
      duration,
      name: file.name,
      type: file.mimetype,
      size: file.size,
      owner: user,
      folderId: folderId || 0,
      metaData: {
        currentTime: 0,
      },

      lastInteraction: new Date()
    });
  }
}

module.exports = FileFactory;