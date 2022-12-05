const ErrorFactory = require('../factory/ErrorFactory');
const FileService = require('../service/FileService');
const UserHelper = require('../helper/UserHelper');

exports.getFileUrl = async (req, res, next) => {
  console.log('getFileUrl', req.params, req.body);
  try {
    const { url } = await FileService.getFileUrl(req.user, req.params._id);
    if (url) {
      FileService.markLastFileSeen(req.user, req.params._id, req.body.folderId);
    }
    res.json({ url });
  } catch (_err) {
    next(ErrorFactory.create(_err, 'Error while getting file url'));
  }
};

exports.postFile = async (req, res, next) => {
  console.log('postFile', req.body.folderId, req.files.file);
  try {
    const { file, bookmark } = await FileService.uploadFile(req.user, req.files.file, req.body);
    res.json({ file, bookmark });
  } catch (_err) {
    next(ErrorFactory.create(_err, 'Error while uploading file'));
  }
};

exports.updateFile = async (req, res, next) => {
  console.log('updateFile', req.body);
  try {
    const user = await FileService.updateFile(req.user, req.body);
    const response = await UserHelper.clientData(user);
    res.json(response);
  } catch (_err) {
    next(ErrorFactory.create(_err, 'Error while updating file'));
  }
};

exports.updateMultipleFiles = async (req, res, next) => {
  console.log('updateMultipleFiles', req.body);
  try {
    const user = await FileService.updateMultipleFiles(req.user, req.body);
    const response = await UserHelper.clientData(user);
    res.json(response);
  } catch (_err) {
    next(ErrorFactory.create(_err, 'Error while updating multile files'));
  }
};

exports.deleteFile = async (req, res, next) => {
  console.log('deleteFile', req.params);
  try {
    await FileService.deleteFile(req.user, req.params._id);
    res.json({ fileId: req.params._id });
  } catch (_err) {
    next(ErrorFactory.create(_err, 'Error while deleting file'));
  }
};

exports.updateFileMetadata = async (req, res, next) => {
  console.log('updateFileMetadata', req.body);
  try {
    const savedFile = await FileService.updateFileMetadata(req.user, req.body);
    res.json(savedFile);
  } catch (_err) {
    next(ErrorFactory.create(_err, 'Error while updating file metadata'));
  }
};