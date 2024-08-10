import UserController from "../Controller/UserController.js";
import express from "express";
import Middleware from "../middlewares/Middleware.js";

const router = express.Router();
router.post("/register", UserController.addUser);
router.post("/login", UserController.login);
router.get("/", UserController.listUser); 
router.post("/addtailor", UserController.addTailor);
router.get("/gettailor",Middleware.auth, UserController.listTailor);
router.get("/addfavoris/:idPost",Middleware.auth, UserController.addFavoris); 
router.delete("/deletefavoris/:idPost",Middleware.auth, UserController.deleteFavoris);
router.post("/addcredits",Middleware.auth,Middleware.isanTailor, UserController.addCredit);
router.post("/achatcode",Middleware.auth,Middleware.isanTailor, UserController.achatCode);
router.put("/becomeTailor/:id", Middleware.auth, UserController.becomeTailor);

// Edit User profile
router.put("/edituser/:idUser", Middleware.auth, UserController.editUser);

export default router;