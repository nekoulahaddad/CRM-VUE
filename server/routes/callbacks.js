const express = require('express')
const router = express.Router()

const CallbacksController = require('../controllers/callbacks')
const isAuth = require('../middleware/isAuth')
const uploadDocuments = require('../middleware/multer')

router.post('/get', isAuth, CallbacksController.getCallbacks)
    // router.post('/getproducts', isAuth, OrdersController.getProductsFromOrders)
    // router.post('/post', isAuth, OrdersController.addOrder)
router.post('/delete', isAuth, CallbacksController.deleteCallback)
router.post('/update', isAuth, CallbacksController.editCallbacks)
router.post('/receive', CallbacksController.receiveCallback)
router.post('/documents', uploadDocuments.fields([{ name: 'documents' }]), CallbacksController.uploadsCallbacksDocuments)
module.exports = router