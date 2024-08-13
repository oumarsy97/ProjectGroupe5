import { Vente, VenteValidator,Produit,ProduitValidator } from "../Model/Vente.js";
import { User } from "../Model/User.js";

export default class VenteController {
    
static addProduit = async (req, res) => {
    const { name, description, image, color, quantite, prixUnitaire } = req.body;
    const idVendor = req.userId;

    const { error } = ProduitValidator({ name, description, image, color, idVendor, quantite, prixUnitaire });
    if (error) return res.status(400).json({ message: error.details[0].message, data: null, status: false });
    try {
        const newVente = new Produit({ name, description, image, color, quantite, prixUnitaire, idVendor });
        await newVente.save();
        res.send(newVente);
    } catch (error) {
        res.status(500).send(error);
    }
}

//maj qte Produit
static updateProduit = async (req, res) => {
    const { name, description, image, color, idVendor, quantite, prixUnitaire } = req.body;
    const { error } = VenteValidator({ name, description, image, color, idVendor, quantite, prixUnitaire });
    if (error) return res.status(400).json({ message: error.details[0].message, data: null, status: false });
    try {
        const produit = await Produit.findById(req.params.idProduit);
        if (!produit) return res.status(404).send("Vente not found");
        produit.name = name;
        produit.description = description;
        produit.image = image;
        produit.color = color;
        produit.idVendor = idVendor;
        produit.quantite = quantite;
        produit.prixUnitaire = prixUnitaire;
        await produit.save();
        res.status(200).json({message: 'Vente updated successfully', data: produit, status: true});
    } catch (error) {
        res.status(500).send(error);
    }
}



static getProduitbyIdVente = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({message: 'User not found', data: null, status: false}); 
        const idVente = req.params.idVente;
        const ventes = await Vente.findById(idVente);
        if (!ventes) return res.status(404).json({message: 'Vente not found', data: null, status: false});
        res.status(200).json({message: 'les ventes de ce vendeur', data: ventes, status: true});
    } catch (error) {
        res.status(500).send(error);
    }
}

static getVendeByVendor = async (req, res) => {
    try {
        const idVendor = req.userId;
        const ventes = await Vente.findOne({ idVendor: idVendor });
        res.status(200).json({message: 'les ventes de ce vendeur', data: ventes, status: true});
    } catch (error) {
        res.status(500).send(error);
    }
}
//enregistrer une vente
static addVente = async (req, res) => {
    const idVendor = req.userId;
    const { idProduit, quantite, prixUnitaire,idUser } = req.body;

    const { error } = VenteValidator({ idProduit, quantite, prixUnitaire, idUser });
    if (error) return res.status(400).json({ message: error.details[0].message, data: null, status: false });

    try {
        const newVente = new Vente({ idProduit, quantite, prixUnitaire, idUser, idVendor });
        await newVente.save();
        res.status(200).json({message: 'Vente ajouter avec succes', data: newVente, status: true});;
    } catch (error) {
        res.status(500).send(error);
    }
}




}