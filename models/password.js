// password.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;
