const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file-controller');

router.post('/:_id/url', fileController.getFileUrl);
router.post('/', fileController.postFile);
router.put('/', fileController.updateFile); //should be /:id

router.delete('/:_id', fileController.deleteFile);
router.put('/multiple-files', fileController.updateMultipleFiles);
router.put('/metadata', fileController.updateFileMetadata); //should be /:id

module.exports = router;