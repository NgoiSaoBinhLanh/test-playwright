const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now }
}, { 
    collection: 'infouser' // Tên collection trong MongoDB của bạn
});

module.exports = mongoose.model('User', UserSchema);