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
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation des données ou utilisateur déjà existant
 *       500:
 *         description: Erreur serveur
 */
router.post("/register", UserController.addUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post("/login", UserController.login);


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lister tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur
 */

router.get("/", UserController.listUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", UserController.deleteUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", UserController.updateUser);


/**
 * @swagger
 * /users/tailor/{id}:
 *   put:
 *     summary: Mettre à jour un tailleur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tailor'
 *     responses:
 *       200:
 *         description: Tailleur mis à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       404:
 *         description: Tailleur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/tailor/:id", UserController.updateTailor);


/**
 * @swagger
 * /users/addtailor:
 *   post:
 *     summary: Ajouter un nouveau tailleur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tailor'
 *     responses:
 *       201:
 *         description: Tailleur créé avec succès
 *       400:
 *         description: Erreur de validation des données ou utilisateur déjà existant
 *       500:
 *         description: Erreur serveur
 */
router.post("/addtailor", UserController.addTailor);


/**
 * @swagger
 * /users/gettailor:
 *   get:
 *     summary: Lister tous les tailleurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tailleurs récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */

router.get("/gettailor", Middleware.auth, UserController.listTailor);



/**
 * @swagger
 * /users/addfavoris/{idPost}:
 *   get:
 *     summary: Ajouter un post aux favoris
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPost
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post ajouté aux favoris avec succès
 *       400:
 *         description: Post déjà dans les favoris
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/addfavoris/:idPost", Middleware.auth, UserController.addFavoris);


/**
 * @swagger
 * /users/deletefavoris/{idPost}:
 *   delete:
 *     summary: Supprimer un post des favoris
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPost
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post supprimé des favoris avec succès
 *       400:
 *         description: Post non présent dans les favoris
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.delete("/deletefavoris/:idPost", Middleware.auth, UserController.deleteFavoris);


/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Rechercher des tailleurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *     responses:
 *       200:
 *         description: Résultats de recherche récupérés avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/search", Middleware.auth, UserController.search);



/**
 * @swagger
 * /users/addcredits:
 *   post:
 *     summary: Ajouter des crédits à un tailleur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crédits ajoutés avec succès
 *       400:
 *         description: Code invalide ou déjà utilisé
 *       404:
 *         description: Utilisateur ou tailleur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/addcredits",Middleware.auth,Middleware.isanTailor,UserController.addCredit);



/**
 * @swagger
 * /users/achatcode:
 *   post:
 *     summary: Acheter un code de crédit
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - montant
 *               - modePaiement
 *             properties:
 *               montant:
 *                 type: number
 *               modePaiement:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code créé avec succès
 *       400:
 *         description: Montant invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/achatcode",Middleware.auth,Middleware.isanTailor,UserController.achatCode);



/**
 * @swagger
 * /users/monprofil:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *       404:
 *         description: Utilisateur ou tailleur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/monprofil", Middleware.auth, UserController.monprofil);




/**
 * @swagger
 * /users/becometailor:
 *   post:
 *     summary: Devenir tailleur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - address
 *             properties:
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur devenu tailleur avec succès
 *       400:
 *         description: Utilisateur déjà tailleur
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/becometailor/", Middleware.auth, UserController.becometailor);

export default router;
