const mongoose = require('mongoose')
const Corporates = require('../models/corporates')
const Regions = require('../models/regions')
const Orders = require('../models/orders')
const { generatePassword, comparePasswords } = require("../utils/bcrypt")
const { generateTokenForClient, generateRefreshTokenForClient } = require('../utils/jwt')
const generator = require('generate-password')
const { SMSRu } = require('node-sms-ru')
const smsRu = new SMSRu(process.env.SMSRUKEY)
const moment = require('moment')
const corporates = require('../models/corporates')
const { findById } = require('../models/corporates')

exports.getCorporates = async (req, res, next) => {
    try {
        const page = +req.query.page - 1
        const options = req.body.options
        const searchStr = options.search ? options.search.split(' ') : null
        if (searchStr && searchStr.length) {
            for (let i = 0; i < searchStr.length; i++) {
                searchStr[i].trim()
            }
        }
        let myMatch = {}

        if (options.region !== "all" && options.region !== null) {
            const region = await Regions.findOne({ value: options.region }).select('_id').lean()

            myMatch['region'] = {
                "$in": [mongoose.Types.ObjectId(region._id)]
            }
        }

        if (options.search) {
            if (searchStr.length > 3) {
                myMatch['phone'] = {
                    "$in": [searchStr.join(' ')]
                }
            }
            if (searchStr.length <= 3) {
                myMatch = {
                    ...myMatch,
                    $or: [{
                            'surname': {
                                "$in": searchStr
                            }
                        },
                        {
                            'name': {
                                "$in": searchStr
                            }
                        },
                        {
                            'lastname': {
                                "$in": searchStr
                            }
                        },
                    ]
                }
            }
        }
        myMatch['deleted'] = false
        console.log(myMatch)

        if (options.dates !== null || options.dates !== 'all') {
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

        if (options.startDate && new Date(options.startDate) instanceof Date) {
            let startDate = new Date(moment(options.startDate))
            let endDate = new Date(moment(options.endDate))

            myMatch['createdAt'] = {
                "$lt": endDate,
                "$gt": startDate
            }
        }

        let clients = await Corporates.aggregate([{
            $lookup: {
                from: "orders",
                let: { "oid": "$orders" },
                pipeline: [{
                        "$match": { "$expr": { "$in": ["$_id", "$$oid"] } }
                    },
                    {
                        $lookup: {
                            from: 'regions',
                            localField: 'region',
                            foreignField: '_id',
                            as: 'region'
                        }
                    },
                    {
                        $unwind: {
                            path: '$region'
                        }
                    },
                    {
                        $lookup: {
                            from: 'orders',
                            localField: 'orders',
                            foreignField: '_id',
                            as: 'orders'
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'manager',
                            foreignField: '_id',
                            as: 'manager'
                        }
                    },
                    {
                        $lookup: {
                            from: 'conditions',
                            localField: 'status',
                            foreignField: '_id',
                            as: 'status'
                        }
                    },
                    {
                        $unwind: {
                            path: '$status'
                        }
                    },
                    {
                        $sort: { 'created': -1 }
                    },
                    {
                        $limit: 5
                    }
                ],
                as: "orders"
            }
        }, {
            $facet: {
                clients: [{
                        $match: myMatch
                    }, {
                        $lookup: {
                            from: 'regions',
                            localField: 'region',
                            foreignField: "_id",
                            as: 'region'
                        }
                    }, {
                        $unwind: {
                            path: '$region'
                        }
                    }, {
                        $skip: 15 * page
                    }, {
                        $limit: 15
                    }, {
                        $group: {
                            _id: '$_id',
                            client: {
                                $mergeObjects: '$$ROOT'
                            },
                            total: {
                                $sum: {
                                    $sum: '$$ROOT.orders.sum'
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: '$_id',
                            surname: '$client.surname',
                            name: '$client.name',
                            lastname: '$client.lastname',
                            phone: '$client.phone',
                            email: '$client.email',
                            region: '$client.region',
                            orders: '$client.orders',
                            createdAt: '$client.createdAt',
                            total: '$total',
                            balance: '$client.balance',
                            company: '$client.company'
                        }
                    }, {
                        $sort: {
                            'createdAt': -1
                        }
                    },
                ],
                totalCost: [{
                    $match: myMatch
                }, {
                    $group: {
                        _id: null,
                        cost: {
                            $sum: {
                                $sum: '$$ROOT.orders.sum'
                            }
                        }
                    }
                }],
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

        let countClients = await Corporates.find(myMatch).countDocuments()

        let result = {
            clients: clients ? clients[0].clients : [],
            count: clients ? clients[0].count[0] ? clients[0].count[0].count : 0 : 0,
            countClients: countClients,
            totalCost: clients ? clients[0].totalCost[0] ? clients[0].totalCost[0].cost : 0 : 0
        }
        
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

exports.addCorporate = async (req, res, next) => {
    try {
        let { user, company } = req.body

        const newClient = await new Corporates({ ...user, company })
        const password = generator.generate({
            length: 8,
            numbers: true
        });

        console.log(password)

        newClient.password = await generatePassword(password);

        let token = generateTokenForClient({
            phone: newClient.phone
        });

        let refresh = generateRefreshTokenForClient({
            phone: newClient.phone,
        });

        newClient.token = token
        newClient.refresh = refresh

        console.log(newClient)

        const sendResult = await smsRu.sendSms({
            to: newClient.phone,
            from: "TD-CSK-SHOP",
            msg: `Логин: ${newClient.phone}\r\nПароль для входа: ${password}`,
        });

        await newClient.save()

        res.status(201).json({
            message: "ADDED",
            client: newClient
        })
    } catch (error) {
        next(error)
    }
}

exports.authLogin = async(req, res, next) => {
    try {
        const phone = req.body.phone
        const password = req.body.password
        const client = await Corporates.findOne({ phone: phone })

        if (!client) {
            res.status(404).json({ message: "NOT FOUND" })
            return
        }

        const compare = await comparePasswords(password, client.password)

        if (!compare) {
            res.status(401).json({ message: "UNAUTHORIZED" })
            return
        }

        let token = generateTokenForClient({ _id: client._id, email: client.email })
        let refresh = generateRefreshTokenForClient({ _id: client._id, email: client.email })

        await client.updateOne({ token: token, refresh: refresh })
        console.log(token)
        res.status(200).json({ message: 'OK', id: client._id, token, refresh })
    } catch (error) {
        next(error)
    }
}

exports.refreshToken = async(req, res, next) => {
    try {
        const id = req.body.clientId
        const refresh = req.body.refresh
        const client = await Corporates.findOne({ _id: id }).lean()

        if (!client) {
            res.status(404).json({ message: "NOT FOUND" })
        }

        if (refresh !== client.refresh) {
            await client.updateOne({ token: null, refresh: null })
            res.status(401).json({
                message: "UNAUTHORIZED"
            })
        }

        console.log("Обновление токена")

        let newToken = generateToken({ _id: client._id, email: client.email })
        let newRefresh = generateRefreshToken({ _id: client._id, email: client.email })
        await client.updateOne({ token: newToken, refresh: newRefresh })
        res.status(200).json({ message: 'OK', token, refresh })
    } catch (error) {
        next(error)
    }
}

exports.updateCorporate = async (req, res, next) => {
    try {
        let { user, company } = req.body
        console.log(req.body)
        let corporate = await corporates.findById(user._id)

        await corporate.updateOne({...user, company});

        let updatedCorporate = await Corporates.findById(user._id).populate('region').select('_id surname name lastname phone email region orders createdAt balance company').lean()

        res.status(200).json({ message: 'OK', corporate: updatedCorporate })
    } catch (error) {
        next(error)
    }
}


exports.deleteCorporate = async (req, res, next) => {
    try {
        let { clientId } = req.body

        const deletedOrder = await Orders.updateOne({
            client: mongoose.Types.ObjectId(clientId)
        }, {
            $set: {
                'deleted': true
            }
        })

        const deletedCorporate = await corporates.updateOne({
            _id: mongoose.Types.ObjectId(clientId)
        }, {
            $set: {
                'deleted': true
            }
        })


        res.status(200).json({ 
            message: 'OK', 
            client: {
                _id: clientId
            } 
        })
    } catch (error) {
        next(error)
    }
}