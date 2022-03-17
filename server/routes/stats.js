const express = require('express')
const router = express.Router()

const StatsController = require('../controllers/stats')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, StatsController.getShopStats)
router.post('/getcallbacks', isAuth, StatsController.getCallbacksStats)

module.exports = router