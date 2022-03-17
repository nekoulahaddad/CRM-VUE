const express = require('express')
const router = express.Router()

const upload = require('../middleware/multer')

const RegionsController = require('../controllers/regions')
const isAuth = require('../middleware/isAuth')

router.get('/get', isAuth, RegionsController.getRegions)
router.post('/getbyid', isAuth, RegionsController.getRegionById)
router.post('/getbyslug', isAuth, RegionsController.getRegionBySlug)
router.post('/post', isAuth, upload.fields([{ name: 'sales' }]), RegionsController.addRegion)
router.delete('/delete', isAuth, RegionsController.deleteRegion)
router.post('/update', upload.fields([{ name: 'sales' }]), isAuth, RegionsController.editRegion)
router.post('/newimage', upload.fields([{ name: 'sale' }]), isAuth, RegionsController.replaceImageInRegionSales)
router.post('/deletesale', isAuth, RegionsController.removeSalesFromRegion)

module.exports = router