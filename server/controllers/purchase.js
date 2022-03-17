const mongoose = require('mongoose')
const Purchase = require('../models/purchase')
const _ = require('lodash')
const moment = require('moment')
const isAuth = require('../middleware/isAuth')

exports.getAll = async (req, res, next) => {
  try {
    const page = +req.query.page - 1
    const { status, region, executor, initiator, dates } = req.body.options
    const myMatch = {}
    if(req.userRole === 'seo' || req.userRole === 'worker' || req.userRole === 'content' || req.userRole === 'call'){
        return res.status(200).json({ dataList: [], count: 0 })
    }
    if(req.userRole === 'manager'){
        myMatch['initiator._id'] = {
            "$in": [mongoose.Types.ObjectId(req.userId)]
        }
    }
    if(req.userRole === 'buyer'){
        myMatch['executor._id'] = {
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
      myMatch['executor._id'] = {
        "$in": [mongoose.Types.ObjectId(executor)]
      }
    }
    if (initiator !== "" && initiator !== null && initiator !== 'all') {
      myMatch['initiator._id'] = {
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
    const dataAggregate = await Purchase.aggregate([
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
            localField: "initiator",
            foreignField: "_id",
            as: "initiator"
        }
      },
      {
        $unwind: {
            path: "$initiator",
        },
      },
      {
        $lookup: {
            from: "users",
            localField: "executor",
            foreignField: "_id",
            as: "executor"
        }
      },
      {
        $unwind: {
            path: "$executor",
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
            products: '$products',
            orderId: '$orderId',
            orderNumber: '$orderNumber',
            number: '$number',
            comment: '$comment',
            message: '$message',
            createdAt: '$createdAt',
            deliveryDate: '$deliveryDate',
            seenAt: '$seenAt',
            region: '$region',
            initiator: {
              _id: '$initiator._id',
              name: '$initiator.name',
              surname: '$initiator.surname',
              lastname: '$initiator.lastname',
            },
            executor: {
              _id: '$executor._id',
              name: '$executor.name',
              surname: '$executor.surname',
              lastname: '$executor.lastname',
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
    const dataList = dataAggregate[0].elements
    res.status(200).json({ dataList, count })
  } catch (error) {
    next(error)
  }
}

exports.getByOrderNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.query
    const myMatch = {}
    myMatch['orderNumber'] = {
      "$eq": +orderNumber
    }

    const dataAggregate = await Purchase.aggregate([
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
            localField: "initiator",
            foreignField: "_id",
            as: "initiator"
        }
      },
      {
        $unwind: {
            path: "$initiator",
        },
      },
      {
        $lookup: {
            from: "users",
            localField: "executor",
            foreignField: "_id",
            as: "executor"
        }
      },
      {
        $unwind: {
            path: "$executor",
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
            products: '$products',
            orderId: '$orderId',
            orderNumber: '$orderNumber',
            number: '$number',
            comment: '$comment',
            message: '$message',
            createdAt: '$createdAt',
            seenAt: '$seenAt',
            region: '$region',
            initiator: {
              _id: '$initiator._id',
              name: '$initiator.name',
              surname: '$initiator.surname',
              lastname: '$initiator.lastname',
            },
            executor: {
              _id: '$executor._id',
              name: '$executor.name',
              surname: '$executor.surname',
              lastname: '$executor.lastname',
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
    .facet({
      elements: new mongoose.Aggregate()
        .pipeline(),
      count: new mongoose.Aggregate().count('count').pipeline(),
    })
    
    const count = dataAggregate[0].count.length ? dataAggregate[0].count[0].count : 0
    const dataList = dataAggregate[0].elements
    res.status(200).json({ dataList, count })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {

  try {
    let count = 0
    await Purchase.countDocuments({}, function(err, docCount) {
      if (err) { return handleError(err) }
      count = docCount += 1
    })

    let reqData = {
      ...req.body.data,
      number: count,
      orderId: mongoose.Types.ObjectId(req.body.data.orderId)
    }
    
    const newRecord = await Purchase.create(reqData)
    await newRecord.save()
    res.status(201).json({
      message: 'ADDED',
      data: newRecord,
    })
  } catch (error) {
    next(error)
  }
}

exports.edit = async (req, res, next) => {
  try {
    const dataId = req.body.dataId
    const requestData = req.body.data

    const updateModel = await Purchase.updateOne(
      {
        _id: mongoose.Types.ObjectId(dataId),
      },
      {
        ...requestData,
      }
    )
    const result = { 
      ...updateModel, 
      category: requestData.category, 
      region: requestData.region,
      issuedBy: requestData.issuedBy,
      issuedTo: requestData.issuedTo,
    }

    res.status(201).json({ message: 'EDITED', result  
    })
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const deletedRecord = await Purchase.findOneAndDelete({ _id: req.body.id }).lean()
    res.status(201).json({
      message: 'DELETED',
      data: deletedRecord,
    })
  } catch (error) {
    next(error)
  }
}
