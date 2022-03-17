const express = require('express')
const router = express.Router()

const StatusController = require('../controllers/status')
const isAuth = require('../middleware/isAuth')

router.get('/get', isAuth, StatusController.getStatuses)
router.post('/post', isAuth, StatusController.addStatus)
router.delete('/delete', isAuth, StatusController.deleteStatus)
router.put('/update', isAuth, StatusController.editStatus)

module.exports = router