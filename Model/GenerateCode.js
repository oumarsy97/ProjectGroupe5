import { Schema,model } from "mongoose";


const generateCodeSchema = new Schema({
    code: {
        type: String,
    },
    montant: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modePaiement: {
        type: String,
        enum: ["Wave", "OM"],
        default: "Wave"
    },
    // expire: {
    //     type: Date,
    //     default: Date.now + 5 * 60 * 1000
    // },
    status : {
        type: String,
        enum: ["pending", "used"],
        default: "pending"
    }
});
const GenerateCode = model("GenerateCode", generateCodeSchema);

export default GenerateCode;
