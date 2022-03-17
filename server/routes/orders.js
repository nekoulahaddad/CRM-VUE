const express = require('express')
const router = express.Router()

const OrdersController = require('../controllers/orders')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, OrdersController.getOrders)
router.post('/getproducts', isAuth, OrdersController.getProductsFromOrders)
router.post('/post', isAuth, OrdersController.addOrder)
router.post('/delete', isAuth, OrdersController.deleteOrder)
router.post('/update', isAuth, OrdersController.editOrder) 
router.post('/sendtoonec', isAuth, OrdersController.sendToOneC) 
router.post('/receive', OrdersController.receiveOrder)
router.get('/getByNumber', isAuth, OrdersController.getByNumber)

module.exports = router