const express = require('express')
const router = express.Router()
const uploadDocument = require('../middleware/multer')
const ExcelController = require('../controllers/excel')
const isAuth = require('../middleware/isAuth')

router.post('/get/', isAuth, ExcelController.getExcelFromCategories)
router.post('/users/', isAuth, ExcelController.getExcelFromDeletedUsers)
router.post('/allusers/', isAuth, ExcelController.getExcelFromAllUsers)
router.post('/children/', isAuth, ExcelController.getExcelFromChildren)
router.post('/birthday/', isAuth, ExcelController.getExcelFromUsersBirthday)
router.post('/getgoodsfromregion/', isAuth, ExcelController.getGoodsFromRegion)
router.post('/exportproductsimages/', isAuth, ExcelController.exportImagesProducts)
router.post('/exportcategoryproducts/', isAuth, ExcelController.exportCategoryProducts)
router.post('/importcategoryproducts/',  uploadDocument.fields([{ name: 'document' }]), ExcelController.importCategoryProducts)
router.get('/getfile', ExcelController.exportOneC)
router.post('/getordersfromregion/', isAuth, ExcelController.getOrdersFromRegion)
router.post('/getorders', isAuth, ExcelController.exportOrders)
// router.post('/exportcategoryfeed', isAuth, ExcelController.getCategoryFeedYML)
router.post('/clients/', ExcelController.getExcelFromClients)
module.exports = router