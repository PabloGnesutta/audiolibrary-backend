const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookmarkSchema = new Schema({
  label: String,
  time: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  file: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },
});

BookmarkSchema.methods.publicData = function () {
  return {
    _id: this._id,
    time: this.time,
    label: this.label,
    fileId: this.file._id
  };
};
module.exports = mongoose.model('Bookmark', BookmarkSchema);