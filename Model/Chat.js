import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            seen: {
                type: Boolean,
                default: false
            },
            content: [{
                type: String,
                required: true,
            }],
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export {Chat};