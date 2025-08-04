const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mini_project')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    password: String,
    email: String,
    age: Number,
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    profilePic:{
        type: String,
        default: 'default-profile.png'
    }
})

const userModel = mongoose.model('user', userSchema)

module.exports = { userModel };