// routes/discussionRoutes.js
import DiscussionController from '../Controller/DiscussionController.js';
import express from 'express';
import Middleware from '../middlewares/Middleware.js';

const router = express.Router();

// Créer une discussion
router.post('/start', Middleware.auth, DiscussionController.startDiscussion);

// Envoyer un message dans une discussion
router.post('/message', Middleware.auth, DiscussionController.sendMessage);

// Marquer les messages comme vus
router.post('/markSeen/:discussionId', Middleware.auth, DiscussionController.markMessagesAsSeen);

// Récupérer les discussions de l'utilisateur
router.get('/myDiscussions', Middleware.auth, DiscussionController.getDiscussions);

export default router;