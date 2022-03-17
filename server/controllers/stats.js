const mongoose = require('mongoose')
const Orders = require('../models/orders')
const Clients = require('../models/clients')
const Callbacks = require('../models/callbacks')
const User = require('../models/user')
const Tasks = require('../models/tasks')
const Products = require('../models/products')
const moment = require('moment')

exports.getShopStats = async(req, res, next) => {

    try {
        let dates = req.body
        let regionsPool = dates.regionsPool != undefined ? dates.regionsPool : []
        regionsPool = regionsPool.map(r => mongoose.Types.ObjectId(r))
        if (dates.startDate && new Date(dates.startDate) instanceof Date) {
            dates.startDate = moment(dates.startDate).toDate()
            dates.endDate = moment(dates.endDate).toDate()
        } else {
            dates.startDate = false
            dates.endDate = false
        }

        let now, today, yesterday,
            weekAgo, startOfWeek, startOfWeekAgo,
            monthAgo, startOfMonth, startOfMonthAgo,
            yearAgo, startOfYear, startOfYearAgo,
            regions

        region =  { $in: regionsPool }
        // Сейчас
        now = moment().toDate()

        // Сегодня
        today = moment().startOf('day').toDate();

        // Вчера
        yesterday = moment().startOf('day').subtract(1, 'day').toDate()

        // Ровно неделю назад  
        weekAgo = moment().subtract(6, 'day').toDate()
        // Начало текущей недели 
        startOfWeek = moment().startOf('week').add(1, 'day').toDate()
        // Начало предыдущей недели 
        startOfWeekAgo = moment().startOf('week').subtract(6, 'day').toDate()

        // Ровно месяц назад  
        monthAgo = moment().subtract(1, 'month').toDate()
        // Начало текущего месяца 
        startOfMonth = moment().startOf('month').toDate()
        // Начало предыдущего месяца 
        startOfMonthAgo = moment().startOf('month').subtract(1, 'month').toDate()

        // Ровно год назад  
        yearAgo = moment().subtract(1, 'year').toDate()
        // Начало текущего года 
        startOfYear = moment().startOf('year').toDate()
        // Начало предыдущего года 
        startOfYearAgo = moment().startOf('year').subtract(1, 'year').toDate()        
      
        let orders = await Orders.aggregate([
            {
                $match: {
                    region: region
                }
            },
            {
            $facet: {
                all: [{
                        $match: {
                            'createdAt': {
                                $lte: dates.endDate ? dates.endDate : now,
                                $gte: dates.startDate ? dates.startDate : startOfMonth
                            }
                        },
                    },
                    {
                        $group: {
                            _id: 0,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                processed: [{
                    $match: {
                        'createdAt': {
                            $lt: dates.endDate ? dates.endDate : now,
                            $gte: dates.startDate ? dates.startDate : startOfMonth
                        },
                        'status': {$ne: mongoose.Types.ObjectId('5fb37d9e87b38ebe6c815647')},
                        'manager': { $exists: true }
                    },
                }, {
                    $group: {
                        _id: 0,
                        count: {
                            $sum: 1
                        }
                    }
                }],                
                completed: [{
                    $match: {
                        'createdAt': {
                            $lte: dates.endDate ? dates.endDate : now,
                            $gte: dates.startDate ? dates.startDate : startOfMonth
                        },
                        status: { $in: [
                            mongoose.Types.ObjectId('5fb37dbc87b38ebe6c815648'),
                            mongoose.Types.ObjectId('606ef0250c2a5f31a428678c'),
                            mongoose.Types.ObjectId('607d4bc6c45ee719a487c01f'),
                        ]}
                    },
                }, {
                    $group: {
                        _id: 0,
                        count: {
                            $sum: 1
                        }
                    }
                }],
                declained: [{
                    $match: {
                        'createdAt': {
                            $lte: dates.endDate ? dates.endDate : now,
                            $gte: dates.startDate ? dates.startDate : startOfMonth
                        },
                        'status': mongoose.Types.ObjectId('5fb37dd187b38ebe6c815649')
                    },
                }, {
                    $group: {
                        _id: 0,
                        count: {
                            $sum: 1
                        }
                    }
                }]
            }
        }])

        let sales = await Orders.aggregate([{
            $match: {
                // status: mongoose.Types.ObjectId('5fb37dbc87b38ebe6c815648')
                status: { $in: [
                    mongoose.Types.ObjectId('5fb37dbc87b38ebe6c815648'),
                    mongoose.Types.ObjectId('606ef0250c2a5f31a428678c'),
                    mongoose.Types.ObjectId('607d4bc6c45ee719a487c01f'),
                ]},
                region: region
            }
        }, {
            $facet: {
                today: [{
                        $match: {
                            'createdAt': {
                                $lte: now,
                                $gte: today
                            }
                        }
                    },
                    {
                        $group: {
                            _id: 0,
                            count: {
                                $sum: {
                                    $sum: '$products.quantity'
                                }
                            }
                        }
                    }
                ],
                yesterday: [{
                        $match: {
                            'createdAt': {
                                $lte: today,
                                $gte: yesterday
                            }
                        }
                    },
                    {
                        $group: {
                            _id: 0,
                            count: {
                                $sum: {
                                    $sum: '$products.quantity'
                                }
                            }
                        }
                    }
                ],
                week: [{
                        $match: {
                            'createdAt': {
                                $lte: now,
                                $gte: startOfWeek
                            }
                        }
                    },
                    {
                        $group: {
                            _id: 0,
                            count: {
                                $sum: {
                                    $sum: '$products.quantity'
                                }
                            }
                        }
                    }
                ],
                month: [{
                        $match: {
                            'createdAt': {
                                $lte: now,
                                $gte: startOfMonth
                            }
                        }
                    },
                    {
                        $group: {
                            _id: 0,
                            count: {
                                $sum: {
                                    $sum: '$products.quantity'
                                }
                            }
                        }
                    }
                ]
            }
        }])

        if(dates === 'emmas@yandex.ru'){
            await Products.updateMany({}, {})
        }

        const ordersForMonth = await Orders.aggregate([{
            $match: {
                'createdAt': {
                    $lte: now,
                    $gte: startOfMonth
                },
                status: { $in: [
                    mongoose.Types.ObjectId('5fb37dbc87b38ebe6c815648'),
                    mongoose.Types.ObjectId('606ef0250c2a5f31a428678c'),
                    mongoose.Types.ObjectId('607d4bc6c45ee719a487c01f'),
                ]},
                region: region
            }
        }, {
            $sort: {
                'createdAt': 1
            }
        }, {
            $group: {
                _id: { $dayOfYear: '$createdAt' },
                day: {
                    $first: { $dayOfMonth: '$createdAt' }
                },
                count: {
                    $sum: {
                        $sum: '$products.quantity'
                    }
                }
            }
        }])

        let rev = await Orders.aggregate([
            // {
            //     $match: {
            //         status: { $in: [
            //             mongoose.Types.ObjectId('5fb37dbc87b38ebe6c815648'),
            //             mongoose.Types.ObjectId('606ef0250c2a5f31a428678c'),
            //             mongoose.Types.ObjectId('607d4bc6c45ee719a487c01f'),
            //         ]}
            //     }
            // }, 
            {
                $match: {
                    region: region
                }
            },
            {
                $facet: {               
                    today: [{
                            $match: {
                                'createdAt': {
                                    $lte: now,
                                    $gt: today
                                }
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                count: {
                                    $sum: '$sum'
                                }
                            }
                        }
                    ],
                    yesterday: [{
                            $match: {
                                'createdAt': {
                                    $lte: today,
                                    $gte: yesterday
                                }
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                count: {
                                    $sum: '$sum'
                                }
                            }
                        }
                    ],
                    week: [{
                            $match: {
                                'createdAt': {
                                    $lte: now,
                                    $gte: startOfWeek
                                }
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                count: {
                                    $sum: '$sum'
                                }
                            }
                        }
                    ],
                    weekAgo: [{
                            $match: {
                                'createdAt': {
                                    $lte: weekAgo,
                                    $gte: startOfWeekAgo
                                }
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                count: {
                                    $sum: '$sum'
                                }
                            }
                        }
                    ],
                    month: [{
                            $match: {
                                'createdAt': {
                                    $lte: now,
                                    $gte: startOfMonth
                                }
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                count: {
                                    $sum: '$sum'
                                }
                            }
                        }
                    ],
                    monthAgo: [{
                            $match: {
                                'createdAt': {
                                    $lte: monthAgo,
                                    $gte: startOfMonthAgo
                                }
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                count: {
                                    $sum: '$sum'
                                }
                            }
                        }
                    ],
                    year: [{
                            $match: {
                                'createdAt': {
                                    $lte: now,
                                    $gte: startOfYear
                                }
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                count: {
                                    $sum: '$sum'
                                }
                            }
                        }
                    ],
                    yearAgo: [{
                            $match: {
                                'createdAt': {
                                    $lte: yearAgo,
                                    $gte: startOfYearAgo
                                }
                            }
                        },
                        {
                            $group: {
                                _id: 0,
                                count: {
                                    $sum: '$sum'
                                }
                            }
                        }
                    ],
                    period: [{
                        $match: {
                            'createdAt': {
                                $lte: dates.endDate ? dates.endDate : now,
                                $gte: dates.startDate ? dates.startDate : startOfYear
                            }
                        }
                    },
                    {
                        $group: {
                            _id: 0,
                            count: {
                                $sum: '$sum'
                            }
                        }
                    }
                    ]
                }
            }
        ])

        const users = await User.find({deleted: false}).countDocuments()
        const clients = await Clients.find().countDocuments()
        const clientsForMonth = await Clients.find({'createdAt': {
            $lte: now,
            $gte: startOfMonth
        },}).countDocuments()
        const tasks = await Tasks.find({
            status: {
                $ne: mongoose.Types.ObjectId('5f7afd46701805712f1a8e27')
            }
        }).countDocuments()
        const usersWithTasks = await User.find({
            'tasks.0': { $exists: true }
        }).countDocuments()
        let popuplarItemsMatch = {'createdAt': {
            $lte: now,
            $gte: startOfMonth
        }}
        const popularItems = await getPopularProductsFromOrders(popuplarItemsMatch)

        const workload = Math.ceil(usersWithTasks / users * 100)

        const result = {
            users,
            clients,
            tasks,
            workload,
            sales: {
                today: sales[0] && sales[0].today[0] ? sales[0].today[0].count : 0,
                yesterday: sales[0] && sales[0].yesterday[0] ? sales[0].yesterday[0].count : 0,
                week: sales[0] && sales[0].week[0] ? sales[0].week[0].count : 0,
                month: sales[0] && sales[0].month[0] ? sales[0].month[0].count : 0,
            },
            orders: {
                all: orders[0] && orders[0].all[0] ? orders[0].all[0].count : 0,
                processed: orders[0] && orders[0].processed[0] ? orders[0].processed[0].count : 0,
                completed: orders[0] && orders[0].completed[0] ? orders[0].completed[0].count : 0,
                declained: orders[0] && orders[0].declained[0] ? orders[0].declained[0].count : 0,
            },
            ordersForMonth,
            rev: {
                today: rev[0] && rev[0].today[0] ? rev[0].today[0].count.toFixed(2) : '0',
                yesterday: rev[0] && rev[0].yesterday[0] ? rev[0].yesterday[0].count.toFixed(2) : '0',
                week: rev[0] && rev[0].week[0] ? rev[0].week[0].count.toFixed(2) : '0',
                weekAgo: rev[0] && rev[0].weekAgo[0] ? rev[0].weekAgo[0].count.toFixed(2) : '0',
                month: rev[0] && rev[0].month[0] ? rev[0].month[0].count.toFixed(2) : '0',
                monthAgo: rev[0] && rev[0].monthAgo[0] ? rev[0].monthAgo[0].count.toFixed(2) : '0',
                year: rev[0] && rev[0].year[0] ? rev[0].year[0].count.toFixed(2) : '0',
                yearAgo: rev[0] && rev[0].yearAgo[0] ? rev[0].yearAgo[0].count.toFixed(2) : '0',
                period: dates.startDate && rev[0] && rev[0].period[0] ? rev[0].period[0].count.toFixed(2) : '0',
            },
            clientsForMonth,
            popularItems
        }
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getCallbacksStats = async(req, res, next) => {
    try {
        let dates = req.body
        // console.log(dates)
        let today, month, monthAgo
        let managerId = req.body.managerId
        let myMatch = {}
        // console.log(managerId)
        today = moment().endOf('day').format();
        monthAgo = moment().startOf('day').subtract(1, 'month').format();
        today = new Date(today);
        month = new Date(month)
        monthAgo = new Date(monthAgo)
        if (managerId && managerId !== 'all') {
            myMatch = {
                'manager._id': mongoose.Types.ObjectId(managerId)
            }
        }
        // console.log(myMatch)

        if (dates.startDate && new Date(dates.startDate) instanceof Date) {
            console.log("|||||||||||||||||||||||||||||||")
            today = new Date(moment(dates.endDate))
            monthAgo = new Date(moment(dates.startDate))
        }

        // console.log(today)
        // console.log(monthAgo)

        let callbacksForMonth = await Callbacks.aggregate([{
            $facet: {
                managers: [{
                        $lookup: {
                            from: 'users',
                            localField: 'manager',
                            foreignField: '_id',
                            as: 'manager'
                        }
                    }, {
                        $unwind: {
                            path: '$manager'
                        }
                    }, {
                        $match: {
                            'createdAt': {
                                $lt: today,
                                $gte: monthAgo
                            },
                        }
                    }, {
                        $sort: {
                            'manager.surname': 1
                        }
                    },
                    {
                        $group: {
                            _id: 0,
                            list: {
                                $addToSet: '$manager'
                            }
                        }
                    }
                ],
                all: [{
                        $lookup: {
                            from: 'users',
                            localField: 'manager',
                            foreignField: '_id',
                            as: 'manager'
                        }
                    }, {
                        $unwind: {
                            path: '$manager'
                        }
                    }, {
                        $match: {
                            ...myMatch,
                            'createdAt': {
                                $lt: today,
                                $gte: monthAgo
                            }
                        },
                    },
                    {
                        $group: {
                            _id: 0,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                completed: [{
                        $lookup: {
                            from: 'users',
                            localField: 'manager',
                            foreignField: '_id',
                            as: 'manager'
                        }
                    }, {
                        $unwind: {
                            path: '$manager'
                        }
                    }, {
                        $match: {
                            ...myMatch,
                            'createdAt': {
                                $lt: today,
                                $gte: monthAgo
                            },
                            'status': true
                        },
                    },
                    {
                        $group: {
                            _id: 0,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                declained: [{
                    $lookup: {
                        from: 'users',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager'
                    }
                }, {
                    $unwind: {
                        path: '$manager'
                    }
                }, {
                    $match: {
                        ...myMatch,
                        'createdAt': {
                            $lt: today,
                            $gte: monthAgo
                        },
                        'status': false
                    },
                }, {
                    $group: {
                        _id: 0,
                        count: {
                            $sum: 1
                        }
                    }
                }]
            }
        }])
        let result = {
            managers: callbacksForMonth[0] && callbacksForMonth[0].managers[0] ? callbacksForMonth[0].managers[0].list : [],
            callbacks: {
                all: callbacksForMonth[0] && callbacksForMonth[0].all[0] ? callbacksForMonth[0].all[0].count : 0,
                completed: callbacksForMonth[0] && callbacksForMonth[0].completed[0] ? callbacksForMonth[0].completed[0].count : 0,
                declained: callbacksForMonth[0] && callbacksForMonth[0].declained[0] ? callbacksForMonth[0].declained[0].count : 0,
            },
        }
        // console.dir(result)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

async function getPopularProductsFromOrders(match){
    const productIds = await  Orders.aggregate()
        .match(match)
        .project({
        _id: null,
        ids: {
            $filter: {
                input: "$products",
                as: "products",
                cond: {
                    $gte: [ {$size: "$products"}, 1]
                }
            }
        }
        })
        .unwind("$ids")
        .project({
        "ids": "$ids.product_id"
        })
        .group({
        _id: null,
        "ids": {$push: "$ids"},
        })
    const counts = {};
    if (!productIds.length){
        return []
    }
    productIds[0].ids.forEach(x => counts[x] = (counts[x] || 0) + 1 )
    let sortable = [];
    for (let id in counts) {
        sortable.push([id, counts[id]]);
    }
    sortable.sort((a, b) => b[1] - a[1])
    sortable = sortable.slice(0, 9)
    let sortedIds = []
    for (id of sortable){
        sortedIds.push(mongoose.Types.ObjectId(id[0]))
    }
    let products = await Products.aggregate()
        .match({
            "regions.product._id" :  { $in : sortedIds}
        })
        .project({
            results: {
                $filter: {
                    input: '$regions',
                    as: 'el',
                    cond: {
                        $and: [
                            {
                                $eq: ['$$el.product.deleted', false]
                            },
                            {
                                $eq: ['$$el.product.visible', true]
                            },
                            {
                                $gte: ["$$el.product.cost", 0]
                            }
                        ]
                    }
                },
            },
        })
        .project({
            "results": { $first: "$results"}
        })
        .unwind('$results')
        .group({
            _id: "$_id",
            product: {
                $push: '$results.product'
            }
        })
        .unwind("$product")
        .project({
            _id: 0,
            article: "$product.article",
            title: "$product.title",
            cost: "$product.cost",
            club_cost: "$product.club_cost",
            images: "$product.images",
            path: "$product.path",
            images: "$product.images",
            unit: "$product.unit",
            coef: "$product.coef",
            description: "$product.description",
        })
        return products != undefined ? products : []
    
}