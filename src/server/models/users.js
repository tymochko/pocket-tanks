const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    userName: {type: String, required: true, unique: true},
    userEmail: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true},
    isOnline: {type: Boolean},
    isEnabled: {type: Boolean}
});

module.exports = mongoose.model('User', userSchema);