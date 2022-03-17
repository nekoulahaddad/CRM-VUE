const mongoose = require('mongoose')
const cachegoose = require('cachegoose')
const Products = require('../models/products')
const Categories = require('../models/categories')
const Brands = require('../models/brands')
const Clients = require('../models/clients')
const {Parser} = require('json2csv')
const fs = require('fs')
const path = require('path')
const {SEO_PATH} = require('../utils/path')

exports.editSeoItem = async (req, res, next) => {
    try {


        let id = req.body.id
        let type = req.body.type
        let region = req.body.region
        let title = req.body.title
        let keywords = req.body.keywords
        let description = req.body.description
        let metadescription = req.body.metadescription

        let item
        switch (type) {
            case 'categories':

                let updatedCategory = await Categories.aggregate([{
                    $project: {
                        results: {
                            $filter: {
                                input: '$regions',
                                as: 'el',
                                cond: {
                                    $and: [{
                                        '$eq': [
                                            '$$el.region',
                                            mongoose.Types.ObjectId(region)
                                        ],
                                    },
                                        {
                                            '$eq': [
                                                '$$el.category._id',
                                                mongoose.Types.ObjectId(id)
                                            ],
                                        },
                                    ]
                                }
                            },
                        }
                    }
                }, {
                    $unwind: {
                        path: '$results'
                    }
                }, {
                    $unwind: {
                        path: '$results.category'
                    }
                }, {
                    $group: {
                        _id: '$_id',
                        category: {
                            $addToSet: '$results.category'
                        }
                    }
                }])

                let category = updatedCategory[0].category[0]

                if (category && !category.meta) {
                    category.meta = {}
                }
                if (title || title === '') {
                    category.meta.title = title
                }
                if (keywords || keywords === '') {
                    category.meta.keywords = keywords
                }
                if (description || description === '') {
                    category.description = description
                }
                if (metadescription || metadescription === '') {
                    category.meta.description = metadescription
                }
                item = category
                await Categories.findOneAndUpdate({
                    '_id': mongoose.Types.ObjectId(updatedCategory[0]._id),
                    'regions.region': mongoose.Types.ObjectId(region)
                }, {
                    $set: {
                        'regions.$.category': category,
                    }
                }).lean()
                break;
            case 'brands':

                const updatedBrand = await Brands.aggregate([{
                    $project: {
                        results: {
                            $filter: {
                                input: '$regions',
                                as: 'el',
                                cond: {
                                    $and: [{
                                        '$eq': [
                                            '$$el.region',
                                            mongoose.Types.ObjectId(region)
                                        ],
                                    },
                                        {
                                            '$eq': [
                                                '$$el.brand._id',
                                                mongoose.Types.ObjectId(id)
                                            ],
                                        },
                                    ]
                                }
                            },
                        }
                    }
                }, {
                    $unwind: {
                        path: '$results'
                    }
                }, {
                    $unwind: {
                        path: '$results.brand'
                    }
                }, {
                    $group: {
                        _id: '$_id',
                        brand: {
                            $addToSet: '$results.brand'
                        }
                    }
                }])

                const brand = updatedBrand[0].brand[0]
                if (brand && !brand.meta) {
                    brand.meta = {}
                }
                if (title || title === '') {
                    brand.meta.title = title
                }
                if (keywords || keywords === '') {
                    brand.meta.keywords = keywords
                }
                if (description || description === '') {
                    brand.description = description
                }
                if (metadescription || metadescription === '') {
                    brand.meta.description = metadescription
                }
                item = brand
                await Brands.findOneAndUpdate({
                    '_id': mongoose.Types.ObjectId(updatedBrand[0]._id),
                    'regions.region': mongoose.Types.ObjectId(region)
                }, {
                    $set: {
                        'regions.$.brand': brand,
                    }
                }).lean()

                break;
            case 'products':

                const updatedProduct = await Products.aggregate([{
                    $project: {
                        results: {
                            $filter: {
                                input: "$regions",
                                as: "el",
                                cond: {
                                    $and: [{
                                        $eq: [
                                            "$$el.region",
                                            mongoose.Types.ObjectId(region),
                                        ],
                                    },
                                        {
                                            $eq: [
                                                "$$el.product._id",
                                                mongoose.Types.ObjectId(id),
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                    {
                        $unwind: {
                            path: "$results",
                        },
                    },
                    {
                        $unwind: {
                            path: "$results.product",
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            product: {
                                $addToSet: "$results.product",
                            },
                        },
                    },
                ]);

                const product = updatedProduct[0].product[0]
                if (product && !product.meta) {
                    product.meta = {}
                }
                if (title || title === '') {
                    product.meta.title = title
                }
                if (keywords || keywords === '') {
                    product.meta.keywords = keywords
                }
                if (description || description === '') {
                    product.description = description
                }
                if (metadescription || metadescription === '') {
                    product.meta.description = metadescription
                }
                item = product
                await Products.findOneAndUpdate({
                    _id: mongoose.Types.ObjectId(updatedProduct[0]._id),
                    "regions.region": mongoose.Types.ObjectId(region),
                }, {
                    $set: {
                        "regions.$.product": product,
                    },
                }).lean()

                break;
            default:
                return
        }


        res.status(200).json({
            message: "EDITED",
            type: type,
            item: item
        })
    } catch (error) {
        next(error)
    }
}

exports.getInfoAboutAllUsers = async (req, res, next) => {
    try {
        const clients = await Clients.aggregate()
            .match({
                "_id": {
                    $exists: true
                },
                // "email": {
                //     $exists: true,
                //     $ne: ""
                // },
                "phone": {
                    $exists: true
                }
            })
            .project({
                "_id": 1,
                "phone": {
                    $trim: {
                        input: "$phone", chars: "+"
                    }
                }
                // "email": {
                //     $toLower: "$email"
                // }
            })

        const correctFormatClients = clients.map(v => ({
            external_id: v._id,
            phone: v.phone.replace(/\s/g, '')
        }))

        const json2csvParser = new Parser({quote: ''})
        const csv = json2csvParser.parse(correctFormatClients)

        fs.writeFile(path.join(SEO_PATH, `/all_clients.csv`), csv, "utf8", function (err) {
            if (err) {
                console.log('Ошибка при сохранении файла')
            } else {
                console.log('Данные сохранены!')
            }
        })

        const file = path.join(SEO_PATH, `/all_clients.csv`)

        setTimeout(() => {
            global.io.to(req.userId).emit("DownloadExcel", {link: `/uploads/seo/all_clients.csv`, filename: `all_clients.csv`})
        }, 3000)

        console.log(file, "all_clients")
        res.status(200)
    } catch (error) {
        next(error)
    }
}