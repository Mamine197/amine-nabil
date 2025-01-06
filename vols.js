const express = require('express');
const router = express.Router();
const volController = require('../controllers/volController');

// Routes pour les vols
router.get('/', volController.getVols);
router.post('/', volController.createVol);
router.get('/:id', volController.getVol);
router.put('/:id', volController.updateVol);
router.delete('/:id', volController.deleteVol);

module.exports = router;
