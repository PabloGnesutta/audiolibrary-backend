const config = require('../config');

const BookmarkService = require('../service/BookmarkService');
const FileFactory = require('../factory/FileFactory');
const FileHelper = require('../helper/FileHelper');
const S3Helper = require('../helper/S3Helper');
const BusinesError = require('../exception/BusinessError');

class FileService {
  static async getFileUrl(user, fileId) {
    try {
      const file = await FileHelper.getUserFileById(user, fileId);
      const url = await S3Helper.getSignedUrl('getObject', { Key: file.key, Expires: 3600 });
      return { url };
    } catch (_err) {
      throw _err;
    }
  }

  static async uploadFile(user, file, { folderId, duration }) {
    try {
      if (file.size > config.maxFileSize) throw new BusinesError(`${file.name} is too large`);


      const params = {
        Key: `audio-library/${user.email}/${file.name}__ts--${Date.now()}`,
        Body: file.data,
        ContentType: file.mimetype
      };

      // Storage
      // todo: check total storage used by user, duplicate file names?
      const s3Response = await S3Helper.uploadDataToBucket(params);
      if (!s3Response) throw new BusinesError("Error while uploading file");

      // DB
      const key = s3Response.key || s3Response.Key;
      // - file
      const savedFile = await FileHelper.saveFile(FileFactory.fileObject({ file, key, user, folderId, duration }));
      if (!savedFile) throw new BusinesError("Error while updating file");
      // - bookmark
      const bookmark = await BookmarkService.createBookmark(user, { file: savedFile, time: 0, label: 'First bookmark' });
      if (!bookmark) throw new BusinesError("Error while creating bookmark");

      return { file: savedFile, bookmark };
    } catch (_err) {
      throw _err;
    }
  }

  static async deleteFile(user, _id) {
    const file = await FileHelper.getUserFileById(user, _id);
    if (!file) throw new BusinesError('File not found');

    try {
      await S3Helper.deleteFile({ Key: file.key });
      await file.delete();

      if (user.lastFileSeen == _id) {
        user.lastFileSeen = null;
      }
      user = await user.save();

      return user;
    } catch (_err) {
      throw _err;
    }
  }

  static async deleteMultipleFiles(user, files) {
    for (const file of files) {
      try {
        console.log(' * deleting file', file.name, file.id);
        await S3Helper.deleteFile({ Key: file.key });
        await file.delete();
        if (user.lastFileSeen == file._id.toString()) {
          user.lastFileSeen = null;
          await user.save();
        }
      } catch (_err) {
        throw _err;
      }
    }
  }

  static async getUserFiles(user) {
    try {
      const userFiles = await FileHelper.getUserFiles(user);
      if (!userFiles) throw new BusinesError("Couldn't get user files");
      return userFiles;
    } catch (_err) {
      throw _err;
    }
  }

  static markLastFileSeen(user, fileId, folderId) {
    try {
      const folderIndex = user.folders.findIndex(c => c.id == folderId);
      user.folders[folderIndex].lastFileSeen = fileId;
      user.lastFileSeen = fileId;
      user.lastFolderSeen = folderId;
      user.markModified("folders");
      user.save();
    } catch (_err) {
      throw _err;
    }
  }

  static async updateFileMetadata(user, { _id, param, value }) {
    try {
      var file = await FileHelper.getUserFileById(user, _id);
      if (!file) throw new BusinesError("Couldn't find user file");
      file.metaData[param] = value;
      file.markModified("metaData");
      const responseFile = await file.save();
      return responseFile;
    } catch (_err) {
      throw _err;
    }
  }

  static async updateFile(user, { _id, param, value }) {
    const file = await FileHelper.getUserFileById(user, _id);
    if (!file) throw new BusinesError("Couldn't find user file");
    try {
      file[param] = value;
      file.lastInteraction = new Date();
      file.markModified(param);
      await file.save();

      return user;
    } catch (_err) {
      throw _err;
    }
  }

  static async updateMultipleFiles(user, { fileIdsList, param, value }) {
    try {
      for (const _id of fileIdsList) {
        const file = await FileHelper.getUserFileById(user, _id);
        if (!file) throw new BusinesError("Couldn't find user file");
        file[param] = value;
        file.lastInteraction = new Date();
        file.markModified(param);
        await file.save();
      }
      return user;
    } catch (_err) {
      throw _err;
    }
  }
}

module.exports = FileService;