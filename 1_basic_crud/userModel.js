const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/basic_crud')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

module.exports = mongoose.model('User', userSchema)