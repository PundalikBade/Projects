const mongoose = require('mongoose');

// User Schema
const userModel = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Store email in lowercase
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    followings: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to other user IDs
        ref: 'User' // Refers to the User model
    }]
}, { timestamps: true }); // Adds createdAt 

// Create the User model
const User = mongoose.model('User', userModel)

module.exports = User;