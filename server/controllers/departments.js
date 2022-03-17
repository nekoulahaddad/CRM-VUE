const mongoose = require('mongoose')
const Departments = require('../models/departments')
const User = require("../models/user");
const _ = require('lodash')
const { translit } = require('gost-transliteration')

exports.getDepartmentsAll = async(req, res, next) => {
    let departments = await Departments.find({}).lean()
    departments = departments && departments.length ? departments : []
    res.status(200).send(departments)
}

exports.getDepartments = async(req, res, next) => {
    try {
        const count = await Departments.countDocuments()
        const page = req.query.page ? +req.query.page - 1 : 0
        const skip = page ? page * 15 : 0
        let match = {}
        let userMatch = {}
        const search = req.query.search
        
        if (search){
            let searchParts = search.split(' ')
            let regexps = []
            for (let p of searchParts){
                regexps.push(new RegExp('(\w|\s){0,}' + _.escapeRegExp(p) + '(\w|\s){0,}', 'ui'))
            }
            let operator = regexps.length > 1 ? '$and' : '$or'
            userMatch = {
                    [operator]: [
                        {
                            name: {
                                $in: regexps 
                            }
                        },
                        {
                            surname: {
                                $in: regexps
                            }
                        }
                    ]
                }
            let users = await User.aggregate()
                .match(userMatch)
                .project({_id: "$_id"})
                .group({
                    _id: false,
                    ids: {
                        $push: "$_id"
                    }
                })
                .replaceRoot({ids: "$ids"})
            let userIds = users.length ? users[0].ids : []
            if (userIds.length){
                userIds.map(id => mongoose.Types.ObjectId(id))
                match.leader = {
                    $in: userIds
                }
            } else {
                match.title = {
                    $in: [new RegExp('(\w|\s){0,}' + _.escapeRegExp(search) + '(\w|\s){0,}', 'ui')]
                }
            }
        }
        
        let departments = await Departments.aggregate()
            .match(match)
            .lookup({
                from: "users",
                let: { "departmentId": "$_id"},
                pipeline: [
                    { $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$deleted", false] },
                                { $eq: ["$department", "$$departmentId"] }
                            ]
                        }
                    }}
                ],
                as: "users"
            })
            .lookup({
                from: "users",
                    localField: "leader",
                    foreignField: "_id",
                    as: "leaderObj"
            })
            .project({
                department: {
                    _id: "$_id",
                    title: "$title",
                    leader: { "$arrayElemAt": [ "$leaderObj", 0 ] },
                    value: "$value",
                    count: { $size: "$users"}
                }
            })
            .project({
                department: {
                    _id: "$department._id",
                    title: "$department.title",
                    leader: {
                        _id: "$department.leader._id",
                        role: "$department.leader.role",
                        name: "$department.leader.name",
                        surname: "$department.leader.surname",
                        lastname: "$department.leader.lastname",
                    },
                    value: "$department.value",
                    count: "$department.count"
                }
            })
            .sort({ "department.count" : -1})
            .skip(skip)
            .limit(20)
            .replaceRoot("$department")

        console.log("///////////////////////")
        console.log("Departmnets")
        console.log("///////////////////////")
        res.status(201).json({
            departments: departments,
            count: count
        })
    } catch (error) {
        next(error)
    }
}

exports.addDepartment = async (req, res, next) => {
    try {
        let data = req.body
        console.log(data)
        const dataDepartment = {
            title: data.title,
            leader: data.leader,
            value: translit(_.kebabCase(data.title)).replace(/'/g, '').toLowerCase()
        }
        console.log(dataDepartment)

        const newDepartment = await Departments.create(dataDepartment)
        console.log("///////////////////////")
        console.log("New Department")
        console.log(newDepartment)
        console.log("///////////////////////")
        await newDepartment.save()
		res.status(201).json({
            message: "ADDED",
            event: newDepartment
        })
	} catch (error) {
		next(error)
	}
}

exports.editDepartment = async (req, res, next) => {
    try {
        const data = req.body
        console.log("deps")
        console.log(req.body)
        const updateDepartment = await Departments.updateOne({
            _id: data.departmentId
        },
        {
            $set: {
                title: data.title,
                leader: data.leader,
                // value: translit(_.kebabCase(data.title)).replace(/'/g, '').toLowerCase()
            }
        }
        )
        console.log("///////////////////////")
        console.log("Updated Department")
        console.log(updateDepartment)
        console.log("///////////////////////")
		res.status(204).json({message: "EDITED"})
	} catch (error) {
		next(error)
	}
}

exports.deleteDepartment = async (req, res, next) => {
    try {
        const departmentId = req.body.departmentId
        const departmentUsers = await User.find({department: mongoose.Types.ObjectId(departmentId)}).lean()
        if (departmentUsers.length){
            return res.status(403).json({
                message: "Нельзя удалить отдел, в котором есть сотрудники!"
            })
        }
        const deletedDepartment = await Departments.findOneAndDelete({_id: departmentId})
        console.log("///////////////////////")
        console.log("Deleted Event")
        console.log(deletedDepartment)
        console.log("///////////////////////")
		res.status(200).json({
            message: "DELETED",
            event: deletedDepartment
        })
	} catch (error) {
		next(error)
	}
}