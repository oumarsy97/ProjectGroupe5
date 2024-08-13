import VenteController from "../Controller/VenteController.js";
import express from "express";
import Middleware from "../middlewares/Middleware.js";

const router = express.Router();

router.post("/addProduit",Middleware.auth,Middleware.isanVendor, VenteController.addProduit);
router.put("/updateProduit/:idProduit", VenteController.updateProduit);
router.get("/getProduit/:venteId", VenteController.updateProduit);
router.post("/addVente", VenteController.addVente);
router.get("/ventesbyvendor/:idVendor", VenteController.getVendeByVendor);
export default router;