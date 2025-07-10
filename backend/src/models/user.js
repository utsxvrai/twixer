const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    noOfPosts: {
        type: Number,
        default: 0
    },
    notifications: [
        {
            type: {
                type: String, // 'follow', 'like', 'comment'
                required: true
            },
            fromUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            tweet: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tweet',
                default: null
            },
            message: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

module.exports = mongoose.model('User', user)