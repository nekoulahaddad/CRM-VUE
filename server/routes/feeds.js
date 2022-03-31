const express = require('express')
const router = express.Router()
const uploadDocument = require('../middleware/multer')
const FeedsController = require('../controllers/feeds')
const isAuth = require('../middleware/isAuth')

router.post('/getfeeds',  FeedsController.getFeeds)
module.exports = router