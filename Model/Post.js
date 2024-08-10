import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  response: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
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
    },
    response: [{
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
    }]
}  ],
});

const notesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    note: {
        type: Number,
        required: true
    }
});


const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    gender: {
      type: String,
      enum: ["homme", "femme", "enfant garçon", "enfant fille"],
      required: true,
    },
    size: {
      type: String,
      enum: ["s", "xs", "m", "l", "xl", "xxl", "3xl"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    notes: [notesSchema],
    visibility: {
        type: String,
        enum: ["public", "friends"],
        default: "public",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: [
    {
      type: String,
      required: true,
    },
  ],
  comments: [commentSchema],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  photo: String,
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  
  mentions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tailor",
    },
  ],
  repost: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tailor",
    },
  ],
  shares: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

 
  reports: [
    {
      reportedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
      reportedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
    
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
   
});

const Post = model("Post", postSchema);

export { Post };
