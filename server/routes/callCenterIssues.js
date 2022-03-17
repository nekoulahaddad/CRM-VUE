const express = require('express')
const router = express.Router()

const CallCenterController = require('../controllers/callCenterIssues')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, CallCenterController.getCallIssues)
router.post('/getcallissuesbyname', isAuth, CallCenterController.getCallIssuesByName)
router.post('/post', isAuth, CallCenterController.addCallIssue)
router.post('/delete', isAuth, CallCenterController.deleteCallIssue)
router.post('/update', isAuth, CallCenterController.editCallIssue)

module.exports = router