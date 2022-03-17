const mongoose = require('mongoose')
const Vacancy = require('../models/vacancies')
const Region = require("../models/regions");
const Department = require("../models/departments");
const fs = require('fs')
const {
    uploadFilesFromTempToFolder,
    makeUserDir,
    removeUserDir,
    removeDir,
    deleteUserUploadedFile,
    copyFolderRecursively
} = require('../utils/fs')

const {EDUCATION_PATH, TEMP_PATH} = require('../utils/path')

exports.getVacancies = async (req, res, next) => {
    try {
        const data = req.body.options
        const page = (+req.query.page - 1) * 15
        let match = {}
        if (data.region && data.region !== 'all'){
            const region = await Region.findOne({
                value: data.region
            }).lean()
            match['region'] = mongoose.Types.ObjectId(region._id)
        }
        if (data.department && data.department !== 'all'){
            const department = await Department.findOne({
                value: data.department
            }).lean()
            match['department'] = mongoose.Types.ObjectId(department._id)
        }
        const vacancies = await Vacancy.find(match)
        .sort({_id : 1})
        .skip(page)
        .limit(15)
        .populate({
            path: 'department',
            select: '_id value title'
        })
        .populate({
            path: 'region',
            select: '_id value title'
        }).lean()
        const count = await Vacancy.countDocuments(match)
        res.status(201).json({
            vacancies: vacancies,
            count: count ? count : 0
        })
    } catch (error) {
        next(error)
    }
}

exports.addVacancy = async (req, res, next) => {
    try {
        console.log(req.body)
        const newVacancy = await Vacancy.create(req.body)
        console.log("///////////////////////")
        console.log("New Education")
        console.log(newVacancy)
        console.log("///////////////////////")
        await newVacancy.save()
        res.status(201).json({
            message: "ADDED",
            event: newVacancy
        })
    } catch (error) {
        next(error)
    }
}

exports.editVacancy = async (req, res, next) => {
    try {
        const vacancyData = req.body
        // const educationId = vacancyData.educationId
        const currentVacancy = await Vacancy.findById(vacancyData.educationId)

        // if (vacancyData.title && vacancyData.title !== null) {
        //     currentVacancy.title = vacancyData.title
        // }

        // if (vacancyData.role) {
        //     currentVacancy.role = vacancyData.role
        // }
        // if (vacancyData.link) {
        //     currentVacancy.link = vacancyData.link
        // }
        // if (vacancyData.region) {
        //     currentVacancy.region = vacancyData.region
        // }
        // if (vacancyData.department) {
        //     currentVacancy.department = vacancyData.department
            
        // }
        // if (vacancyData.description && vacancyData.description !== null) {
        //     currentVacancy.description = vacancyData.description
        // }

        const updateVacancy = await currentVacancy.updateOne(vacancyData)
        console.log("///////////////////////")
        console.log("Updated Vacancy")
        console.log(updateVacancy)
        console.log("///////////////////////")
        res.status(204).json({message: "EDITED"})
    } catch (error) {
        next(error)
    }
}


exports.deleteVacancy = async (req, res, next) => {
    try {
        const vacancyId = req.body.vacancyId
        const deletedVacancy = await Vacancy.findOneAndDelete({_id: vacancyId})
        console.log("///////////////////////")
        console.log("Deleted Vacancy")
        console.log(deletedVacancy)
        console.log("///////////////////////")
        res.status(201).json({
            message: "DELETED",
            education: deletedVacancy
        })
    } catch (error) {
        next(error)
    }
}