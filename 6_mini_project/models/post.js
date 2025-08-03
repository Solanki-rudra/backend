const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: String,
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, { timestamps: true });

const postModel = mongoose.model('post', postSchema);

module.exports = { postModel };