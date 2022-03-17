const express = require('express')
const router = express.Router()

const SeoController = require('../controllers/seo')
const isAuth = require('../middleware/isAuth')

router.post('/update', isAuth, SeoController.editSeoItem)
router.get('/getinfoaboutallusers', isAuth, SeoController.getInfoAboutAllUsers)

module.exports = router