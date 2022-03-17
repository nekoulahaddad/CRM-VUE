const express = require('express')
const router = express.Router()

const CallsController = require('../controllers/calls')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, CallsController.getCalls)
router.get('/getnumbers', isAuth, CallsController.getCallsNumbers)

module.exports = router