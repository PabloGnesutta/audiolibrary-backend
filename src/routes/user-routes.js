const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');

router.post('/folder', UserController.createFolder);
router.put('/folder', UserController.renameFolder);
router.delete('/folder/:id', UserController.deleteFolder);

module.exports = router;