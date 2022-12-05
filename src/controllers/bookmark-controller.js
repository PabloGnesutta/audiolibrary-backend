const ErrorFactory = require('../factory/ErrorFactory');
const BookmarkService = require('../service/BookmarkService');

exports.getBookmarksForFile = async (req, res, next) => {
  console.log('getBookmarksForFile', req.params);
  try {
    const bookmarks = await BookmarkService.getUserFileBookmarks(req.user, req.params.fileId);
    res.json({ bookmarks });
  } catch (_err) {
    next(ErrorFactory.create(_err, 'Error while geting file bookmarks'));
  }
};

exports.createBookmark = async (req, res, next) => {
  console.log('createBookmark', req.body);
  try {
    const bookmark = await BookmarkService.createBookmark(req.user, req.body);
    res.json(bookmark);
  } catch (_err) {
    next(ErrorFactory.create(_err, 'Error while creating bookmark'));
  }
};

exports.deleteBookmark = async (req, res, next) => {
  console.log('deleteBookmark', req.params);
  try {
    await BookmarkService.deleteBookmark(req.user, req.params._id);
    res.json({ success: true });
  } catch (_err) {
    next(ErrorFactory.create(_err, 'Error while deleting bookmark'));
  }
};

exports.updateBookmark = async (req, res, next) => {
  console.log('updateBookmark', req.params, req.body);
  try {
    const bookmark = await BookmarkService.updateBookmark(req.user, req.params._id, req.body);
    res.json({ bookmark });
  } catch (err) {
    next(ErrorFactory.create(_err, 'Error while updating bookmark'));
  }
};
