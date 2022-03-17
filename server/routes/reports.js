const express = require('express')
const router = express.Router()

const ReportsController = require('../controllers/reports')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, ReportsController.getReports)
router.post('/post', isAuth, ReportsController.addReport)
router.delete('/delete', isAuth, ReportsController.deleteReport)
router.put('/update', isAuth, ReportsController.editReport)

module.exports = router
