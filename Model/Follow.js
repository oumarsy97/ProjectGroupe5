import { Schema, model } from "mongoose";
import Joi from "joi";

const followSchema = new Schema({
    followerId: {
        type: String,
        required: true,
    },
    followedId: {
        type: String,
        required: true,
    }
});

const Follow = model("Follow", followSchema);
const validateFollow = (follow) => {
  const schema = Joi.object({
    followerId: Joi.string().required(),
    followedId: Joi.string().required(),
  });

    return schema.validate(follow);
  };


export { Follow, validateFollow };