const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for the post's author
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for group members
    }],
});

module.exports = mongoose.model('Idea', ideaSchema);