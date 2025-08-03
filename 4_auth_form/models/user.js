const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/authForm')

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    number: Number,
})

module.exports = mongoose.model('User', userSchema)