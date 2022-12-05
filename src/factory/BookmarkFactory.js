const Bookmark = require('../model/Bookmark');

class BookmarkFactory {
  static bookmarkObject({ label, time, user, file }) {
    return new Bookmark({
      owner: user,
      label,
      time,
      file,
    });
  }
}

module.exports = BookmarkFactory;