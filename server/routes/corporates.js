const express = require('express')
const router = express.Router()

const CorporatesController = require('../controllers/corporates')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, CorporatesController.getCorporates)
router.post('/create', CorporatesController.addCorporate)
router.get('/login', CorporatesController.authLogin)
router.post('/refresh', isAuth, CorporatesController.refreshToken)
router.post('/delete', isAuth, CorporatesController.deleteCorporate)
router.post('/update', isAuth, CorporatesController.updateCorporate)

module.exports = router