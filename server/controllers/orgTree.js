const mongoose = require('mongoose')
const orgTree = require('../models/orgTree')
const Regions = require('../models/regions')
const _ = require('lodash')
const moment = require('moment')

exports.getAll = async (req, res, next) => {
  try {
    const data = await orgTree.find()
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

exports.getFirst = async (req, res, next) => {
  try {
    const data = await orgTree.find()
    res.status(200).json(data[0])
  } catch (error) {
    next(error)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const id = req.body.id
    const data = await orgTree.find({_id: id})
    res.status(200).json({ data: data[0] })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    let reqData = {
      ...req.body.data
    }
    // let newRecord;
    // if(reqData.parentId){
    //   console.log('Parrent_ID',reqData.parentId)
    //   const record = await orgTree.find({departmentId: reqData.parentId})
    //   console.log("RECCCC", record);
    //   record[0].children.push({
    //     ...reqData,
    //     children: [],
    //     directors: [],
    //     employees: []
    //   })
    //   console.log('Parrent_ID_RESULT',record)
    //   console.log('REC_ID', record[0])
    //   newRecord = await orgTree.findOneAndUpdate(
    //     {
    //       departmentId: reqData.parentId
    //     },
    //     {
    //       children: record[0].children
    //     }
        
    //   )
    //   console.log('Parrent_UPDATED_RESULT',newRecord)
    // }else{
    //   newRecord = await orgTree.create(reqData)
    //   await newRecord.save()
    // }
    const newRecord = await orgTree.create({
      dataTree: reqData
    })
      await newRecord.save()
    res.status(201).json({
      message: 'ADDED',
      data: newRecord,
    })
  } catch (error) {
    next(error)
  }
}

exports.createDirector = async (req, res, next) => {
  try {
    let reqData = {
      ...req.body.data
    }
    const newRecord = await orgTree.findOneAndUpdate(
      {
        departmentId: mongoose.Types.ObjectId(reqData.departmentId),
        parentId: mongoose.Types.ObjectId(reqData.parentId),
      },
      {
        ...reqData,
      }
    )
    res.status(201).json({
      message: 'ADDED_DIRECTOR',
      data: newRecord,
    })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const dataId = req.body.dataId
    const requestData = req.body.data
    const updateModel = await orgTree.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(dataId),
      },
      {
        dataTree: requestData,
      }
    )
    res.status(201).json({ message: 'EDITED', data: updateModel })
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const deletedRecord = await orgTree.findOneAndDelete({ _id: req.body.id }).lean()
    res.status(201).json({
      message: 'DELETED',
      data: deletedRecord,
    })
  } catch (error) {
    next(error)
  }
}

exports.deleteDirector = async (req, res, next) => {
  try {
    const deletedRecord = await orgTree.findOneAndDelete({ _id: req.body.id }).lean()
    res.status(201).json({
      message: 'DELETED_DIRECTOR',
      data: deletedRecord,
    })
  } catch (error) {
    next(error)
  }
}