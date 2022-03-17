const mongoose = require('mongoose')
const Status = require('../models/status')

exports.getStatuses = async(req, res, next) => {
    try {
        const statuses = await Status.find().lean()
        console.log("///////////////////////")
        console.log("Statuses")
        console.log(statuses)
        console.log("///////////////////////")
        res.status(200).json(statuses)
    } catch (error) {
        next(error)
    }
}

exports.addStatus = async(req, res, next) => {
    try {
        const dataStatus = req.body
        const newStatus = await Status.insertOne(dataStatus)
        console.log("///////////////////////")
        console.log("New Status")
        console.log(newStatus)
        console.log("///////////////////////")
        await newStatus.save()
        res.status(201).json({ message: "ADDED" })
    } catch (error) {
        next(error)
    }
}

exports.editStatus = async(req, res, next) => {
    try {
        const statusId = req.body.statusId
        const currentStatus = await Status.findById(statusId)
        const dataStatus = req.body.status
        const updateStatus = await currentStatus.updateOne(dataStatus)
        console.log("///////////////////////")
        console.log("Updated Status")
        console.log(updateStatus)
        console.log("///////////////////////")
        res.status(204).json({ message: "EDITED" })
    } catch (error) {
        next(error)
    }
}

exports.deleteStatus = async(req, res, next) => {
    try {
        const statusId = req.body.statusId
        const deletedStatus = await Status.deleteOne({ _id: statusId })
        console.log("///////////////////////")
        console.log("Deleted Status")
        console.log(deletedStatus)
        console.log("///////////////////////")
        res.status(204).json({ message: "DELETED" })
    } catch (error) {
        next(error)
    }
}