const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  name: String,
  type: String,
  size: Number,
  key: String,
  duration: Number,

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  folderId: Number,
  metaData: Object,

  lastInteraction: Date
});

FileSchema.post('remove', function (doc, next) {
  this.model('Bookmark').deleteMany({ owner: doc.owner, file: doc._id }, next);
});

module.exports = mongoose.model('File', FileSchema);