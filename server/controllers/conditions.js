const mongoose = require('mongoose')
const Conditions = require('../models/conditions')

exports.getStatuses = async(req, res, next) => {
    try {
        const statuses = await Conditions.find().lean()
        res.status(200).json(statuses)
    } catch (error) {
        next(error)
    }
}

exports.addStatus = async(req, res, next) => {
    try {
        const dataStatus = req.body
        const newStatus = await Conditions.insertOne(dataStatus)
        await newStatus.save()
        res.status(201).json({ message: "ADDED" })
    } catch (error) {
        next(error)
    }
}

exports.editStatus = async(req, res, next) => {
    try {
        const statusId = req.body.statusId
        const currentStatus = await Conditions.findById(statusId)
        const dataStatus = req.body.status
        const updateStatus = await Conditions.updateOne(dataStatus)
        res.status(204).json({ message: "EDITED" })
    } catch (error) {
        next(error)
    }
}

exports.deleteStatus = async(req, res, next) => {
    try {
        const statusId = req.body.statusId
        const deletedStatus = await Conditions.deleteOne({ _id: statusId })
        res.status(204).json({ message: "DELETED" })
    } catch (error) {
        next(error)
    }
}