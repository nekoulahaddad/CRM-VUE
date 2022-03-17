const express = require('express')
const router = express.Router()

const OrgTree = require('../controllers/orgTree')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, OrgTree.getAll)
router.post('/getbyid', isAuth, OrgTree.getById)
router.post('/getfirst', isAuth, OrgTree.getFirst)
router.post('/department/post', isAuth, OrgTree.create)
router.post('/department/update', isAuth, OrgTree.update)
router.post('/department/delete', isAuth, OrgTree.delete)
router.post('/director/post', isAuth, OrgTree.createDirector)
router.post('/director/delete', isAuth, OrgTree.deleteDirector)
module.exports = router