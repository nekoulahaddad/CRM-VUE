
const express = require('express')
const router = express.Router()
// const isAuth = require('../middleware/isAuth')
const sendMailController = require('../controllers/sendMail')

router.post('/', sendMailController.sendMail)
module.exports = router