const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const uploadDocument = require('../middleware/multer')

const TasksController = require('../controllers/tasks')
const isAuth = require('../middleware/isAuth')

router.post('/get', isAuth, TasksController.getTasks)
router.post('/desktop', isAuth,  TasksController.getTasksForDesktop)
router.post('/getsub', isAuth, TasksController.getSubTasks)
router.post('/getcount', isAuth, TasksController.getTasksCount)
router.post('/post', upload.fields([{ name: 'documents' }]), isAuth, TasksController.addTask)
router.delete('/delete', isAuth, TasksController.deleteTask)
router.post('/update', uploadDocument.fields([{ name: 'documents' }]), isAuth, TasksController.editTask)
router.post('/status', uploadDocument.fields([{ name: 'documents' }]), isAuth, TasksController.editTaskStatus)

module.exports = router