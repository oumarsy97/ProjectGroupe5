import joi from "joi";
import { Schema, model } from "mongoose";

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
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
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
    shares: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
    }
});

const Post = model("Post", postSchema);

export { Post };