const mongoose = require('mongoose')
const Tasks = require('../models/tasks')
const Status = require('../models/status')
const User = require('../models/user')
const moment = require('moment')
const { TEMP_PATH, DOCUMENTS_PATH } = require('../utils/path')

const {
    uploadFilesFromTempToFolder,
    makeUserDir,
    removeUserDir,
    deleteUserUploadedFile,
} = require("../utils/fs");

const { count } = require('../models/tasks')

exports.getTasks = async (req, res, next) => {
    try {
        const page = +req.query.page - 1
        const options = req.body.options
        let myMatch = {}
        let mySort = {
            'results.creation_date': -1
        }

        // if (req.userRole !== 'director') {
        //     console.log(req.userId)
        //     myMatch['executors._id'] = {
        //         "$in": [mongoose.Types.ObjectId(req.userId)]
        //     }
        // }

        if (options.executor && options.executor !== "all") {
            myMatch['executor._id'] = {
                "$in": [mongoose.Types.ObjectId(options.executor)]
            }
        }

        if (options.initiator && options.initiator !== "all") {
            myMatch['initiator._id'] = {
                "$in": [mongoose.Types.ObjectId(options.initiator)]
            }
        }
        // if(req.userRole === 'director'){
        //     myMatch['initiator._id'] = {
        //         "$in": [mongoose.Types.ObjectId(req.userId)]
        //     }
        // }

        if (options.department !== "all" && options.department !== null) {
            myMatch['department.value'] = {
                "$in": [options.department]
            }
        }

        if (options.status !== "all" && options.status !== null) {
            myMatch['status.value'] = {
                "$in": [options.status]
            }
        }

        if (options.region !== "all" && options.region !== null) {
            myMatch['region.value'] = {
                "$in": [options.region]
            }
        }


        if (options.dates !== null || options.dates !== 'all') {
            let today = new Date()
            let left, right, y, m

            today.setUTCHours(0, 0, 0, 0)
            switch (options.dates) {
                case 'today':
                    left = new Date(today)
                    right = new Date(today)
                    right.setDate(today.getDate() + 1)

                    myMatch['results.creation_date'] = {
                        "$lt": right,
                        "$gt": left
                    }
                    break;
                case 'week':
                    right = new Date(today)
                    left = new Date(today)

                    left.setDate(left.getDate() - (left.getDay() + 6) % 7)
                    right.setDate(today.getDate() + 1)

                    myMatch['results.creation_date'] = {
                        "$lt": right,
                        "$gt": left
                    }
                    break;
                case 'month':
                    left = new Date(today)
                    right = new Date(today)
                    y = left.getFullYear(),
                        m = left.getMonth();

                    left = new Date(y, m, 1);

                    right.setDate(today.getDate() + 1)

                    myMatch['results.creation_date'] = {
                        "$lt": right,
                        "$gt": left
                    }
                    break;
                case 'year':
                    left = new Date(today)
                    right = new Date(today)
                    y = left.getFullYear(),

                        left = new Date(y, 0, 1);

                    right.setDate(today.getDate() + 1)

                    myMatch['results.creation_date'] = {
                        "$lt": right,
                        "$gt": left
                    }
                    break;
                default:
                    break;
            }
        }

        if (options.creation_date === -1) {
            mySort['results.creation_date'] = -1
            delete mySort['results.deadline_date']
        }
        if (options.creation_date === 1) {
            mySort['results.creation_date'] = 1
            delete mySort['results.deadline_date']
        }
        if (options.deadline_date === -1) {
            mySort['results.deadline_date'] = 1
            delete mySort['results.creation_date']
        }
        if (options.deadline_date === 1) {
            mySort['results.deadline_date'] = 1
            delete mySort['results.creation_date']
        }
        let tasksMatch = {
            $or: [
                {
                    $and: [
                        {
                            parent_id: {
                                $exists: false
                            }
                        },
                        {
                            executors: {
                                $in: [
                                    mongoose.Types.ObjectId(req.userId)
                                ]
                            }
                        }
                    ]
                },
                {
                    $and: [
                        {
                            parent_id: {
                                $exists: false
                            }
                        },
                        {
                            $or: [
                                {
                                    initiator: mongoose.Types.ObjectId(req.userId)
                                },
                                {
                                    responsible: mongoose.Types.ObjectId(req.userId)
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        if(req.userRole === 'superadmin' || req.userRole === 'director'){
            tasksMatch = {
                parent_id: {
                    $exists: false
                }
            }
        } else {
            myMatch = {
                ...myMatch,
                '$or': [
                    {
                        'initiator._id': mongoose.Types.ObjectId(req.userId)
                    },
                    {
                        'responsible._id': mongoose.Types.ObjectId(req.userId)
                    },
                    {
                        'executor._id': mongoose.Types.ObjectId(req.userId)
                    }
                ]
            }
    
            if (options.executor !== "" && options.executor !== null) {
                myMatch = {
                    ...myMatch,
                    "$or": [
                        {
                            'executor._id': mongoose.Types.ObjectId(options.executor)
                        },
                        {
                            'responsible._id': mongoose.Types.ObjectId(options.executor)
                        },
                    ]
                }
            }
        }

        const tasks = await Tasks.aggregate(
            [{
                $match: tasksMatch
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'responsible',
                    foreignField: '_id',
                    as: 'responsible'
                }
            }, {
                $unwind: {
                    path: '$responsible',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'initiator',
                    foreignField: '_id',
                    as: 'initiator'
                }
            }, {
                $unwind: {
                    path: '$initiator'
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'executors',
                    foreignField: '_id',
                    as: 'executor'
                }
            }, {
                $group: {
                    _id: '$_id',
                    tasks: {
                        $addToSet: '$$ROOT'
                    }
                }
            }, {
                $unwind: {
                    path: '$tasks'
                }
            }, {
                $replaceRoot: {
                    newRoot: '$tasks'
                }
            }, {
                $unwind: {
                    path: '$tasks.executor',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from: 'departments',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'department'
                }
            }, {
                $unwind: {
                    path: '$department',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status'
                }
            }, {
                $unwind: {
                    path: '$status'
                }
            }, {
                $lookup: {
                    from: 'regions',
                    localField: 'initiator.region',
                    foreignField: '_id',
                    as: 'region'
                }
            }, {
                $unwind: {
                    path: '$region'
                }
            }, {
                $facet: {
                    tasksList: [
                        { $match: myMatch }, {
                            $project: {
                                results: {
                                    _id: '$_id',
                                    title: '$title',
                                    description: '$description',
                                    creation_date: '$creation_date',
                                    deadline_date: '$deadline_date',
                                    executors: {
                                        $size: '$executors'
                                    },
                                    executor: {
                                        _id: '$executor._id',
                                        surname: '$executor.surname',
                                        name: '$executor.name',
                                        lastname: '$executor.lastname',
                                        department: '$department',
                                        region: '$region'
                                    },
                                    initiator: {
                                        _id: '$initiator._id',
                                        surname: '$initiator.surname',
                                        name: '$initiator.name',
                                        lastname: '$initiator.lastname',
                                        department: '$department',
                                        region: '$region'
                                    },
                                    responsible: {
                                        _id: '$responsible._id',
                                        surname: '$responsible.surname',
                                        name: '$responsible.name',
                                        lastname: '$responsible.lastname'
                                    },
                                    department: '$department',
                                    documents: '$documents',
                                    status: '$status',
                                    mark: '$mark',
                                    comment: '$comment',
                                    parent_id: '$parent_id',
                                    initiator_comment: '$initiator_comment',
                                }
                            }
                        }, {
                            $sort: mySort
                        }, {
                            $skip: page * 15
                        }, {
                            $limit: 15
                        }, {
                            $group: {
                                _id: 0,
                                tasks: {
                                    $push: '$results'
                                }
                            }
                        }
                    ],
                    count: [
                        {
                            $match: myMatch
                        },
                        {
                            $project: {
                                count: {
                                    $sum: 1
                                }
                            }
                        }
                    ]
                }
            }, {
                $replaceRoot: {
                    newRoot: {
                        tasks: '$tasksList.tasks',
                        count: {
                            $sum: '$count.count'
                        }
                    }
                }
            }]
        )

        let result = {
            tasks: tasks && tasks[0] && tasks[0].tasks[0] ? tasks[0].tasks[0] : [],
            count: tasks && tasks[0] ? tasks[0].count : 0
        }

        console.log("///////////////////////")
        console.log("Tasks")
        // console.log(result)
        console.log("///////////////////////")
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

let project = {
    _id: '$_id',
    title: '$title',
    description: '$description',
    creation_date: '$creation_date',
    deadline_date: '$deadline_date',
    executor: {
        _id: "$executors._id",
        surname: "$executors.surname",
        name: "$executors.name",
        lastname: "$executors.lastname",
        department: '$department'
    },
    initiator: {
        _id: "$initiator._id",
        surname: "$initiator.surname",
        name: "$initiator.name",
        lastname: "$initiator.lastname",
        region: {
            _id: "$initiator.region._id",
            title: "$initiator.region.title",
            value: "$initiator.region.value"
        }
    },
    responsible: {
        _id:  "$responsible._id",
        surname: "$responsible.surname",
        name: "$responsible.name",
        lastname: "$responsible.lastname",
    },
    documents: '$documents',
    status: { $first: '$status'},
    mark: '$mark',
    comment: '$comment',
    initiator_comment: '$initiator_comment'
}

const myAggregation = (skip, limit, region) =>{
    let match = {}
    if (region && region !== "all") {
        match['initiator.region.value'] = {
            "$in": [region]
        }
    }
    return new mongoose.Aggregate()
        .sort({createdAt: -1})
        .lookup({
            from: 'users',
            localField: 'responsible',
            foreignField: '_id',
            as: 'responsible'
        })
        .unwind({path: "$responsible", preserveNullAndEmptyArrays: true})
        .lookup({
            from: 'users',
            localField: 'initiator',
            foreignField: '_id',
            as: 'initiator'
        })
        .unwind({path: "$initiator",  preserveNullAndEmptyArrays: true})
        .lookup({
            from: 'regions',
            localField: 'initiator.region.value',
            foreignField: 'value',
            as: 'region'
        })
        //.unwind("region")
        .lookup({
            from: 'users',
            localField: 'executors',
            foreignField: '_id',
            as: 'executors'
        })
        // .unwind({path: "$executors",  preserveNullAndEmptyArrays: true})
        .lookup({
            from: 'regions',
            localField: 'initiator.region',
            foreignField: '_id',
            as: 'initiator.region'
        })
        .unwind({path:"$initiator.region",  preserveNullAndEmptyArrays: true})
        .lookup({
            from: 'departments',
            localField: 'executors.department',
            foreignField: '_id',
            as: 'department'
        })
        .lookup({
            from: 'status',
            localField: 'status',
            foreignField: '_id',
            as: 'status'
        })
        //.unwind("department")
        .project(project)
        .match(match)
        .skip(skip)
        .limit(limit)
        .pipeline()
}

exports.getTasksForDesktop = async (req, res, next) => {
    try {
        const options = req.body.options
        options.limit = options.limit ? Number.parseInt(options.limit) : 15
        options.skip = options.skip ? Number.parseInt(options.skip) : 0
        const match = {
            parent_id: { $exists: false },
            status: {
                $in: []
            }
        }
        if (options.executor && options.executor !== "all") {
            match['executors'] = {
                "$in": [mongoose.Types.ObjectId(options.executor)]
            }
        }
        if (options.initiator && options.initiator !== "all") {
            match['initiator'] = {
                "$in": [mongoose.Types.ObjectId(options.initiator)]
            }
        }
        
        let assigned = {count: 0}
        let accepted = {count: 0}
        let tested = {count: 0}
        let completed = {count: 0}
        if (options.status.includes('assigned')){
            match.status.$in = [mongoose.Types.ObjectId('601bad4735e4052ee544d788'), mongoose.Types.ObjectId('601bad7c35e4052ee544d78a'), mongoose.Types.ObjectId('601bad9e35e4052ee544d78b')]
            assigned.count = await Tasks.find(match).countDocuments()
            assigned.tasks = await Tasks.aggregate()
                .match(match)
                .append(myAggregation(options.skip, options.limit, options.region))
        }
        if (options.status.includes('accepted')){
            match.status.$in = [mongoose.Types.ObjectId('601bad6935e4052ee544d789')]
            accepted.count = await Tasks.find(match).countDocuments()
            accepted.tasks = await Tasks.aggregate()
                .match(match)
                .append(myAggregation(options.skip, options.limit, options.region))
        }
        if (options.status.includes('tested')){
            match.status.$in = [mongoose.Types.ObjectId('5f7f30d450523015fc320056')]
            tested.count = await Tasks.find(match).countDocuments()
            tested.tasks = await Tasks.aggregate()
                .match(match)
                .append(myAggregation(options.skip, options.limit, options.region))
        }
        if (options.status.includes('completed')){
            match.status.$in = [mongoose.Types.ObjectId('5f7afd46701805712f1a8e27')]
            completed.count = await Tasks.find(match).countDocuments()
            completed.tasks = await Tasks.aggregate()
                .match(match)
                .append(myAggregation(options.skip, options.limit, options.region))
        }
        let results = {
            assigned,
            accepted,
            tested,
            completed
        }
        res.send(results)
    } catch (error) {
        next(error)
    }

}

exports.getSubTasks = async (req, res, next) => {
    try {
        const { page, taskId } = req.body
        let tasks = await Tasks.aggregate(
            [{
                $match: {
                    'parent_id': mongoose.Types.ObjectId(taskId)
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'responsible',
                    foreignField: '_id',
                    as: 'responsible'
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'initiator',
                    foreignField: '_id',
                    as: 'initiator'
                }
            }, {
                $unwind: {
                    path: '$initiator'
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'executors',
                    foreignField: '_id',
                    as: 'executors'
                }
            }, {
                $unwind: {
                    path: '$executors'
                }
            }, {
                $lookup: {
                    from: 'departments',
                    localField: 'executors.department',
                    foreignField: '_id',
                    as: 'department'
                }
            }, {
                $unwind: {
                    path: '$department'
                }
            }, {
                $lookup: {
                    from: 'regions',
                    localField: 'executors.region',
                    foreignField: '_id',
                    as: 'region'
                }
            }, {
                $unwind: {
                    path: '$region'
                }
            }, {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status'
                }
            }, {
                $unwind: {
                    path: '$status'
                }
            }, {
                $project: {
                    results: {
                        _id: '$_id',
                        title: '$title',
                        description: '$description',
                        creation_date: '$creation_date',
                        deadline_date: '$deadline_date',
                        executor: {
                            _id: "$executors._id",
                            surname: "$executors.surname",
                            name: "$executors.name",
                            lastname: "$executors.lastname",
                            department: '$department',
                            region: '$region'
                        },
                        initiator: {
                            _id: "$initiator._id",
                            surname: "$initiator.surname",
                            name: "$initiator.name",
                            lastname: "$initiator.lastname",
                        },
                        responsible: {
                            _id: "$responsible._id",
                            surname: "$responsible.surname",
                            name: "$responsible.name",
                            lastname: "$responsible.lastname",
                        },
                        documents: '$documents',
                        status: '$status',
                        mark: '$mark',
                        comment: '$comment',
                        initiator_comment: '$initiator_comment'
                    }
                }
            }, {
                $group: {
                    _id: 0,
                    tasks: {
                        $push: '$results'
                    },
                    count: {
                        $sum: 1
                    }
                }
            }]
        )

        let result = {
            tasks: tasks && tasks[0] ? tasks[0].tasks : [],
            count: tasks && tasks[0] ? tasks[0].count : 0
        }

        console.log("///////////////////////")
        console.log("Tasks")
        console.log("///////////////////////")
        res.status(201).json(result)

    } catch (error) {
        next(error)
    }
}

exports.getTasksCount = async (req, res, next) => {
    try {
        const count = await Tasks.aggregate([{
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
            $project: {
                _id: "$_id",
                status: "$status",
            }
        }, {
            $match: {
                $or: [{
                    "status.value": "moderate"
                }, {
                    "status.value": "process"
                }]
            }
        },
        {
            $count: "count"
        },
        ])
        console.log("///////////////////////")
        console.log("Count of tasks")
        console.log("///////////////////////")
        res.status(204).json(count)
    } catch (error) {
        next(error)
    }
}

exports.addTask = async (req, res, next) => {
    try {
        const dataTask = req.body
        const executors = JSON.parse(dataTask.executors)
        const documents = req.files.documents
        let users = []
        console.log(documents)
        let taskId = mongoose.Types.ObjectId()
        let task = {
            _id: taskId,
            title: dataTask.title,
            description: dataTask.description,
            deadline_date: dataTask.deadline_date,
            initiator: mongoose.Types.ObjectId(req.userId),
            initiator_comment: dataTask.initiator_comment
        }

        if (documents && documents.length) {
            await makeUserDir(DOCUMENTS_PATH, taskId);
            task.documents = [];
            for (let i = 0; i < documents.length; i++) {
                await uploadFilesFromTempToFolder(
                    TEMP_PATH,
                    DOCUMENTS_PATH,
                    documents[i].filename,
                    taskId
                );
                task.documents.push({
                    url: `/uploads/documents/tasks/${taskId}/${documents[i].filename}`,
                    filename: documents[i].originalname
                })
            }
        }

        if (dataTask.department) {
            task.responsible = mongoose.Types.ObjectId(executors[0]._id)
            task.department = mongoose.Types.ObjectId(dataTask.department)
            users = await User.find({ department: dataTask.department, _id: { $nin: [executors[0]._id, req.userId] } }).select('_id').lean()
        } else {
            users = executors.map((ex) => mongoose.Types.ObjectId(ex._id))
        }

        task.executors = users
        let authorTask = await Tasks.create(task)
        authorTask.save()
        delete task.department
        delete task.status
        for (let i = 0; i < users.length; i++) {
            const u = users[i];
            let userTask = task

            userTask._id = mongoose.Types.ObjectId()
            userTask.executors = [u._id]

            userTask.parent_id = taskId

            let dbUserTask = await Tasks.create(userTask)
            dbUserTask.save().then((data) => {

            }).catch((error) => {
                console.log(error)
            })

            let updatedUser = await User.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(u._id) },
                {
                    $push: {
                        tasks: mongoose.Types.ObjectId(dbUserTask._id)
                    }
                }
            )
        }

        let addedTask = await Tasks.findById(taskId)
        .populate({path: 'executors', select: '_id name surname lastname'})
        .populate({path: 'initiator', select: '_id name surname lastname'})
        .populate({path: 'responsible', select: '_id name surname lastname'})
        .populate({path: 'status'})
        .lean()

        if(!!addedTask.parent_id || addedTask.executors.length === 1){
            let user = await User.findById(addedTask.executors[0]._id).select('_id name surname lastname')
            addedTask.executor = user
        }

        let result = {
            task: addedTask
        }
        res.status(201).json({
            message: "ADDED",
            task: result.task
        })
        res.status(201)
    } catch (error) {
        next(error)
    }
}

exports.editTask = async (req, res, next) => {
    try {

        const taskId = req.body.taskId
        const documents = req.files.documents
        let currentTask = await Tasks.findOne({
            _id: mongoose.Types.ObjectId(taskId)
        })
        const dataTask = req.body
        if (documents && documents.length) {
            dataTask.documents = currentTask.documents
            await makeUserDir(DOCUMENTS_PATH, taskId);
            if (!dataTask.documents.length) {
                dataTask.documents = [];
            }
            for (let i = 0; i < documents.length; i++) {
                await uploadFilesFromTempToFolder(
                    TEMP_PATH,
                    DOCUMENTS_PATH,
                    documents[i].filename,
                    taskId
                );
                dataTask.documents.push({
                    url: `/uploads/documents/tasks/${taskId}/${documents[i].filename}`,
                    filename: documents[i].originalname
                })
            }
        }
        currentTask.initiator_comment = dataTask.initiator_comment
        currentTask.comment = dataTask.comment
        const updateTask = await currentTask.updateOne(dataTask)

        const task = await Tasks.findById(taskId)
        .populate({path: 'executors', select: '_id name surname lastname'})
        .populate({path: 'initiator', select: '_id name surname lastname'})
        .populate({path: 'responsible', select: '_id name surname lastname'})
        .populate({path: 'status'})
        .lean()

        if(!!task.parent_id){
            console.log('ASDASDSD')
            let user = await User.findById(task.executors[0]._id).select('_id name surname lastname')
            console.log(user)
            task.executor = user
        }
        console.log("///////////////////////")
        console.log("Updated Task")
        console.log("///////////////////////")
        res.status(201).json({
            message: "EDITED",
            task: task
        })
    } catch (error) {
        next(error)
    }
}

exports.editTaskStatus = async (req, res, next) => {
    try {
        console.log(req.body)
        const taskId = req.body.taskId
        const documents = req.files.documents
        const statusValue = req.body.statusValue
        const comment = req.body.comment
        const currentTask = await Tasks.findOne({ _id: mongoose.Types.ObjectId(taskId) })
        if(statusValue !== 'assigned'){
            if (documents && documents.length) {
                await makeUserDir(DOCUMENTS_PATH, taskId);
                if (!currentTask.documents.length) {
                    currentTask.documents = [];
                }
                for (let i = 0; i < documents.length; i++) {
                    await uploadFilesFromTempToFolder(
                        TEMP_PATH,
                        DOCUMENTS_PATH,
                        documents[i].filename,
                        taskId
                    );
                    currentTask.documents.push({
                        url: `/uploads/documents/tasks/${taskId}/${documents[i].filename}`,
                        filename: documents[i].originalname
                    })
                }
            }
        }
        const status = await Status.findOne({ value: statusValue }).lean()
        if (status && status.value === 'completed') {
            const updatedUser = await User.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(currentTask.executor)
            }, {
                $pull: {
                    'tasks': mongoose.Types.ObjectId(currentTask._id)
                }
            })
        }
        const updateTask = await currentTask.updateOne({ status: status._id, documents: currentTask.documents, comment: comment })
        const task = await Tasks.findById(taskId)
        .populate({path: 'executors', select: '_id name surname lastname'})
        .populate({path: 'initiator', select: '_id name surname lastname'})
        .populate({path: 'responsible', select: '_id name surname lastname'})
        .populate({path: 'status'})
        .lean()
        console.log("///////////////////////")
        console.log("Updated Task")
        console.log("///////////////////////")
        res.status(201).json({
            message: "EDITED STATUS",
            status: status,
            task: task
        })
    } catch (error) {
        next(error)
    }
}


exports.deleteTask = async (req, res, next) => {
    try {
        const taskId =  Array.isArray(req.body.taskId) ? req.body.taskId : [ req.body.taskId ]
        for (t of taskId){
            let deletedTasksArray = []
            const deletedTask = await Tasks.findOne({
                _id: mongoose.Types.ObjectId(t)
            })
            deletedTasksArray.push(deletedTask._id)
            if (!deletedTask.parent_id) {
                let deletedSubTasks = await Tasks.find({ parent_id: deletedTask._id }).select('_id').lean()

                for (ds of deletedSubTasks) {
                    deletedTasksArray.push(ds._id)
                }
            }

            for (ds of deletedTasksArray) {
                await removeUserDir(DOCUMENTS_PATH, ds)
                const updatedUser = await User.findOneAndUpdate({
                    tasks: mongoose.Types.ObjectId(ds)
                }, {
                    $pull: {
                        'tasks': mongoose.Types.ObjectId(ds)
                    }
                })
            }
            await Tasks.deleteMany({
                _id: {
                    $in: deletedTasksArray
                }
            })
        }
        

        console.log("///////////////////////")
        console.log("Deleted Task")
        console.log("///////////////////////")
        res.status(201).json({
            message: "DELETED"
        })
    } catch (error) {
        next(error)
    }
}

exports.getExcelFromTasks = async (req, res, next) => {
    try {
        let tasks = await Tasks.find()
        .populate('status')
        .populate({path: 'initiator', select: '_id name surname lastname'})
        .populate({path: 'executor', select: '_id name surname lastname'})

        if(tasks && tasks.length){
            let globalStyle = {
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                },
            }

            ws.cell(1, 1)
            .string('Название')
            .style(globalStyle)
            ws.cell(1, 2)
            .string('Описание')
            .style(globalStyle)
            ws.cell(1, 3)
            .string('Автор')
            .style(globalStyle)
            ws.cell(1, 4)
            .string('Исполнитель')
            .style(globalStyle)
            ws.cell(1, 5)
            .string('Дата создания')
            .style(globalStyle)
            ws.cell(1, 6)
            .string('Дедлайн')
            .style(globalStyle)
            ws.cell(1, 7)
            .string('Статус')
            .style(globalStyle)
            ws.cell(1, 8)
            .string('Комментарий')
            .style(globalStyle)
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                if(task.title !== null && task.title !== 'null' && task.title !== undefined){
                    ws.cell(i + 2, 1)
                    .string(task.title)
                    .style(globalStyle)
                }
                if(task.description !== null && task.description !== 'null' && task.description !== undefined){
                    ws.cell(i + 2, 2)
                    .string(task.description)
                    .style(globalStyle)
                }
                if(task.initiator !== null && task.initiator !== 'null' && task.initiator !== undefined){
                    ws.cell(i + 2, 3)
                    .string(task.initiator.surname + " " + task.initiator.name + " " + task.initiator.lastname ? task.initiator.lastname : '')
                    .style(globalStyle)
                }
                if(task.executor !== null && task.executor !== 'null' && task.executor !== undefined){
                    ws.cell(i + 2, 4)
                    .string(task.executor.surname + " " + task.executor.name + " " + task.executor.lastname ? task.executor.lastname : '')
                    .style(globalStyle)
                }
                if(task.creation_date !== null && task.creation_date !== 'null' && task.creation_date !== undefined){
                    ws.cell(i + 2, 5)
                    .string(moment(task.creation_date).format('DD.MM.YYYY'))
                    .style(globalStyle)
                }
                if(task.deadline_date !== null && task.deadline_date !== 'null' && task.deadline_date !== undefined){
                    ws.cell(i + 2, 6)
                    .string(moment(task.deadline_date).format('DD.MM.YYYY'))
                    .style(globalStyle)
                }
                if(task.status !== null && task.status !== 'null' && task.status !== undefined){
                    ws.cell(i + 2, 6)
                    .string(task.status.title)
                    .style(globalStyle)
                }
                if(task.comment !== null && task.comment !== 'null' && task.comment !== undefined){
                    ws.cell(i + 2, 8)
                    .string(task.comment)
                    .style(globalStyle)
                } else {
                    ws.cell(i + 2, 8)
                    .string('')
                    .style(globalStyle) 
                }
            }
            ws.column(1).setWidth(50);
            ws.column(2).setWidth(50);
            ws.column(3).setWidth(20);
            ws.column(4).setWidth(20);
            ws.column(5).setWidth(20);
            ws.column(5).setWidth(20);
            ws.column(7).setWidth(50);
        }

    wb.write(`${tasks}.xlsx`)
    } catch (error) {
        console.log(error)
    }
}