import { Schema, model } from 'mongoose';

const reportSchema = new Schema({
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Change to 'Tailor' if reporting a tailor
        required: true,
    },
    reportedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Change to 'Tailor' if reporting a tailor
        required: false, // Make it optional if reporting a tailor
    },
    reportedTailor: {
        type: Schema.Types.ObjectId,
        ref: 'Tailor', // Change to 'User' if reporting a user
        required: false, // Make it optional if reporting a user
    },
    reason: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = model('Report', reportSchema);

export default Report;
