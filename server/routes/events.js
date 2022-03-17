const express = require('express')
const router = express.Router()

const EventsController = require('../controllers/events')
const isAuth = require('../middleware/isAuth')

router.get('/get', isAuth, EventsController.getEvents)
router.post('/post', isAuth, EventsController.addEvent)
router.post('/delete', isAuth, EventsController.deleteEvent)
router.post('/update', isAuth, EventsController.editEvent)

module.exports = router