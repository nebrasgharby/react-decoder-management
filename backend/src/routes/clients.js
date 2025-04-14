const router = require('express').Router();
const { authenticate, isAdmin } = require('../middlewares/auth');
const clientsController = require('../controllers/clientsController');

router.get('/', authenticate, isAdmin, clientsController.getAllClients);
router.post('/', authenticate, isAdmin, clientsController.createClient);
router.delete('/:id', authenticate, isAdmin, clientsController.deleteClient);

module.exports = router;
