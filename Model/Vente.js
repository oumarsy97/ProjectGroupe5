import  {model, Schema} from 'mongoose';
import joi from 'joi';
const ProduitSchema = new Schema({
    name: {
        type: String,
        required: true
        
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    idVendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    quantite: {
        type: Number,
        required: true
    },
        prixUnitaire: {
            type: Number,
            required: true
        },
    date: {
        type: Date,
        default: Date.now
    },
})
const Produit = model('Produit', ProduitSchema);
const ProduitValidator = (produit) => {
    const schema = joi.object({
        name: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().required(),
        color: joi.string().required(),
        idVendor: joi.string().required(),
        quantite: joi.number().required(),
        prixUnitaire: joi.number().required(),
    });
    return schema.validate(produit);
}


const venteSchema = new Schema({
    idVendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    idProduit: {
        type: Schema.Types.ObjectId,
        ref: 'Produit',
        required: true
    },
    quantite: {
        type: Number,
        required: true
    },
    prixUnitaire: {
        type: Number,
        required: true
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const VenteValidator = (vente) => {
    const schema = joi.object({
        idVendor: joi.string().required(),
        idProduit: joi.string().required(),
        quantite: joi.number().required(),
    });
    return schema.validate(vente);
}

const Vente = model('Vente', venteSchema);

export { Vente, Produit, VenteValidator, ProduitValidator };

 