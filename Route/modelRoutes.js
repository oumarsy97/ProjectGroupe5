const express = require('express');
const router = express.Router();
const { createModel, getModels, getModelById, updateModel, deleteModel } = require('../controllers/modelController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createModel);
router.get('/', getModels);
router.get('/:id', getModelById);
router.put('/:id', authMiddleware, updateModel);
router.delete('/:id', authMiddleware, deleteModel);

module.exports = router;
