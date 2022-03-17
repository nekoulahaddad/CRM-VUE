const express = require('express')
const router = express.Router()

const ClientsController = require('../controllers/clients')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, ClientsController.getClients)
router.post('/create', ClientsController.addClient)
router.get('/login', ClientsController.authLogin)
router.post('/refresh', isAuth, ClientsController.refreshToken)
router.post('/delete', isAuth, ClientsController.deleteClient)
    // router.put('/update', isAuth, ClientsController.editClient)
router.get('/getclientbyphone/:phone', isAuth, ClientsController.getClientByPhone)

module.exports = router