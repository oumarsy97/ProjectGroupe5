import UserController from "../Controller/UserController.js";
import express from "express";
import Middleware from "../middlewares/Middleware.js";

const router = express.Router();

router.post("/register", UserController.addUser);
router.post("/login", UserController.login);
router.get("/", UserController.listUser); 
router.delete("/:id",UserController.deleteUser);
router.put("/:id",UserController.updateUser);
router.put("/tailor/:id",UserController.updateTailor);
router.post("/addtailor", UserController.addTailor);
router.get("/gettailor",Middleware.auth, UserController.listTailor);
router.get("/addfavoris/:idPost",Middleware.auth, UserController.addFavoris); 
router.delete("/deletefavoris/:idPost",Middleware.auth, UserController.deleteFavoris);
router.get('/search', Middleware.auth, UserController.search);
router.post("/addcredits",Middleware.auth,Middleware.isanTailor, UserController.addCredit);
router.post("/achatcode",Middleware.auth,Middleware.isanTailor, UserController.achatCode);
router.get("/monprofil",Middleware.auth,UserController.monprofil);
router.post("/becometailor/", Middleware.auth, UserController.becometailor);

//vendeur
router.post("/addvendor",UserController.addvendor);
router.get("/listervendors",UserController.listerVendors);
router.put("/updatevendor/:id",UserController.updatevendor);



export default router;