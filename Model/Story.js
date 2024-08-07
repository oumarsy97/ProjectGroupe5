import {Schema, model} from "mongoose";

const storySchema = new Schema({
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
        expires: 86400,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    comments : {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

});


const Story = model("Story", storySchema);
const validateStory = (story) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(3).max(30).required(),
        content: Joi.string().required(),
    });
    return schema.validate(story);
}
export  {Story, validateStory} 