const router = require('express').Router();
const { authenticate, isAdmin } = require('../middlewares/auth');
const decodeursController = require('../controllers/decodeursController');

// Routes décodeurs
router.get('/', authenticate, decodeursController.getAllDecodeurs);
router.get('/:id', authenticate, decodeursController.getDecodeurById);
router.get('/:id/status', authenticate, decodeursController.getDecodeurStatus);

// Assignment routes (admin only)
router.put('/:id/assign', authenticate, isAdmin, decodeursController.assignDecodeur);
router.put('/:id/unassign', authenticate, isAdmin, decodeursController.unassignDecodeur);
router.get('/available-ips', 
    authenticate, 
    decodeursController.getAvailableDecoderIps
  );
  
  router.get('/simulator-list', 
    authenticate, 
    decodeursController.getSimulatorDecoderList
  );

// Decoder operations (authenticated users with access rights)
router.post('/:id/restart', authenticate, decodeursController.restartDecodeur);
router.post('/:id/shutdown', authenticate, decodeursController.shutdownDecoder);
router.post('/:id/reinit', authenticate, decodeursController.reinitDecoder);

// Channel management (admin only)
router.put('/:id/channels', authenticate, isAdmin, decodeursController.addChannel);
// Change :channel to :chaine to match the controller
router.delete('/:id/channels/:chaine', authenticate, isAdmin, decodeursController.removeChannel);
// Admin only operations
router.delete('/:id', authenticate, isAdmin, decodeursController.deleteDecoder);

module.exports = router;