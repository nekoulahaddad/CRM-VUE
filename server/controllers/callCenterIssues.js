const mongoose = require('mongoose')
const { findById } = require('../models/callCenterIssues')
const CallCenterIssues = require('../models/callCenterIssues')
const Regions = require('../models/regions')
const _ = require('lodash')
const moment = require('moment')

exports.getCallIssues = async (req, res, next) => {
  try {
    const page = +req.query.page - 1
    const { status, region, executor, initiator, dates } = req.body.options
    const myMatch = {}
    
    if(req.userRole === 'seo' || req.userRole === 'worker' || req.userRole === 'content' || req.userRole === 'buyer'){
      return res.status(200).json({ callCenterIssues: [], count: 0 })
    }
    if(req.userRole === 'call'){
      myMatch['issuedBy._id'] = {
        "$in": [mongoose.Types.ObjectId(req.userId)]
      }
    }
    if(req.userRole === 'manager'){
      myMatch['issuedTo._id'] = {
        "$in": [mongoose.Types.ObjectId(req.userId)]
      }
    }
    if (region !== "all" && region !== null) {
      myMatch['region.value'] = {
          "$in": [region]
      }
    }
    if (status && status !== 'all') {
      myMatch['status'] = {
        "$eq": status
      }
    }
    if (executor !== "" && executor !== null && executor !== 'all') {
      myMatch['issuedTo._id'] = {
        "$in": [mongoose.Types.ObjectId(executor)]
      }
    }
    if (initiator !== "" && initiator !== null && initiator !== 'all') {
      myMatch['issuedBy._id'] = {
          "$in": [mongoose.Types.ObjectId(initiator)]
      }
    }
    if (dates !== null || dates !== 'all') {
      let now = moment().startOf('day').format()
      let today, week, weekAgo, month, monthAgo, year, yearAgo, startOfMonth
      now = new Date(now)

      switch (dates) {
          case 'today':
              today = moment().startOf('day').format();
              today = new Date(today)

              myMatch['createdAt'] = {
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
    const dataAggregate = await CallCenterIssues.aggregate([
      {
        $lookup: {
            from: "regions",
            localField: "region",
            foreignField: "_id",
            as: "region"
        }
      },
      {
          $unwind: {
              path: "$region",
          },
      },
      {
        $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "regions.category._id",
            as: "category"
        }
      },
      {
        $unwind: {
            path: "$category",
        },
      },
      {
        $lookup: {
            from: "users",
            localField: "issuedBy",
            foreignField: "_id",
            as: "issuedBy"
        }
      },
      {
        $unwind: {
            path: "$issuedBy",
        },
      },
      {
        $lookup: {
            from: "users",
            localField: "issuedTo",
            foreignField: "_id",
            as: "issuedTo"
        }
      },
      {
        $unwind: {
            path: "$issuedTo",
        },
      },
      {
        $project: {
            _id: '$_id',
            status: '$status',
            client: {
              name: '$firstname',
              surname: '$lastname',
              lastname: '$middlename',
            },
            phone: '$phone',
            orderNumber: '$orderNumber',
            number: '$number',
            comment: '$comment',
            message: '$message',
            createdAt: '$createdAt',
            confirmedAt: '$confirmedAt',
            region: '$region',
            issuedBy: {
              _id: '$issuedBy._id',
              name: '$issuedBy.name',
              surname: '$issuedBy.surname',
              lastname: '$issuedBy.lastname',
            },
            issuedTo: {
              _id: '$issuedTo._id',
              name: '$issuedTo.name',
              surname: '$issuedTo.surname',
              lastname: '$issuedTo.lastname',
            },
            category: {
              $filter: 
                {
                  input: '$category.regions',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.region', '$region._id']
                  }

                },
            },
            
        }
      },
      {
        $unwind: {
            path: "$category",
        },
      },
    ])
      .match(myMatch)
      .sort({createdAt: -1})
      .facet({
        elements: new mongoose.Aggregate()
          .skip(15 * page)
          .limit(15)
          .pipeline(),
        count: new mongoose.Aggregate().count('count').pipeline(),
      })

    const count = dataAggregate[0].count.length ? dataAggregate[0].count[0].count : 0
    const callCenterIssues = dataAggregate[0].elements
    
    res.status(200).json({ callCenterIssues, count })
  } catch (error) {
    next(error)
  }
}

exports.getCallIssuesByName = async (req, res, next) => {
  try {
    const title = req.body.title
    console.log('debug - getCallCenterIssueByName', title)

    const providers = await Provider.aggregate([
      {
        $addFields: {
          providers: {
            $regexMatch: {
              input: '$name',
              regex: new RegExp('(w|s){0,}' + _.escape(title) + '(w|s){0,}', 'ui'),
            },
          },
        },
      },
      {
        $match: { providers: true },
      },
    ])

    console.log('///////////////////////')
    res.status(200).json({ provider: providers[0] })
  } catch (error) {
    next(error)
  }
}

exports.addCallIssue = async (req, res, next) => {

  try {
    let count = 0
    await CallCenterIssues.countDocuments({}, function(err, docCount) {
      if (err) { return handleError(err) }
      count = docCount += 1
    })

    let reqData = {
      ...req.body.callissue,
      number: count
    }
    
    const newRecord = await CallCenterIssues.create(reqData)
    await newRecord.save()
    res.status(201).json({
      message: 'ADDED',
      data: newRecord,
    })
  } catch (error) {
    next(error)
  }
}

exports.editCallIssue = async (req, res, next) => {
  try {
    const dataId = req.body.dataId
    const requestData = req.body.callissue
    let orderExists = await CallCenterIssues.find({orderNumber: requestData.orderNumber})
    
    if(orderExists.length < 1 || (orderExists && orderExists[0]._id == dataId) || requestData.confirmedAt){
      const updateModel = await CallCenterIssues.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(dataId),
        },
        {
          ...requestData,
        }
      )
      res.status(201).json({ message: 'EDITED', data: { 
          ...updateModel, 
          category: requestData.category, 
          region: requestData.region,
          issuedBy: requestData.issuedBy,
          issuedTo: requestData.issuedTo,
        } 
      })
    }else{
      return res.status(200).json({ message: 'ORDEREXISTS'})
    }
  } catch (error) {
    next(error)
  }
}

exports.deleteCallIssue = async (req, res, next) => {
  try {
    const deletedRecord = await CallCenterIssues.findOneAndDelete({ _id: req.body.id }).lean()
    res.status(201).json({
      message: 'DELETED',
      data: deletedRecord,
    })
  } catch (error) {
    next(error)
  }
}
