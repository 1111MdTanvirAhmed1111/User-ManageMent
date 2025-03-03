const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fathersname: { type: String, required: true, unique: true },
  mothersname: { type: String, required: true, unique: true },
  class: {type:String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  ProfilePic: {type:String, default: ""},
  resetToken: { type: String, default: null },  // to store the reset token
  resetTokenExpiry: { type: Date, default: null }, // to store token expiry time
});

module.exports = mongoose.model('User', userSchema);