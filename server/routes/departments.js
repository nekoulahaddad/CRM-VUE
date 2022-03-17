const express = require('express')
const router = express.Router()

const DepartmentsController = require('../controllers/departments')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth ,DepartmentsController.getDepartments)
router.get('/all', isAuth ,DepartmentsController.getDepartmentsAll)
router.post('/post', isAuth, DepartmentsController.addDepartment)
router.post('/delete', isAuth, DepartmentsController.deleteDepartment)
router.post('/update', isAuth , DepartmentsController.editDepartment)

module.exports = router