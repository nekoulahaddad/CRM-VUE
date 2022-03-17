const express = require('express')
const router = express.Router()

const ProvidersController = require('../controllers/providers')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, ProvidersController.getProviders)
router.post('/getprovidersbyname', isAuth, ProvidersController.getProvidersByName)
router.post('/getcategories', isAuth, ProvidersController.getProvidersCategories)
router.post('/post', isAuth, ProvidersController.addProvider)
router.post('/delete', isAuth, ProvidersController.deleteProvider)
router.post('/update', isAuth, ProvidersController.editProvider)
router.post('/getfromsearch', isAuth, ProvidersController.getDataFromSearchQuery)

module.exports = router