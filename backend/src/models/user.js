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
    
})

module.exports = mongoose.model('User', user)