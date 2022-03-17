const mongoose = require('mongoose')
const Reports = require('../models/reports')
const Tasks = require('../models/tasks')
const User = require('../models/user')
const moment = require('moment')

exports.getReports = async(req, res, next) => {
    try {
        const page = +req.query.page - 1
        const options = req.body.options
        const myMatch = {}

        if (options.department !== "all" && options.department !== null) {
            myMatch['executor.department.value'] = {
                "$in": [options.department]
            }
        }
        if (options.region !== "all" && options.region !== null) {
            myMatch['executor.region.value'] = {
                "$in": [options.region]
            }
        }
        if (options.executor !== "all" && options.executor !== null) {
            myMatch['executor._id'] = {
                "$in": [mongoose.Types.ObjectId(options.executor)]
            }
        }

        if (options.dates !== null && options.dates !== 'all') {
            let now = moment().startOf('day').format()
            let today, week, weekAgo, month, monthAgo, year, yearAgo, startOfMonth
            now = new Date(now)

            console.log(now)

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

        const reports = await Reports.aggregate(
            [{
                $lookup: {
                    from: "tasks",
                    localField: "task",
                    foreignField: "_id",
                    as: "task"
                }
            }, {
                $unwind: {
                    path: "$task"
                }
            }, {
                $replaceRoot: {
                    newRoot: '$task'
                }
            }, {
                $lookup: {
                    from: "status",
                    localField: "status",
                    foreignField: "_id",
                    as: "status"
                }
            }, {
                $unwind: {
                    path: "$status"
                }
            }, {
                $lookup: {
                    from: "users",
                    localField: "initiator",
                    foreignField: "_id",
                    as: "initiator"
                }
            }, {
                $unwind: {
                    path: "$initiator"
                }
            }, {
                $unwind: {
                    path: "$executors",
                }
            }, {
                $lookup: {
                    from: "users",
                    localField: "executors",
                    foreignField: "_id",
                    as: "executor"
                }
            }, {
                $unwind: {
                    path: "$executor",
                }
            }, {
                $lookup: {
                    from: "regions",
                    localField: "executor.region",
                    foreignField: "_id",
                    as: "executor.region"
                }
            }, {
                $unwind: {
                    path: "$executor.region",
                }
            }, {
                $lookup: {
                    from: "departments",
                    localField: "executor.department",
                    foreignField: "_id",
                    as: "executor.department"
                }
            }, {
                $unwind: {
                    path: "$executor.department",
                }
            }, {
                $project: {
                    _id: "$_id",
                    number: "$number",
                    title: "$title",
                    description: "$description",
                    status: "$status",
                    executor: {
                        _id: "$executor._id",
                        surname: "$executor.surname",
                        name: "$executor.name",
                        lastname: "$executor.lastname",
                        department: "$executor.department",
                        region: {
                            _id: "$executor.region._id",
                            title: "$executor.region.title",
                            value: "$executor.region.value",
                        }
                    },
                    initiator: {
                        _id: "$initiator._id",
                        surname: "$initiator.surname",
                        name: "$initiator.name",
                        lastname: "$initiator.lastname",
                        department: "$initiator.department"
                    },
                    documents: '$documents',
                    mark: "$mark",
                    created: "$creation_date",
                    closed: "$closed",
                    deadline: "$deadline_date",
                    comment: "$comment",
                    initiator_comment: "$initiator_comment",
                    createdAt: "$createdAt"
                }
            }, {
                $facet: {
                    results: [{
                            $match: myMatch
                        },
                        {
                            $skip: page * 15
                        },
                        {
                            $limit: 15
                        }, {
                            $project: {
                                _id: "$_id",
                                number: "$number",
                                title: "$title",
                                description: "$description",
                                status: "$status",
                                executor: {
                                    _id: "$executor._id",
                                    surname: "$executor.surname",
                                    name: "$executor.name",
                                    lastname: "$executor.lastname",
                                    department: "$executor.department",
                                    region: {
                                        _id: "$executor.region._id",
                                        title: "$executor.region.title",
                                        value: "$executor.region.value",
                                    }
                                },
                                initiator: {
                                    _id: "$initiator._id",
                                    surname: "$initiator.surname",
                                    name: "$initiator.name",
                                    lastname: "$initiator.lastname",
                                    department: "$initiator.department"
                                },
                                documents: '$documents',
                                mark: "$mark",
                                created: "$created",
                                closed: "$closed",
                                deadline: "$deadline",
                                comment: "$comment",
                                initiator_comment: "$initiator_comment",
                            }
                        }
                    ],
                    count: [{
                            $match: myMatch
                        },
                        {
                            $group: {
                                _id: 0,
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }]
        )
        let result = {
            reports: reports[0].results,
            count: reports[0].count && reports[0].count[0] ? reports[0].count[0].count : 0
        }
        console.log("///////////////////////")
        console.log("Reports")
        console.log(result)
        console.log("///////////////////////")
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

exports.addReport = async(req, res, next) => {
    try {
        console.log(req.body)
        const taskId = req.body.taskId
        const addedReport = {
            task: mongoose.Types.ObjectId(taskId)
        }
        const newReport = await Reports.create(addedReport)
        console.log("///////////////////////")
        console.log("New Report")
        console.log(newReport)
        console.log("///////////////////////")
        await newReport.save()
        res.status(201).json({ message: "ADDED" })
    } catch (error) {
        next(error)
    }
}

exports.editReport = async(req, res, next) => {
    try {
        const reportId = req.body.reportId
        const currentReport = await Reports.findById(reportId)
        const dataReport = req.body.region
        const updateReport = await currentReport.updateOne(dataReport)
        console.log("///////////////////////")
        console.log("Updated Report")
        console.log(updateReport)
        console.log("///////////////////////")
        res.status(204).json({ message: "EDITED" })
    } catch (error) {
        next(error)
    }
}

exports.deleteReport = async(req, res, next) => {
    try {
        const reportId = req.body.reportId
        const deletedReport = await Reports.deleteOne({ _id: reportId })
        console.log("///////////////////////")
        console.log("Deleted Report")
        console.log(deletedReport)
        console.log("///////////////////////")
        res.status(204).json({ message: "DELETED" })
    } catch (error) {
        next(error)
    }
}