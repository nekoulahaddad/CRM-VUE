const express = require('express')
const router = express.Router()

const EducationController = require('../controllers/vacancies')
const isAuth = require('../middleware/isAuth')

// const uploadDocument = require('../middleware/multer')

router.post('/get', isAuth, EducationController.getVacancies)
router.post('/post', isAuth, EducationController.addVacancy)
router.post('/update', isAuth, EducationController.editVacancy)
// router.post('/upload', uploadDocument.fields([{ name: 'document' }]), isAuth, EducationController.uploadDocument)
router.post('/delete', isAuth, EducationController.deleteVacancy)
// router.post('/deletedocument', isAuth, EducationController.deleteDocument)

// router.post('/delete', isAuth, EventsController.deleteEvent)
// router.put('/update', isAuth, EventsController.editEvent)

module.exports = router