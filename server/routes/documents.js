const express = require('express')
const router = express.Router()

const SenderController = require('../controllers/sender')

router.post('/get', SenderController.getPdfFileFromOrder) 

module.exports = router