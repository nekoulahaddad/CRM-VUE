const mongoose = require('mongoose')
const cachegoose = require('cachegoose');
const Categories = require('../models/categories')
const Brands = require('../models/brands')
const Products = require('../models/products')
const path = require('path')

const _ = require('lodash')
const { v4: uuidv4 } = require('uuid')
const { translit } = require('gost-transliteration')

const {
    PRODUCTS_PATH,
    TEMP_PATH,
    BRANDS_PATH
} = require('../utils/path')

const {
    uploadFilesFromTempToFolder,
    makeUserDir,
    removeUserDir,
    removeDir,
    deleteUserUploadedFile,
    copyFolderRecursively
} = require('../utils/fs')

exports.getBrandsProducts = async(req, res, next) => {
    try {
        const region = req.body.options.region
        const parent_value = req.body.options.parent_value
        const page = +req.query.page - 1
        console.log(page)
        console.log(req.body)
        let brand = await Brands.aggregate([{
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
                                        '$$el.brand.slug',
                                        parent_value
                                    ],
                                }
                            ]
                        }
                    },
                },
            }
        }, {
            $unwind: {
                path: '$results'
            }
        }, {
            $group: {
                _id: 0,
                parent_id: {
                    $addToSet: '$results.brand._id'
                }
            }
        }, {
            $unwind: {
                path: '$parent_id'
            }
        }])
        console.log(brand[0])
        let brand_id = mongoose.Types.ObjectId(brand[0].parent_id)

        let products = await Products.aggregate(
            [{
                $match: {
                    "regions.product.brand_id": mongoose.Types.ObjectId(brand_id),
                    "regions.region": mongoose.Types.ObjectId(region)
                }
            }, {
                $skip: 15 * page
            }, {
                $limit: 15
            }, {
                $project: {
                    results: {
                        $filter: {
                            input: '$regions',
                            as: 'el',
                            cond: {
                                '$eq': [
                                    '$$el.region',
                                    mongoose.Types.ObjectId(region)
                                ],
                            }
                        },
                    }
                }
            }, {
                $unwind: {
                    path: '$results',
                }
            }, {
                $lookup: {
                    from: 'providers',
                    localField: 'results.product.providers',
                    foreignField: '_id',
                    as: 'results.product.providers'
                }
            }, {
                $group: {
                    _id: 0,
                    products: {
                        $push: '$results.product'
                    }
                }
            }, {
                $replaceRoot: {
                    newRoot: {
                        products: "$products"
                    }
                }
            }]
        )

        if (products && products[0]) {
            let count = await Products.find({
                "regions.product.brand_id": mongoose.Types.ObjectId(brand_id),
                "regions.region": mongoose.Types.ObjectId(region)
            }).lean().countDocuments()
            products[0].count = count
        }
        let productsList = products && products[0] ? products[0].products : []
        let count = products && products[0] ? products[0].count : 0

        res.status(200).json({
            categories: [],
            brands: [],
            products: productsList,
            count: count
        })
    } catch (err) {
        console.log(err)
    }
}

exports.addBrand = async(req, res, next) => {
    try {
        // Получаем данные
        const {
            region,
            name,
            parent_value
        } = req.body

        const images = req.files
        console.log(req.body)
        let exist = false

        // Находим родительскую категорию
        const parent = await Categories.aggregate([{
            $project: {
                results: {
                    $filter: {
                        input: '$regions',
                        as: 'el',
                        cond: {
                            $and: [{
                                    $eq: [
                                        '$$el.region',
                                        mongoose.Types.ObjectId(region)
                                    ]
                                },
                                {
                                    $eq: [
                                        '$$el.category.cSlug',
                                        parent_value
                                    ]
                                }
                            ]

                        }
                    },
                }
            },
        }, {
            $unwind: {
                path: '$results'
            }
        }, {
            $group: {
                _id: "$_id",
                results: {
                    $addToSet: '$results.category'
                }
            }
        }])

        const brand = {
            _id: mongoose.Types.ObjectId(),
            name: name,
            category_id: mongoose.Types.ObjectId(parent[0].results[0]._id),
            updates: []
        }
        brand.slug = translit(_.kebabCase(brand.name)).replace(/'/g, '').toLowerCase()
        brand.meta = {
            title: brand.title,
            keywords: brand.title,
            description: brand.title
        }
        req.brandSlug = brand.slug

        console.log(req.brandSlug)

        // Ищем похожие товары данной категории среди всех регионов
        const matchedBrands = await Brands.aggregate([{
            $project: {
                results: {
                    $filter: {
                        input: '$regions',
                        as: 'el',
                        cond: {
                            $eq: [
                                '$$el.brand.slug',
                                brand.slug
                            ]
                        }
                    },
                }
            },
        }, {
            $unwind: {
                path: '$results'
            }
        }, {
            $group: {
                _id: "$_id",
                results: {
                    $addToSet: '$results.brand'
                }
            }
        }])
        console.log('??? matched brands')
        console.log(matchedBrands)

        // Если совпадений нет - добавляем
        if (!matchedBrands.length) {
            console.log("NOT MATCHED");
            if (images.brandImage) {
                // Image
                brand.img = ''
                await makeUserDir(BRANDS_PATH, `${region}/${brand.slug}`)
                await uploadFilesFromTempToFolder(TEMP_PATH, BRANDS_PATH, images.brandImage[0].filename, `${region}/${brand.slug}`)
                brand.img = images.brandImage[0].filename
                brand.path = `/uploads/brands/`
            }
            // Создаем категорию
            const newBrand = await Brands.create({
                regions: [{
                    region: mongoose.Types.ObjectId(region),
                    brand: brand
                }]
            })

            await newBrand.save()
            console.log(newBrand)
        } else {
            console.log("MATCHED");
            brand._id = mongoose.Types.ObjectId(matchedBrands[0].results[0]._id)
                // Иначе у нас есть совпадения - добавляем в эту категорию регион
            let currentBrand = await Brands.aggregate([{
                $project: {
                    results: {
                        $filter: {
                            input: '$regions',
                            as: 'el',
                            cond: {
                                $and: [{
                                        $eq: [
                                            '$$el.region',
                                            mongoose.Types.ObjectId(region)
                                        ]
                                    },
                                    {
                                        $regexFind: {
                                            input: '$$el.brand.name',
                                            regex: new RegExp('^' + name + '$', 'i')
                                        }
                                    }
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
                $project: {
                    brand: {
                        _id: '$_id',
                        brand: '$results.brand.name',
                    }
                }
            }])

            // Если в таком регионе нет такой категории 
            if (!currentBrand.length) {
                if (images.brandImage) {
                    // Image
                    brand.img = ''
                    await makeUserDir(BRANDS_PATH, `${region}/${brand.slug}`)
                    await uploadFilesFromTempToFolder(TEMP_PATH, BRANDS_PATH, images.brandImage[0].filename, `${region}/${brand.slug}`)
                    brand.img = images.brandImage[0].filename
                    brand.path = `/uploads/brands/`
                }
                // Обновляем категорию категорию
                console.log(matchedBrands)
                console.log(brand)
                const updatedBrand = await Brands.updateOne({
                    '_id': mongoose.Types.ObjectId(matchedBrands[0]._id)
                }, {
                    $push: {
                        regions: {
                            region: mongoose.Types.ObjectId(region),
                            brand: brand
                        }
                    }
                })
            } else {
                exist = true
            }
        }

        console.log("///////////////////////")
        console.log("New Brand")
        console.log("///////////////////////")
        res.status(201).json({
            message: "ADDED",
            exist: exist,
            brand: brand
        })
    } catch (error) {
        console.log(req.brandSlug)
        next(error)
    }
}

exports.editBrand = async(req, res, next) => {
    try {
        const {
            region,
            brandId,
            name,
        } = req.body

        const images = req.files
        console.log(req.body)

        // Находим родительскую категорию
        // const parent = await Categories.aggregate([{
        //     $project: {
        //         results: {
        //             $filter: {
        //                 input: '$regions',
        //                 as: 'el',
        //                 cond: {
        //                     $and: [{
        //                             $eq: [
        //                                 '$$el.region',
        //                                 mongoose.Types.ObjectId(region)
        //                             ]
        //                         },
        //                         {
        //                             $eq: [
        //                                 '$$el.category.cSlug',
        //                                 parent_value
        //                             ]
        //                         }
        //                     ]

        //                 }
        //             },
        //         }
        //     },
        // }, {
        //     $unwind: {
        //         path: '$results'
        //     }
        // }, {
        //     $group: {
        //         _id: "$_id",
        //         results: {
        //             $addToSet: '$results.category'
        //         }
        //     }
        // }])

        // console.log(parent[0].results[0])

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
                                        mongoose.Types.ObjectId(region.toString())
                                    ],
                                },
                                {
                                    '$eq': [
                                        '$$el.brand._id',
                                        mongoose.Types.ObjectId(brandId)
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

        console.log(updatedBrand[0])
        const brand = updatedBrand[0].brand[0]
        let oldSlug = brand.slug

        if (brand.slug === translit(_.kebabCase(name)).replace(/'/g, '').toLowerCase() && brand.name !== name) {
            brand.name = name
        }

        if (name && oldSlug !== translit(_.kebabCase(name)).replace(/'/g, '').toLowerCase()) {
            console.log("////////////////////////// in cond")
            brand.name = name
            brand.slug = translit(_.kebabCase(brand.name)).replace(/'/g, '').toLowerCase()
            await makeUserDir(BRANDS_PATH, `${region}/${oldSlug}`)
            await makeUserDir(BRANDS_PATH, `${region}/${brand.slug}`)
            await copyFolderRecursively(path.join(`${BRANDS_PATH}/${region}/${oldSlug}`), path.join(`${BRANDS_PATH}/${region}/${brand.slug}`))
            await removeUserDir(BRANDS_PATH, `${region}/${oldSlug}`)
        }

        // brand.updates.push({
        //     user: mongoose.Types.ObjectId(req.userId)
        // })

        if (images.brandImage && images.brandImage[0]) {
            brand.img = ''
            await removeUserDir(BRANDS_PATH, `${region}/${brand.slug}`)
            await makeUserDir(BRANDS_PATH, `${region}/${brand.slug}`)
            await uploadFilesFromTempToFolder(TEMP_PATH, BRANDS_PATH, images.brandImage[0].filename, `${region}/${brand.slug}`)
            brand.img = images.brandImage[0].filename
            brand.path = `/uploads/brands/`
        }


        console.log(brand)

        const updatedBrandDB = await Brands.findOneAndUpdate({
            '_id': mongoose.Types.ObjectId(updatedBrand[0]._id),
            'regions.region': mongoose.Types.ObjectId(region)
        }, {
            $set: {
                'regions.$.brand': brand,
            }
        }).lean()



        console.log("///////////////////////")
        console.log("Updated Brand")
        console.log(updatedBrandDB)
        console.log("///////////////////////")
        res.status(201).json({
            message: "EDITED",
            brand: brand
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteBrand = async(req, res, next) => {
    try {
        const brandId = req.body.brandId
        const region = req.body.region
        console.log(req.body)

        const deletedBrandData = await Brands.aggregate([{
            $project: {
                results: {
                    $filter: {
                        input: '$regions',
                        as: 'el',
                        cond: {
                            $and: [{
                                    '$eq': [
                                        '$$el.region',
                                        mongoose.Types.ObjectId(region.toString())
                                    ],
                                },
                                {
                                    '$eq': [
                                        '$$el.brand._id',
                                        mongoose.Types.ObjectId(brandId)
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

        const deletedBrand = await Brands.updateMany({}, {
            $pull: {
                regions: {
                    region: mongoose.Types.ObjectId(region),
                    'brand._id': mongoose.Types.ObjectId(brandId)
                }
            }
        })

        const deletedProducts = await Products.updateMany({}, {
            $pull: {
                regions: {
                    region: mongoose.Types.ObjectId(region),
                    'product.brand_id': mongoose.Types.ObjectId(brandId)
                }
            }
        })
        console.log("deletedBrandData[0]")
        console.log(deletedBrandData[0])
        console.log(deletedBrand)

        console.log("///////////////////////")
        console.log("Deleted Brand")
        console.log(brandId)
        console.log("///////////////////////")
        res.status(201).json({
            message: "DELETED",
            brand: {
                _id: brandId
            }
        })
    } catch (error) {
        next(error)
    }
}