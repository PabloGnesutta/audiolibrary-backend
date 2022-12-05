const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark-controller');

router.post('/', bookmarkController.createBookmark);
router.patch('/:_id', bookmarkController.updateBookmark);
router.delete('/:_id', bookmarkController.deleteBookmark);
router.get('/for-file/:fileId', bookmarkController.getBookmarksForFile);

module.exports = router;