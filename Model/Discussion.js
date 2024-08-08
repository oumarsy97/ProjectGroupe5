// models/Discussion.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

const discussionSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ],
    messages: [messageSchema],
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
});

const Discussion = mongoose.model('Discussion', discussionSchema);

export {Discussion};
