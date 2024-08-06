import { Schema, SchemaType, model } from "mongoose";
import Joi from "joi";

const followSchema = new Schema({
    followerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    followedId: {
        type: Schema.Types.ObjectId,
        ref: "User",
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