const express = require('express');
const router = express.Router();
const uploadDocument = require('../middleware/multer');
const feedsController = require('../controllers/feeds');
const isAuth = require('../middleware/isAuth');

router.post('/downloadfeed', isAuth, feedsController.downloadFeed);
module.exports = router;
