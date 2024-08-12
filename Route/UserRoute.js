    import UserController from "../Controller/UserController.js";
import express from "express";
import Middleware from "../middlewares/Middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour la gestion des utilisateurs
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User' 
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation des données
 */
router.post("/register", UserController.addUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User' 
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants incorrects
 */
router.post("/login", UserController.login);

router.get("/", UserController.listUser);
router.delete("/:id", UserController.deleteUser);
router.put("/:id", UserController.updateUser);
router.put("/tailor/:id", UserController.updateTailor);
router.post("/addtailor", UserController.addTailor);
router.get("/gettailor", Middleware.auth, UserController.listTailor);
router.get("/addfavoris/:idPost", Middleware.auth, UserController.addFavoris);

router.delete(
  "/deletefavoris/:idPost",
  Middleware.auth,
  UserController.deleteFavoris
);
router.get("/search", Middleware.auth, UserController.search);
router.post(
  "/addcredits",
  Middleware.auth,
  Middleware.isanTailor,
  UserController.addCredit
);
router.post(
  "/achatcode",
  Middleware.auth,
  Middleware.isanTailor,
  UserController.achatCode
);
router.get("/monprofil", Middleware.auth, UserController.monprofil);
router.post("/becometailor/", Middleware.auth, UserController.becometailor);

export default router;
