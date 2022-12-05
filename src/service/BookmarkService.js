const BookmarkFactory = require('../factory/BookmarkFactory');
const BookmarkHelper = require('../helper/BookmarkHelper');
const BusinesError = require('../exception/BusinessError');

class BookmarkService {
  static async createBookmark(user, { label, file, time }) {
    try {
      const bookmark = await BookmarkFactory.bookmarkObject({ label, file, user, time }).save();
      if (!bookmark) {
        throw new BusinesError('Couldnt create bookmark');
      }
      return bookmark.publicData();
    } catch (_err) {
      throw _err;
    }
  }

  static async deleteBookmark(user, _id) {
    try {
      const bookmark = await BookmarkHelper.findOneAndDelete(user, _id);
      if (!bookmark) {
        throw new BusinesError('Couldnt delete bookmark');
      }
      return true;
    } catch (_err) {
      throw _err;
    }
  }

  static async updateBookmark(user, _id, params) {
    try {
      const bookmark = await BookmarkHelper.findOneAndUpdate(user, _id, params);
      if (!bookmark) {
        throw new BusinesError('Couldnt update bookmark');
      }
      return bookmark;
    } catch (_err) {
      throw _err;
    }
  }

  static async getUserFileBookmarks(user, fileId) {
    try {
      const bookmarks = await BookmarkHelper.userBookmarksByFileId(user, fileId);
      if (!bookmarks) {
        throw new BusinesError('Couldnt get bookmarks for file');
      }
      return bookmarks;
    } catch (_err) {
      throw _err;
    }
  }
}

module.exports = BookmarkService;