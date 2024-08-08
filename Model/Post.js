import joi from "joi";
import { Schema, model } from "mongoose";
const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: [{
        type: String,
        required: true,
    }],
    comments: [commentSchema],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    photo: String,
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    views: {
        type: Number,
        default: 0,
    },
    visibility: {
        type: String,
        enum: ["public", "friends"],
        default: "public",
    },
    mentions: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Tailor',
        }],
    },
    repost: [{
        type: Schema.Types.ObjectId,
        ref: 'Tailor',
    }],
    shares: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sharedAt: {
            type: Date,
            default: Date.now
        }
    }],
    reports: [{
        reportedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        reportedAt: {
            type: Date,
            default: Date.now,
        }
    }]
});

const Post = model("Post", postSchema);

export { Post };
