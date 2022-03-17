const express = require('express')
const router = express.Router()

const PurchaseController = require('../controllers/purchase')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, PurchaseController.getAll)
router.get('/getByOrderNumber', isAuth, PurchaseController.getByOrderNumber)
router.post('/post', isAuth, PurchaseController.create)
router.post('/update', isAuth, PurchaseController.edit)
router.post('/delete', isAuth, PurchaseController.delete)

module.exports = router