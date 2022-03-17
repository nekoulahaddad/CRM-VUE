const express = require('express')
const router = express.Router()

const upload = require('../middleware/multer')

const BrandsController = require('../controllers/brands')
const isAuth = require('../middleware/isAuth')
const clearCache = require('../middleware/clearCacheBrands')

router.post('/get', isAuth, BrandsController.getBrandsProducts)
router.post('/post', isAuth, upload.fields([{name: 'brandImage'}]), BrandsController.addBrand, clearCache)
router.post('/delete', isAuth, BrandsController.deleteBrand, clearCache)
router.post('/update', isAuth, upload.fields([{name: 'brandImage'}]), BrandsController.editBrand, clearCache)

module.exports = router