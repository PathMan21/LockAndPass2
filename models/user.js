const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwords: [{ password: String }] // Array pour stocker les mots de passe
});

const User = mongoose.model('User', userSchema);

module.exports = User;
