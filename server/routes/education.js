const express = require('express')
const router = express.Router()

const EducationController = require('../controllers/education')
const isAuth = require('../middleware/isAuth')

const uploadDocument = require('../middleware/multer')

router.get('/get', isAuth, EducationController.getEducations)
router.post('/post', isAuth, EducationController.addEducation)
router.post('/update', isAuth, EducationController.editEducation)
router.post('/upload', uploadDocument.fields([{ name: 'document' }]), isAuth, EducationController.uploadDocument)
router.post('/delete', isAuth, EducationController.deleteEducation)
router.post('/deletedocument', isAuth, EducationController.deleteDocument)

// router.post('/delete', isAuth, EventsController.deleteEvent)
// router.put('/update', isAuth, EventsController.editEvent)

module.exports = router