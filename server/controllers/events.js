const mongoose = require('mongoose')
const Event = require('../models/events')

exports.getEvents = async(req, res, next) => {
    try {
        const events = await Event.find()
        .populate({
            path: 'participants._id',
            model: 'User',
            select: { '_id': 1, 'name': 1, 'surname': 1, 'lastname': 1 },
        })
        .populate({
            path: 'initiator',
            model: 'User',
            select: { '_id': 1, 'name': 1, 'surname': 1, 'lastname': 1 },
        }).lean()
        console.log("///////////////////////")
        console.log("Events")
      //   console.log(events)
        console.log("///////////////////////")
        res.status(200).json(events)
    } catch (error) {
        next(error)
    }
}

exports.addEvent = async(req, res, next) => {
    try {
        const dataEvent = req.body
        console.log(req.body)
        const newEvent = await Event.create(dataEvent)
        console.log("///////////////////////")
        console.log("New Event")
        console.log(newEvent)
        console.log("///////////////////////")
        await newEvent.save()
        const event = await Event.findById(mongoose.Types.ObjectId(newEvent._id)).populate({
            path: 'participants._id',
            model: 'User',
            select: { '_id': 1, 'name': 1, 'surname': 1, 'lastname': 1 }
        }).lean()
        res.status(201).json({
            message: "ADDED",
            event: event
        })
    } catch (error) {
        next(error)
    }
}

exports.editEvent = async(req, res, next) => {
    try {
        const dataEvent = req.body
        console.log(req.body)
        const updated = await Event.findOneAndUpdate({ _id: mongoose.Types.ObjectId(dataEvent._id) }, dataEvent)
        console.log("///////////////////////")
        console.log("Updated Event")
        console.log(updated)
        console.log("///////////////////////")

        res.status(201).json({
            message: "EDITED"
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteEvent = async(req, res, next) => {
    try {
        const eventId = req.body.eventId
        console.log(req.body)
        const deletedEvent = await Event.findOneAndDelete({ _id: eventId }).lean()
        console.log("///////////////////////")
        console.log("Deleted Event")
        console.log(deletedEvent)
        console.log("///////////////////////")
        res.status(201).json({
            message: "DELETED",
            event: deletedEvent
        })
    } catch (error) {
        next(error)
    }
}