const mongoose = require('mongoose')
const Orders = require('../models/orders')
const Products = require('../models/products')
const Conditions = require('../models/conditions')
const User = require('../models/user')
const moment = require('moment')
const { v4: uuidv4 } = require("uuid");
const _ = require('lodash')
const calltouch = require('../utils/calltouch')

exports.getOrders = async(req, res, next) => {
    try {
        const page = +req.query.page - 1
        const options = req.body.options
        let phone = options.search ? options.search.replace(/ /g, '').replace('+', '').replace('-', '').replace('(', '').replace(')', '') : ""
        console.log(phone, typeof phone)
        const searchStr = options.search ? options.search.split(' ') : []
        if (searchStr && searchStr.length) {
            for (let i = 0; i < searchStr.length; i++) {
                searchStr[i] = new RegExp('(\w|\s){0,}' + _.escapeRegExp(searchStr[i].trim()) + '(\w|\s){0,}', 'ui')
            }
        }
        let myMatch = {}
        const mySort = {}
        if (options.type !== "all" && options.type !== null) {
            myMatch['type'] = options.type
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

        if (options.client && options.client !== 'all') {
            myMatch['client._id'] = {
                "$in": [mongoose.Types.ObjectId(options.client)]
            }
        }

        if (options.search) {
            // if (searchStr.length > 3) {
            //     myMatch['client.phone'] = {
            //         "$in": [searchStr.join(' ')]
            //     }
            // }
        let or = [
            {
                $or: [
                    {
                        $and: [
                            {
                                'client.name' : searchStr[0]
                            }
                        ]
                    },
                    {
                        $and: [
                            {
                                'client.lastname' : searchStr[0]
                            }
            
                        ]
                    },
                    {
                        'truePhone' : phone
                    }
                    ]
                }, 
                {
                    'number' : Number.parseInt(options.search)
                },
                {
                    'client.email' : options.search
                }   
            
        ]
        if(searchStr.length > 1){
            or[0].$or[0].$and.push({
                'client.lastname' : searchStr[1]
            })
            or[0].$or[1].$and.push({
                'client.name' : searchStr[1]
            })
        }
        myMatch = {
            ...myMatch,
            $or: or
        }
        }
        if (options.number === -1) {
            mySort['number'] = -1
            delete mySort['createdAt']
            delete mySort['buyed']
            delete mySort['deliver']
        }
        if (options.number === 1) {
            mySort['number'] = 1
            delete mySort['createdAt']
            delete mySort['buyed']
            delete mySort['deliver']
        }
        if (options.created === -1) {
            mySort['createdAt'] = -1
            delete mySort['number']
            delete mySort['buyed']
            delete mySort['deliver']
        }
        if (options.created === 1) {
            mySort['createdAt'] = 1
            delete mySort['number']
            delete mySort['buyed']
            delete mySort['deliver']
        }
        if (options.buyed === -1) {
            mySort['buyed'] = -1
            delete mySort['createdAt']
            delete mySort['number']
            delete mySort['deliver']
        }
        if (options.buyed === 1) {
            mySort['buyed'] = 1
            delete mySort['createdAt']
            delete mySort['number']
            delete mySort['deliver']
        }
        if (options.deliver === -1) {
            mySort['deliver'] = -1
            delete mySort['createdAt']
            delete mySort['buyed']
            delete mySort['number']
        }
        if (options.deliver === 1) {
            mySort['deliver'] = 1
            delete mySort['createdAt']
            delete mySort['buyed']
            delete mySort['number']
        }
        if (!options.number && !options.created && !options.buyed && !options.deliver) {
            mySort['number'] = -1
        }
        if (options.dates !== null || options.dates !== 'all') {
            let now = moment().startOf('day').format()
            let today, week, weekAgo, month, monthAgo, year, yearAgo, startOfMonth
            now = new Date(now)

            //console.log(now)

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

        if (options.startDate && new Date(options.startDate) instanceof Date) {
            let startDate = new Date(moment(options.startDate))
            let endDate = new Date(moment(options.endDate))

            myMatch['createdAt'] = {
                "$lt": endDate,
                "$gt": startDate
            }
        }
        const orders = await Orders.aggregate([
            {
            $match: {
                $or : [
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
            },
            {$lookup: {
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
            }, {
                $unwind: {
                    path: '$region'
                }
            },{
                $lookup: {
                    from: 'conditions',
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
                    from: 'clients',
                    localField: 'client',
                    foreignField: '_id',
                    as: 'client'
                }
            }, {
                $unwind: {
                    path: '$client'
                }
            },
            {
                $addFields : {
                    truePhoneStageOne: {
                        $replaceAll: {
                            input: "$client.phone",
                            find: " ",
                            replacement: ""
                        }
                    }
                }
            }, 
            {
                $addFields : {
                    truePhone: {
                        $replaceAll: {
                            input: "$truePhoneStageOne",
                            find: "+",
                            replacement: ""
                        }
                    }
                }
            }, {
            $facet: {
                results: [{
                        $match: myMatch
                    },
                    {
                        $sort: mySort
                    }, {
                        $skip: page * 15
                    },
                    {
                        $limit: 15
                    }
                ],
                totalCost: [{
                    $match: myMatch
                }, {
                    $group: {
                        _id: null,
                        cost: {
                            $sum: '$sum'
                        }
                    }
                }],
                totalDelivery: [{
                    $match: myMatch
                }, {
                    $group: {
                        _id: null,
                        deliverySum: {
                            $sum: '$deliverySum'
                        }
                    }
                }],
                totalProfit: [{
                    $match: myMatch
                }, {
                    $group: {
                        _id: null,
                        profit: {
                            $sum: '$profit'
                        }
                    }
                }],
                totalShippedSum: [{
                    $match: myMatch
                }, {
                    $group: {
                        _id: null,
                        shippedSum: {
                            $sum: '$shippedSum'
                        }
                    }
                }],
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
        }])
        let result = {
            orders: orders ? orders[0].results : [],
            count: orders ? orders[0].count[0] ? orders[0].count[0].count : 0 : 0,
            total: orders ? orders[0].totalCost[0] ? orders[0].totalCost[0].cost : 0 : 0,
            profit: orders ? orders[0].totalProfit[0] ? orders[0].totalProfit[0].profit : 0 : 0,
            delivery: orders ? orders[0].totalDelivery[0] ? orders[0].totalDelivery[0].deliverySum : 0 : 0,
            shippedSum: orders ? orders[0].totalShippedSum[0] ? orders[0].totalShippedSum[0].shippedSum : 0 : 0,
        }
        // calltouch.sendAllOrders(result.orders)
        // console.log("🚀 ~ file: orders.js ~ line 370 ~ exports.getOrders=async ~ orders", result)
        console.log("///////////////////////")
        console.log("Orders")        
        console.log("///////////////////////")
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

exports.getProductsFromOrders = async(req, res, next) => {
    try {
        const orderId = req.body.orderId

        let order = await Orders.findById(mongoose.Types.ObjectId(orderId))
        //console.log(order)
        let products = []
        for (let i = 0; i < order.products.length; i++) {
            const el = order.products[i];
            //console.log(el)
            let product = await Products.aggregate([{
                $project: {
                    results: {
                        regions: {
                            $filter: {
                                input: '$regions',
                                as: 'el',
                                cond: {
                                    $and: [{
                                        $eq: [
                                            '$$el.product._id',
                                            el.product_id
                                        ]
                                    }, {
                                        $eq: [
                                            '$$el.region',
                                            mongoose.Types.ObjectId(order.region.toString())
                                        ]
                                    }, ]
                                }
                            },
                        },
                    }
                }
            }, {
                $unwind: {
                    path: '$results.regions'
                }
            }, {
                $project: {
                    product: {
                        _id: '$results.regions.product._id',
                        article: '$results.regions.product.article',
                        title: '$results.regions.product.title',
                    }
                }
            }, {
                $group: {
                    _id: 0,
                    product: {
                        $push: '$product'
                    }
                }
            }])
            //console.log("product[0]")
            //console.log(product[0])
            if(product && product[0] && product[0].product){
                let productEl = product[0].product[0]
                products.push({
                    _id: productEl._id,
                    product_id: productEl._id,
                    title: productEl.title,
                    article: productEl.article,
                    club_cost: el.club_cost,
                    cost: el.discount_price ? el.discount_price : el.cost,
                    quantity: el.quantity,
                    discount_price: el.discount_price,
                })
            } else {
                products.push({
                    _id: mongoose.Types.ObjectId(),
                    title: "Товар не найден",
                    article: '-',
                    club_cost: 0,
                    cost: 0,
                    quantity: 0,
                    discount_price: 0,
                })
            }
        }
    
        let result = products
        console.log("///////////////////////")
        console.log("Orders products")
        //console.log(result)
        console.log("///////////////////////")
        res.status(201).json(products)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.addOrder = async(req, res, next) => {
    try {
        const lastRecord = await Orders.find().limit(1).sort({$natural:-1})
        const count = lastRecord[0].number += 1
        
        const dataOrder = {
            ...req.body,
            number: count,
            acquiringNum: uuidv4()
        }
        const newOrder = await Orders.create(dataOrder)
        await newOrder.save()
        //! CALLTOUCH START * * * * * * * * * * * *
        try {
            console.log("🚀 ~ file: orders.js ~ line 490 ~ exports.addOrder=async ~ newOrder", newOrder)
            calltouch.newOrder(newOrder)
        } catch (err) {
            console.log("🚀 ~ file: orders.js ~ line 494 ~ exports.addOrder=async ~ error", err)
        }
        //! CALLTOUCH END * * * * * * * * * * * * *
        res.status(201).json({
            message: "ADDED",
            data: newOrder
        })
    } catch (error) {
        next(error)
    }
}

exports.sendToOneC = async(req, res, next) => {
    try {
        const orderId = req.body.orderId
        const currentOrder = await Orders.findById(orderId)
        if (currentOrder.oneC.accepted){
            res.status(409).json({
                message: "Already accepted",
                orderId: orderId
            })
        }
        if (currentOrder.oneC.requested){
            res.status(409).json({
                message: "Already requested",
                orderId: orderId
            })
        }
        await Orders.updateOne({
            _id: mongoose.Types.ObjectId(orderId)
        }, {"oneC.requested" : true})
        
        console.log("///////////////////////")
        console.log("Sent to oneC")
        console.log("///////////////////////")

        res.status(201).json({
            message: "SENT TO ONEC",
            orderId: orderId
        })
    } catch (error) {
        next(error)
    }
}

exports.editOrder = async(req, res, next) => {
    try {
        const dataOrder = req.body
        const orderId = dataOrder.orderId
        const status = await Conditions.findOne({
            value: dataOrder.status
        }).lean()
        const currentOrder = await Orders.findById(orderId)
        if (dataOrder.manager) {
            currentOrder.manager = [mongoose.Types.ObjectId(dataOrder.manager)]
        }
        if (dataOrder.buyed) {
            currentOrder.buyed = dataOrder.buyed
        }
        if (dataOrder.deliver) {
            currentOrder.deliver = dataOrder.deliver
        }
        if (dataOrder.deliverySum) {
            currentOrder.deliverySum = dataOrder.deliverySum
        }
        if (dataOrder.declainReason) {
            currentOrder.declainReason = dataOrder.declainReason
        }
        if (dataOrder.status) {
            currentOrder.status = mongoose.Types.ObjectId(status._id)
        }
        if (typeof(dataOrder.manager_comment) !== 'undefined') {
            currentOrder.manager_comment = dataOrder.manager_comment
        }
        currentOrder.sum = dataOrder.sum
        currentOrder.products = dataOrder.products
        await Orders.updateOne({
            _id: mongoose.Types.ObjectId(orderId)
        }, currentOrder)

        const orderWithoutFormat = await Orders.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(orderId)
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
        }, {
            $unwind: {
                path: '$region'
            }
        }, {
            $lookup: {
                from: 'conditions',
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
                from: 'clients',
                localField: 'client',
                foreignField: '_id',
                as: 'client'
            }
        }, {
            $unwind: {
                path: '$client'
            }
        }])
        let order = orderWithoutFormat[0]
        for (let i = 0; i < global.users.length; i++) {
            if (global.users[i].role === 'admin' || global.users[i].role === 'director' || global.users[i].role === 'call' || global.users[i].userId === order.manager[0]._id.toString()) {
                console.log(`we sent it to ${global.users[i].role}`)
                global.io.to(global.users[i].userId).emit("OrderUpdate", order);
            }
        }
        if (status && status.value == 'completed'){
            for (p of dataOrder.products){
                const id = p.product_id
                const prod = await Products.updateOne({
                    'regions.product._id': id,
                    'regions.region': order.region},
                    {
                      $inc: {'regions.$.product.buyed_count': 1}
                    })
            }
        }
        
        //! CALLTOUCH START * * * * * * * * * * * *
        try {
            calltouch.updOrder(currentOrder)
        } catch (err) {
            console.log("🚀 ~ file: orders.js ~ line 639 ~ exports.editOrder=async ~ err", err)
        }
        //! CALLTOUCH END * * * * * * * * * * * * *
        console.log("///////////////////////")
        console.log("Updated Order")
        console.log("///////////////////////")
        res.status(201).json({
            message: "EDITED",
            order: order
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteOrder = async(req, res, next) => {
    try {
        const orderId = Array.isArray(req.body.orderId) ? req.body.orderId : [ req.body.orderId ]
        console.log(orderId, typeof orderId[0])
        orderId.map(id => mongoose.Types.ObjectId(id))
        const deletedOrder = await Orders.updateMany({
            _id: { $in: orderId}
        }, {
            $set: {
                'deleted': true
            }
        })
        for (id of orderId){
            await User.findOneAndUpdate({
                orders: id
            }, {
                $pull: {
                    'orders': id
                }
            })
        }
        //! CALLTOUCH START * * * * * * * * * * * *
        try {
            calltouch.delOrder(Array.isArray(req.body.orderId) ? req.body.orderId : [ req.body.orderId ])
        } catch (err) {
            console.log("🚀 ~ file: orders.js ~ line 678 ~ exports.deleteOrder ~ err", err)
        }
        //! CALLTOUCH END * * * * * * * * * * * * *
        console.log("///////////////////////")
        console.log("Deleted Order")
        console.log("///////////////////////")
        res.status(200).json({
            message: "DELETED",
            // order: {
            //     _id: orderId
            // }
        })
    } catch (error) {
        next(error)
    }
}

exports.receiveOrder = async(req, res, next) => {
    try {
        const orderId = req.body.orderId

        let orderWithoutFormat = await Orders.aggregate(
            [{
                    $match: {
                        _id: mongoose.Types.ObjectId(orderId)
                    }
                },
                {
                    $lookup: {
                        from: 'clients',
                        localField: 'client',
                        foreignField: '_id',
                        as: 'client'
                    }
                }, {
                    $unwind: {
                        path: '$client'
                    }
                }, {
                    $lookup: {
                        from: 'regions',
                        localField: 'region',
                        foreignField: '_id',
                        as: 'region'
                    }
                }, {
                    $unwind: {
                        path: '$region',
                    }
                }, {
                    $lookup: {
                        from: 'conditions',
                        localField: 'status',
                        foreignField: '_id',
                        as: 'status'
                    }
                }, {
                    $unwind: {
                        path: '$status',
                    }
                }, {
                    $lookup: {
                        from: 'users',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager'
                    }
                }
            ]
        )
        let order = orderWithoutFormat[0]
        console.log(order)

        if (order.manager && !order.manager.length) {
            // Если менеджер не был установлен, отправляем админам
            for (let i = 0; i < global.users.length; i++) {
                if (global.users[i].role === 'admin' || global.users[i].role === 'director' || global.users[i].role === 'call') {
                    console.log(`we sent it to ${global.users[i].role}`)
                    global.io.to(global.users[i].userId).emit("ordersChanges", order);
                }
            }
        } else {
            // Иначе получаем менеджера из пользователей и отправляем админу и менеджеру
            for (let i = 0; i < global.users.length; i++) {
                console.log(global.users[i])
                if (global.users[i].role === 'admin' || global.users[i].role === 'director' || global.users[i].role === 'call' || (order.manager && order.manager[0]._id.toString() === global.users[i].userId)) {
                    console.log(`we sent it to ${global.users[i].role}`)
                    global.io.to(global.users[i].userId).emit("ordersChanges", order);
                }
            }
        }

        console.log("///////////////////////")
        console.log("Recieved Order")
        console.log(order)
        console.log("///////////////////////")
        res.status(200).json({
            message: "OK"
        })
    } catch (error) {
        next(error)
    }
}

exports.getByNumber = async(req, res, next) => {
    const orderNumber = +req.query.orderNumber
    let myMatch = {}
    myMatch['number'] = orderNumber
    myMatch['deleted'] = false

    try {

        const order = await Orders.aggregate([
        { 
            $match: myMatch 
        },
        {
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
        }, {
            $unwind: {
                path: '$region'
            }
        },{
            $lookup: {
                from: 'conditions',
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
                from: 'clients',
                localField: 'client',
                foreignField: '_id',
                as: 'client'
            }
        }, {
            $unwind: {
                path: '$client'
            }
        }
        
        ])

        const result =  order ? {
            order:  order[0]
        } : {
            order: null
        }
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}