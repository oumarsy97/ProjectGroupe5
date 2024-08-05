import { Schema, model } from "mongoose";
import Joi from "joi";

const userSchema = new Schema({
    firstname: {
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
    phone:String,
    role: {
        type: String,
        enum: ["tailor", "user"],
        default: "user",
    },
});

const User = model("User", userSchema);
const validateUser = (user) => {
    const schema = Joi.object({
      firstname: Joi.string().min(3).max(30).required(),
      lastname: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password:  Joi.string().trim().min(6).required().messages({
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must be at least 6 characters long'
      }), 
      role: Joi.string(),
      photo: Joi.string(),
      phone:Joi.string().pattern(new RegExp('^[0-9]{9,14}$')),
      genre: Joi.string().valid("man", "woman"),
    });
  
    return schema.validate(user);
  };

  const validationResult = Joi.string().trim().min(6).required().messages({
    'string.empty': 'Le mot de passe ne peut pas être vide',
    'string.min': 'Le mot de passe doit comporter au moins 6 caractères'
  }).validate();

export { User, validateUser };



