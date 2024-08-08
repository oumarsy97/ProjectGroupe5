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
        default: Date.now,
        expires: 60 * 60 * 24 * 7,
    },
    modePaiement: {
        type: String,
        enum: ["Wave", "OM"],
        default: "Wave"
    },
    
    status : {
        type: String,
        enum: ["pending", "used"],
        default: "pending"
    }
});
const GenerateCode = model("GenerateCode", generateCodeSchema);

export default GenerateCode;
