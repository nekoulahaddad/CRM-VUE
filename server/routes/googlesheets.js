const express = require('express')
const router = express.Router()
const uploadDocument = require('../middleware/multer')
const googleSheetsController = require('../controllers/googlesheets')
const isAuth = require('../middleware/isAuth')

// router.post('/get/', isAuth, ExcelController.getExcelFromCategories)

router.post('/linksheet/', isAuth, googleSheetsController.linkDocToRegion)
router.post('/unlinksheet/', isAuth, googleSheetsController.unlinkDocRegion)
router.post('/get/', isAuth, googleSheetsController.getDoc)
router.post('/add/', isAuth, googleSheetsController.addSheet)
router.post('/sync/', isAuth, googleSheetsController.syncRegionProducts)
router.post('/delete/', isAuth, googleSheetsController.deleteSheetRequest)


module.exports = router