const UserService = require("../service/UserService");
const ErrorFactory = require('../factory/ErrorFactory');

exports.createFolder = async (req, res, next) => {
  console.log('createFolder', req.body);
  try {
    const newFolder = await UserService.createFolder(req.user, req.body.name);
    res.json(newFolder);
  } catch (err) {
    next(ErrorFactory.create(err, 'Error while creating folder'));
  }
};

exports.deleteFolder = async (req, res, next) => {
  console.log('deleteFolder', req.params);
  try {
    await UserService.deleteFolder(req.user, req.params.id);
    res.json({ folderId: req.params.id });
  } catch (err) {
    next(ErrorFactory.create(err, 'Error while deleting folder'));
  }
};

exports.renameFolder = (req, res, next) => {
  console.log('renameFolder', req.body);
  UserService.renameFolder(req.user, req.body)
    .then(successResponse => {
      res.json(successResponse);
    })
    .catch(err => {
      next(ErrorFactory.create(err, 'Error while renaming folder'));
    });
};