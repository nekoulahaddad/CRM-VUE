const express = require('express')
const router = express.Router()

const GroupsController = require('../controllers/groups')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, GroupsController.getCategoryGroups)
router.post('/post', isAuth, GroupsController.addGroup)
router.post('/remove', isAuth, GroupsController.removeProductFromGroup)
router.post('/delete', isAuth, GroupsController.removeGroup)
router.post('/product', isAuth, GroupsController.addProductToGroup)
router.post('/edit', isAuth, GroupsController.editGroup)

module.exports = router