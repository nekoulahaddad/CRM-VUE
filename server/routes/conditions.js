const express = require('express')
const router = express.Router()

const ConditionsController = require('../controllers/conditions')
const isAuth = require('../middleware/isAuth')

router.get('/get', isAuth, ConditionsController.getStatuses)
router.post('/post', isAuth, ConditionsController.addStatus)
router.delete('/delete', isAuth, ConditionsController.deleteStatus)
router.put('/update', isAuth, ConditionsController.editStatus)

module.exports = router