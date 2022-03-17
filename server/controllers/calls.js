const mongoose = require('mongoose')
const Calls = require('../models/calls')
const moment = require('moment')
const VPBX = require('mango-vpbx');
const vpbx = new VPBX(process.env.MANGO_TOKEN, process.env.MANGO_KEY);


exports.getCallsNumbers = async(req, res, next) => {
    try {
        let list = await vpbx.users();
        let users = list.users.map((user) => {

            return {
                name: user.general.name,
                phone: user.telephony.outgoingline
            }
        })
        console.log(users)
        res.status(200).json({ numbers: users })
    } catch (error) {
        next(error)
    }
}

exports.getCalls = async(req, res, next) => {
    try {
        const page = +req.query.page - 1
        const options = req.body.options
        const myMatch = {}
        console.log(page)
        console.log(options)

        if (options.startDate && new Date(options.startDate) instanceof Date) {
            let startDate = new Date(moment(options.startDate))
            let endDate = new Date(moment(options.endDate))

            myMatch['createdAt'] = {
                "$lt": endDate,
                "$gt": startDate
            }
        }

        if (options.phone && options.phone !== 'all') {
            myMatch['from.number'] = options.phone
        }

        const calls = await Calls.find(myMatch).populate('user').populate('client').sort({ createdAt: -1 }).skip(15 * page).limit(15).lean()
        const count = await Calls.find(myMatch).countDocuments()
        let result = {
            calls: calls,
            count: count
        }

        console.log("///////////////////////")
        console.log("Calls")
            // console.log(result)
        console.log("///////////////////////")
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

exports.addStatus = async(req, res, next) => {
    try {
        const dataStatus = req.body
        const newStatus = await Conditions.insertOne(dataStatus)
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
        const currentStatus = await Conditions.findById(statusId)
        const dataStatus = req.body.status
        const updateStatus = await Conditions.updateOne(dataStatus)
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
        const deletedStatus = await Conditions.deleteOne({ _id: statusId })
        console.log("///////////////////////")
        console.log("Deleted Status")
        console.log(deletedStatus)
        console.log("///////////////////////")
        res.status(204).json({ message: "DELETED" })
    } catch (error) {
        next(error)
    }
}