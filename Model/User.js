import { Schema, model } from "mongoose";
import Joi from "joi";

const userSchema = new Schema({
    firtsname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        // required: true,
    },
    genre: {
        type: String,
        enum: ["man", "woman"],
        default: "man",
    },
    photo: String,
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["tailor", "user"],
        default: "user",
    },
    favoris: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
            default: [],
            required: true,
        },
    ],
    created: {
        type: Date,
        default: Date.now,
    },
});

const User = model("User", userSchema);
const validateUser = (user) => {
    const schema = Joi.object({
        firtsname: Joi.string().min(2).max(30).required(),
        lastname: Joi.string().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().trim().min(6).required().messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 6 characters long'
        }),
        role: Joi.string(),
        photo: Joi.string(),
        phone: Joi.string().pattern(new RegExp('^[0-9]{9,14}$')),
        genre: Joi.string().valid("man", "woman"),
    });

    return schema.validate(user);
};


//Tailor
const TailorSchema = new Schema({
    
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    totalRatings: {
        type: Number,
        default: 0,
    },
    follows: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
    votes : {
        type: Number,
        required: true,
        default: 0
    },

    created: {
        type: Date,
        default: Date.now
    },

credits: {
    type: Number,
    default: 50
},
freePostsUsed: {
    type: Number,
    default: 0
}

});


const Tailor = model("Tailor", TailorSchema);
const validateTailor = (tailor) => {
    const schema = Joi.object({
        // lastname: Joi.string().min(2).max(30).required(),
        phone: Joi.string().pattern(new RegExp('^[0-9]{9,14}$')),
        email: Joi.string().email().required(),
        photo: Joi.string(),
        password: Joi.string().min(6).required(),
        address: Joi.string().required(),
        idUser: Joi.required(),
        description: Joi.string().required(),
    });

    return schema.validate(tailor);
}

export { User, validateUser, Tailor, validateTailor };