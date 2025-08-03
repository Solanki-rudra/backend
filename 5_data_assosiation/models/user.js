const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydatabase')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: Number,
    tweets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tweet'
        }
    ]
})

module.exports = mongoose.model('user', userSchema)