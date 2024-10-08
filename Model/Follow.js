import { Schema, SchemaType, model } from "mongoose";
import Joi from "joi";

const followSchema = new Schema({
  followerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  followedId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

const Follow = model("Follow", followSchema);
const validateFollow = (follow) => {
  const schema = Joi.object({
    followedId: Joi.string().required(),
  });

  return schema.validate(follow);
};

export { Follow, validateFollow };