const mongoose = require('mongoose')
const { findById } = require('../models/callbacks')
const Callbacks = require('../models/callbacks')
const Orders = require('../models/orders')
const Regions = require('../models/regions')
const user = require('../models/user')
const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { translit } = require('gost-transliteration')
const {
    uploadFilesFromTempToFolder,
    makeUserDir,
    removeUserDir,
    removeDir,
    deleteUserUploadedFile,
    copyFolderRecursively
} = require('../utils/fs')

const moment = require('moment')
const { TEMP_PATH, CALLBACKS_PATH } = require('../utils/path')
exports.getCallbacks = async(req, res, next) => {
    try {
        const page = +req.query.page - 1
        const options = req.body.options

        let myMatch = {}

        if (options.status !== "all" && options.status !== null) {
            myMatch['status'] = options.status === 'true' ? true : false
        }
        if (options.region !== "all" && options.region !== null) {
            myMatch['region.value'] = {
                "$in": [options.region]
            }
        }
        if (options.executor !== "" && options.executor !== null) {
            myMatch['manager._id'] = {
                "$in": [mongoose.Types.ObjectId(options.executor)]
            }
        }
        if (req.userRole !== 'superadmin' && req.userRole !== 'admin' && req.userRole !== 'director' && req.userRole !== 'call') {
            myMatch['manager._id'] = {
                "$in": [mongoose.Types.ObjectId(req.userId)]
            }
        }
        if (options.dates !== null || options.dates !== 'all') {
            let now = moment().startOf('day').format()
            let today, week, weekAgo, month, monthAgo, year, yearAgo, startOfMonth
            now = new Date(now)

            switch (options.dates) {
                case 'today':
                    today = moment().startOf('day').format();
                    today = new Date(today)

                    myMatch['createdAt'] = {
                        "$lt": now,
                        "$gt": today
                    }
                    break;
                case 'week':
                    week = moment().endOf('day').add(8, 'day').format();
                    weekAgo = moment().subtract(7, 'day').add(1, 'day').format();
                    week = new Date(week)
                    weekAgo = new Date(weekAgo)

                    myMatch['createdAt'] = {
                        "$lt": week,
                        "$gt": weekAgo
                    }
                    break;
                case 'month':
                    month = moment().endOf('day').format()
                    monthAgo = moment().subtract(1, 'month').add(1, 'day').format()
                    month = new Date(month)
                    monthAgo = new Date(monthAgo)

                    myMatch['createdAt'] = {
                        "$lt": month,
                        "$gt": monthAgo
                    }
                    break;
                case 'year':
                    year = moment().endOf('year').format();
                    yearAgo = moment().startOf('year').startOf('day').subtract(1, 'year').format();
                    year = new Date(year)
                    yearAgo = new Date(yearAgo)

                    myMatch['createdAt'] = {
                        "$lt": year,
                        "$gt": yearAgo
                    }
                    break;
                default:
                    break;
            }
        }

        myMatch = {
            ...myMatch,
            $or: [
                {
                    'deleted': {
                        $exists: false
                    }
                },
                {
                    'deleted': false
                }
            ]
        }

        if (options.startDate && new Date(options.startDate) instanceof Date) {
            let startDate = new Date(moment(options.startDate))
            let endDate = new Date(moment(options.endDate))

            myMatch['createdAt'] = {
                "$lt": endDate,
                "$gt": startDate
            }
        }

        const callbacks = await Callbacks.aggregate([{
            $facet: {
                results: [{
                        $lookup: {
                            from: 'clients',
                            localField: 'client',
                            foreignField: '_id',
                            as: 'client'
                        }
                    }, {
                        $lookup: {
                            from: 'users',
                            localField: 'manager',
                            foreignField: '_id',
                            as: 'manager'
                        }
                    }, {
                        $lookup: {
                            from: 'regions',
                            localField: 'region',
                            foreignField: '_id',
                            as: 'region'
                        }
                    },{
                        $lookup: {
                            from: 'orders',
                            localField: 'orderId',
                            foreignField: '_id',
                            as: 'order'
                        }
                    },{
                        $match: myMatch
                    }, {
                        $sort: {
                            createdAt: -1
                        }
                    }, {
                        $skip: page * 15
                    },
                    {
                        $limit: 15
                    },
                ],
                count: [{
                    $match: myMatch
                }, {
                    $group: {
                        _id: 0,
                        count: { $sum: 1 }
                    }
                }]
            }
        }])

        let result = {
            callbacks: callbacks ? callbacks[0].results : [],
            count: callbacks ? callbacks[0].count[0] ? callbacks[0].count[0].count : 0 : 0,
        }
        console.log("///////////////////////")
        console.log("Callbacks")
        console.log("///////////////////////")
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

exports.editCallbacks = async(req, res, next) => {
    try {
        const dataCallback = req.body
        console.log(dataCallback)
        const callbackId = dataCallback.callbackId
        let currentCallback = await Callbacks.findById(callbackId).lean()

        if (dataCallback.status === false || dataCallback.status === true)
            currentCallback.status = dataCallback.status

        if (dataCallback.manager) {
            currentCallback.manager = dataCallback.manager
        }

        if (dataCallback.orderNumber) {
            
            let order = await Orders.findOne({number: dataCallback.orderNumber})
            if (order){
                currentCallback.orderId = order._id
            }
        }

        if (dataCallback.comment) {
            currentCallback.comment = dataCallback.comment
        }

        await Callbacks.updateOne({
            _id: mongoose.Types.ObjectId(callbackId)
        }, currentCallback)

        currentCallback = await Callbacks.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(callbackId)
            }
        }, {
            $lookup: {
                from: 'clients',
                localField: 'client',
                foreignField: '_id',
                as: 'client'
            }
        }, {
            $lookup: {
                from: 'regions',
                localField: 'region',
                foreignField: '_id',
                as: 'region'
            }
        }])

        console.log("///////////////////////")
        console.log("Updated callback")
        let callback = currentCallback[0]
        if (dataCallback.manager) {
            let manager = await user.findById(dataCallback.manager)
            callback.manager = [manager]
        } else {
            let manager = await user.findById(callback.manager)
            callback.manager = [manager]
        }
        for (let i = 0; i < global.users.length; i++) {
            if (global.users[i].role === 'admin' || global.users[i].role === 'director' || global.users[i].role === 'call' || global.users[i].userId === callback.manager[0]._id.toString()) {
                console.log(`we sent it to ${global.users[i].role}`)
                global.io.to(global.users[i].userId).emit("CallBackUpdate", callback);
            }
        }

        res.status(201).json({
            message: "EDITED",
            callback: callback
        })
    } catch (error) {
        next(error)
    }
}

exports.receiveCallback = async(req, res, next) => {
    try {
        const callbackId = req.body.callbackId

        let callback = await Callbacks.findById(callbackId)
            .populate({
                path: 'manager',
                select: '_id name surname lastname'
            })
            .populate({
                path: 'client',
                select: 'phone name surname lastname'
            })
            .populate({
                path: 'region',
                select: '_id value title'
            }).lean()

        for (let i = 0; i < global.users.length; i++) {
            if (global.users[i].role === 'admin' || global.users[i].role === 'director' || global.users[i].role === 'call') {
                global.io.to(global.users[i].userId).emit("CallBacksChanges", callback);
            }
        }

        console.log("///////////////////////")
        console.log("Recieved Callback")
        console.log("///////////////////////")
        res.status(200).json({
            message: "OK"
        })
    } catch (error) {
        next(error)
    }
}

exports.uploadsCallbacksDocuments = async(req, res, next) => {
    try {
        let files = req.files.documents
        let callbackId = req.body.callbackId.replace(/"/g, '')
        if (files && files.length) {
            let documents = []
            await makeUserDir(CALLBACKS_PATH, `${callbackId}/`)
            let pathFile = path.join(CALLBACKS_PATH, `/${callbackId}`)

            let archive = archiver('zip');
            for (let i = 0; i < files.length; i++) {
                const doc = files[i];
                await uploadFilesFromTempToFolder(TEMP_PATH, CALLBACKS_PATH, doc.filename, `${callbackId}/`)
                archive.append(fs.createReadStream(path.join(CALLBACKS_PATH, `${callbackId}/${doc.filename}`)), { name: `${doc.originalname}` });
                documents.push(doc.filename)
            }



            let output = fs.createWriteStream(CALLBACKS_PATH + `/${callbackId}/${callbackId}.zip`);
            archive.pipe(output);
            archive.finalize();
            let zip = `${callbackId}.zip`
            let zipPath = `/uploads/callbacks/${callbackId}/`

            let callback = await Callbacks.updateOne({
                '_id': mongoose.Types.ObjectId(callbackId)
            }, {
                $set: {
                    'zip': zip,
                    'zipPath': zipPath,
                    'documents': documents
                }
            })
        }
        res.status(200).json({
            message: "OK"
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteCallback = async (req, res, next) => {
    try {
        let callbackId = req.body.callbackId

        await Callbacks.updateOne({_id: mongoose.Types.ObjectId(callbackId)}, {$set: {'deleted': true}})

        res.status(200).json({
            message: "OK"
        })
    } catch (error) {
        next(erorr)
    }
}