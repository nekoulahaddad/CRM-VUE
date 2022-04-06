const express = require('express');
const router = express.Router();
const feedsController = require('../controllers/feeds');
const isAuth = require('../middleware/isAuth');

router.post('/downloadfeed', isAuth, feedsController.downloadFeed);
router.post('/askalink', isAuth, feedsController.askALink)
module.exports = router;
