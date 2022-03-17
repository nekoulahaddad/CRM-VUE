const express = require('express')
const router = express.Router()

const MangoController = require('../controllers/mango')
const isAuth = require('../middleware/isAuth')

router.get('/get', isAuth, MangoController.getMangoCalls)
router.get('/recording', isAuth, MangoController.getMangoCallsRecording)
router.post('/call', isAuth, MangoController.callFromManagerToClient)
router.post('/hangup', isAuth, MangoController.callHangUp)

module.exports = router