const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  name: String,
  password: String,

  lastFileSeen: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },

  folders: Array,
  folderIdCounter: Number,
  lastFolderSeen: Number,

  emailToken: String,
  emailTokenExpiration: String,
  emailVerified: Boolean,
  createdAt: Date,
});

module.exports = mongoose.model('User', UserSchema);