const FileHelper = require('../helper/FileHelper');
const FileService = require('./FileService');
const BusinessError = require('../exception/BusinessError');

class UserService {
  static async createFolder(user, name) {
    try {
      // Add
      const newFolder = {
        name,
        id: user.folderIdCounter,
        lastFileSeen: null,
        permissions: 'x',
      };
      user.folders.push(newFolder);
      user.folderIdCounter++;

      // Sort
      user.folders.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });

      user.markModified("folders");
      await user.save();
      return newFolder;
    } catch (_err) {
      throw _err;
    }
  }

  static async deleteFolder(user, id) {
    try {
      const files = await FileHelper.getUserFilesByFolderId(user, id);
      if (!files) throw new BusinessError("Could'nt get user files");

      await FileService.deleteMultipleFiles(user, files);

      if (user.lastFolderSeen == id) {
        user.lastFolderSeen = null;
      }

      const index = user.folders.findIndex(folder => folder.id == id);
      if (index === -1) throw new BusinessError("Couldn't find folder");
      user.folders.splice(index, 1);
      user.markModified("folders");
      const responseUser = await user.save();
      if (!responseUser) throw new BusinessError("Couldn't update user's folders");

      return responseUser;
    } catch (_err) {
      throw _err;
    }
  }

  static async renameFolder(user, { id, newName }) {
    try {
      const index = user.folders.findIndex(folder => folder.id === id);
      if (index === -1) throw new BusinessError("Couldn't find folder");

      user.folders[index].name = newName;

      user.markModified("folders");
      await user.save();
      return { success: true };
    } catch (_err) {
      throw _err;
    }
  }
}


module.exports = UserService;