require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server = require("http").createServer(app);

const Brands = require('./models/brands')
const Categories = require('./models/categories')
const Products = require('./models/products')
const Tasks = require('./models/tasks')
const Status = require('./models/status')
const Regions = require('./models/regions')
const User = require('./models/user')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const xl = require('excel4node')

const { copyFile, makeUserDir, makeDir } = require('./utils/fs')
const {
    BRANDS_PATH,
    CATEGORIES_PATH,
    PRODUCTS_PATH
} = require('./utils/path');


let regionsList = []

// StartApp
const startApp = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            poolSize: 8,
        });
        let regions = await Regions.find()
        console.log(regions)
        regionsList = regions.map((item) => item._id)
        server.listen(8079);

        console.log("Successfully started at port:" + 8079);
    } catch (error) {
        console.log("[Error]", error);
        process.exit(404);
    }
};

const setCategoriesVisibility = async() => {
    try {
        for (let i = 0; i < regionsList.length; i++) {
            let region = regionsList[i];
            console.log(i)
                // вывести бренды
            let categoriesList = await Categories.aggregate(
                [{
                    $match: {
                        "regions.region": mongoose.Types.ObjectId(region)
                    }
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
                    $group: {
                        _id: 0,
                        categories: {
                            $push: '$results.category'
                        }
                    }
                }, {
                    $replaceRoot: {
                        newRoot: {
                            categories: "$categories"
                        }
                    }
                }]
            )

            let categories = categoriesList[0].categories
            if (categories) {
                for (let i = 0; i < categories.length; i++) {
                    const category = categories[i];
                    category.visible = true
                    const updatedCategoriesDB = await Categories.findOneAndUpdate({
                        "regions.category._id": mongoose.Types.ObjectId(category._id),
                        "regions.region": mongoose.Types.ObjectId(region),
                    }, {
                        $set: {
                            "regions.$.category": category,
                        },
                    })
                }
            }
        }

    } catch (error) {
        console.log("[Error]", error);
    }
}

const setCategoriesBanner = async() => {
    try {
        for (let i = 0; i < regionsList.length; i++) {
            let region = regionsList[i];
            console.log(i)
                // вывести бренды
            let categoriesList = await Categories.aggregate(
                [{
                    $match: {
                        "regions.region": mongoose.Types.ObjectId(region)
                    }
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
                    $group: {
                        _id: 0,
                        categories: {
                            $push: '$results.category'
                        }
                    }
                }, {
                    $replaceRoot: {
                        newRoot: {
                            categories: "$categories"
                        }
                    }
                }]
            )

            let categories = categoriesList[0].categories
            if (categories) {
                for (let i = 0; i < categories.length; i++) {
                    const category = categories[i];
                    const updatedCategoriesDB = await Categories.findOneAndUpdate({
                        "regions.category._id": mongoose.Types.ObjectId(category._id),
                        "regions.region": mongoose.Types.ObjectId(region),
                        "regions.category.banner": 'defaultBanner.png'
                    }, {
                        $set: {
                            "regions.$.category.banner": 'defaultBanner.png',
                            "regions.$.category.bannerPath": '/uploads/',
                        },
                    })
                }
            }
        }

    } catch (error) {
        console.log("[Error]", error);
    }
}

const transferImages = async() => {
    try {
        for (let i = 0; i < regionsList.length; i++) {
            let region = regionsList[i];
            await makeUserDir(__dirname, `uploads/catalog/${region}/categories`)

            // вывести бренды
            let categoriesList = await Categories.aggregate(
                [{
                    $match: {
                        "regions.region": mongoose.Types.ObjectId(region)
                    }
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
                    $group: {
                        _id: 0,
                        categories: {
                            $push: '$results.category'
                        }
                    }
                }, {
                    $replaceRoot: {
                        newRoot: {
                            categories: "$categories"
                        }
                    }
                }]
            )

            let categories = categoriesList[0].categories

            for (let c = 0; c < categories.length; c++) {
                let category = categories[c]
                let dirPath = `uploads/catalog/${region}/categories/${category._id}`
                await makeUserDir(__dirname, dirPath)

                if (await fs.existsSync(path.join(CATEGORIES_PATH, `${region}/${category.cSlug}/${category.img}`))) {
                    // console.log('HAS IMG')

                    await copyFile(path.join(CATEGORIES_PATH, `${region}/${category.cSlug}/${category.img}`), path.join(`/var`, `www/crm/uploads/catalog/${region}/categories/${category._id}`, `${category.img}`))
                    category.path = `/uploads/catalog/${region}/categories/${category._id}/`
                    category.img = `${category.img}`
                } else {
                    category.path = `/uploads/`
                    category.img = `default.jpeg`
                }
                if (await fs.existsSync(path.join(CATEGORIES_PATH, `${region}/${category.cSlug}/${category.icon}`))) {
                    // console.log('HAS ICON')
                    await copyFile(path.join(CATEGORIES_PATH, `${region}/${category.cSlug}/${category.icon}`), path.join(`/var`, `www/crm/uploads/catalog/${region}/categories/${category._id}/${category.icon}`))
                    category.iconPath = `/uploads/catalog/${region}/categories/${category._id}/`
                    category.icon = `${category.icon}`
                } else {
                    category.iconPath = `/uploads/`
                    category.icon = `defaultIcon.jpeg`
                }
                if (await fs.existsSync(path.join(CATEGORIES_PATH, `${region}/${category.cSlug}/${category.banner}`))) {
                    // console.log('HAS BANNER')
                    await copyFile(path.join(CATEGORIES_PATH, `${region}/${category.cSlug}/${category.banner}`), path.join(`/var`, `www/crm/uploads/catalog/${region}/categories/${category._id}/${category.banner}`))
                    category.bannerPath = `/uploads/catalog/${region}/categories/${category._id}/`
                    category.banner = `${category.banner}`
                } else {
                    category.bannerPath = `/uploads/`
                    category.banner = `defaultBanner.jpeg`
                }
                if (await fs.existsSync(path.join(CATEGORIES_PATH, `${region}/${category.cSlug}/${category.slide}`))) {
                    // console.log('HAS SLIDE')
                    await copyFile(path.join(CATEGORIES_PATH, `${region}/${category.cSlug}/${category.slide}`), path.join(`/var`, `www/crm/uploads/catalog/${region}/categories/${category._id}/${category.slide}`))
                    category.slidePath = `/uploads/catalog/${region}/categories/${category._id}/`
                    category.slide = `${category.slide}`
                } else {
                    category.slidePath = `/uploads/`
                    category.slide = `default.jpeg`
                }
                console.log(category)
                let productsList = await Products.aggregate(
                    [{
                            $match: {
                                "regions.product.category_id": mongoose.Types.ObjectId(category._id),
                                "regions.region": mongoose.Types.ObjectId(region)
                            }
                        },
                        {
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
                                                        '$$el.product.category_id',
                                                        mongoose.Types.ObjectId(category._id)
                                                    ],
                                                }
                                            ]
                                        }
                                    },
                                }
                            }
                        }, {
                            $unwind: {
                                path: '$results',
                            }
                        }, {
                            $group: {
                                _id: 0,
                                products: {
                                    $push: '$results.product'
                                }
                            }
                        },
                        {
                            $replaceRoot: {
                                newRoot: {
                                    products: "$products"
                                }
                            }
                        }
                    ])

                let products = productsList && productsList[0] ? productsList[0].products : []
                if (products.length) {
                    for (let p = 0; p < products.length; p++) {
                        let product = products[p]
                        await makeUserDir(__dirname, `uploads/catalog/${region}/categories/${product.category_id}/${product._id}`)
                        if (product.images.length) {
                            for (let im = 0; im < product.images.length; im++) {
                                let img = product.images[im]
                                if (await fs.existsSync(path.join(PRODUCTS_PATH, `${region}/${product.slug}/${img}`))) {
                                    // console.log('HAS SLIDE')
                                    await copyFile(path.join(PRODUCTS_PATH, `${region}/${product.slug}/${img}`), path.join(`/var`, `www/crm/uploads/catalog/${region}/categories/${product.category_id}/${product._id}/${img}`))
                                    product.path = `/uploads/catalog/${region}/categories/${category._id}/${product._id}/`
                                    product.images[im] = `${img}`
                                } else {
                                    product.path = `/uploads/`
                                    product.images = [`default.jpeg`]
                                }
                            }
                        } else {
                            product.path = `/uploads/`
                            product.images = [`default.jpeg`]
                        }
                        console.clear()
                        console.log(`Регион ${i + 1} из ${regionsList.length}`)
                        console.log(`Категория ${c + 1} из ${categories.length}`)
                        console.log(`Товар ${p + 1} из ${products.length}`)

                        const updatedProductsDB = await Products.findOneAndUpdate({
                            "regions.product._id": mongoose.Types.ObjectId(product._id),
                            "regions.region": mongoose.Types.ObjectId(region),
                        }, {
                            $set: {
                                "regions.$.product": product,
                            },
                        })
                    }
                }
                const updatedCategoriesDB = await Categories.findOneAndUpdate({
                    "regions.category._id": mongoose.Types.ObjectId(category._id),
                    "regions.region": mongoose.Types.ObjectId(region),
                }, {
                    $set: {
                        "regions.$.category": category,
                    },
                })
            }
        }

    } catch (error) {
        console.log(error)
    }
}

const deleteTestRegionCategoriesAndProducts = async() => {
    try {
        let region = '5fec6d02797ee552f4a9fe1f'
        const updatedCategories = await Categories.updateMany({
            'regions.region': mongoose.Types.ObjectId(region)
        }, {
            $pull: {
                regions: {
                    'region': mongoose.Types.ObjectId(region)
                }
            }
        })
        const updatedProducts = await Products.updateMany({
            'regions.region': mongoose.Types.ObjectId(region)
        }, {
            $pull: {
                regions: {
                    'region': mongoose.Types.ObjectId(region)
                }
            }
        })
        process.exit()
    } catch (error) {
        console.log("[Error]", error);
    }
}

const setBuyedOfProducts = async() => {
    try {
        let articlesArr = [
                95463,
                96474,
                95789,
                94910,
                94903,
                18912,
                91927,
                64473,
                64459,
                63350,
                86836,
                95482,
                91973
            ]
            // let setCategory = '5fb376575225b630baf8461d'
        let setCategory = ['5fb3765e5225b630baf846ac']
        let region = '5f85ba274a9a5d34e0a45fed'
        for (let i = 0; i < setCategory.length; i++) {
            const category = setCategory[i];

            let productsList = await Products.aggregate()
                .match({
                    "regions.product.category_id": mongoose.Types.ObjectId(category),
                    "regions.region": mongoose.Types.ObjectId(region)
                })
                .project({
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
                })
                .unwind({
                    path: '$results',
                })
                .group({
                    _id: 0,
                    products: {
                        $push: '$results.product'
                    }
                })
                .replaceRoot({
                    products: "$products"
                })
            console.log(productsList)
            let products = productsList[0].products
            let articlesProductsList = await Products.aggregate()
                .match({
                    "regions.product.article": { $in: articlesArr },
                    "regions.region": mongoose.Types.ObjectId(region)
                })
                .project({
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
                })
                .unwind({
                    path: '$results',
                })
                .group({
                    _id: 0,
                    products: {
                        $push: { _id: mongoose.Types.ObjectId(), title: '$results.product.title', product_id: '$results.product._id' }
                    }
                })
                .replaceRoot({
                    products: "$products"
                })

            let articlesProducts = articlesProductsList[0].products
            for (let i = 0; i < products.length; i++) {
                let product = products[i]
                console.log(product)
                product.buyed = articlesProducts

                const updatedProductsDB = await Products.findOneAndUpdate({
                    "regions.product._id": mongoose.Types.ObjectId(product._id),
                    "regions.region": mongoose.Types.ObjectId(region),
                }, {
                    $set: {
                        "regions.$.product": product,
                    },
                })
            }
            // console.log(products)
            console.log(articlesProducts)
            console.log("Complete!")
        }


    } catch (error) {
        console.log("[Error]", error);
        process.exit(404);
    }
};

const removeProductBuyed = async() => {
    try {

        let setCategory = ['5fb3765e5225b630baf846ac']
        let region = '5f85ba274a9a5d34e0a45fed'
        for (let i = 0; i < setCategory.length; i++) {
            const category = setCategory[i];

            let productsList = await Products.aggregate()
                .match({
                    "regions.product.category_id": mongoose.Types.ObjectId(category),
                    "regions.region": mongoose.Types.ObjectId(region)
                })
                .project({
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
                })
                .unwind({
                    path: '$results',
                })
                .group({
                    _id: 0,
                    products: {
                        $push: '$results.product'
                    }
                })
                .replaceRoot({
                    products: "$products"
                })
            console.log(productsList)
            let products = productsList[0].products

            for (let i = 0; i < products.length; i++) {
                let product = products[i]
                console.log(product)
                product.options = []

                const updatedProductsDB = await Products.findOneAndUpdate({
                    "regions.product._id": mongoose.Types.ObjectId(product._id),
                    "regions.region": mongoose.Types.ObjectId(region),
                }, {
                    $set: {
                        "regions.$.product": product,
                    },
                })
            }
            // console.log(products)
            console.log("Complete!")
        }


    } catch (error) {
        console.log("[Error]", error);
        process.exit(404);
    }
};

const setTasksInitiator = async() => {
    try {
        let tasks = await Tasks.updateMany({}, {
            $set: {
                initiator: mongoose.Types.ObjectId('5f86b50f05ff3f1ef4cf4912')
            }
        })
    } catch (error) {
        console.log(error)
        process.exit(404);
    }
}

const getExcelFromTasks = async (req, res, next) => {
    try {
        let wb = new xl.Workbook();
        let ws = wb.addWorksheet('Задачи');
        let tasks = await Tasks.find()
        .populate({path: 'status'})
        .populate({path: 'initiator', select: '_id name surname lastname'})
        .populate({path: 'executor', select: '_id name surname lastname'})
        console.log(tasks[0])
        if(tasks && tasks.length){
            let globalStyle = {
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                },
            }

            ws.cell(1, 1)
            .string('Название')
            .style(globalStyle)
            ws.cell(1, 2)
            .string('Описание')
            .style(globalStyle)
            ws.cell(1, 3)
            .string('Автор')
            .style(globalStyle)
            ws.cell(1, 4)
            .string('Исполнитель')
            .style(globalStyle)
            ws.cell(1, 5)
            .string('Дата создания')
            .style(globalStyle)
            ws.cell(1, 6)
            .string('Дедлайн')
            .style(globalStyle)
            ws.cell(1, 7)
            .string('Статус')
            .style(globalStyle)
            ws.cell(1, 8)
            .string('Комментарий')
            .style(globalStyle)
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                if(task.title !== null && task.title !== 'null' && task.title !== undefined){
                    ws.cell(i + 2, 1)
                    .string(task.title)
                    .style(globalStyle)
                }
                if(task.description !== null && task.description !== 'null' && task.description !== undefined){
                    ws.cell(i + 2, 2)
                    .string(task.description)
                    .style(globalStyle)
                }
                if(task.initiator !== null && task.initiator !== 'null' && task.initiator !== undefined){
                    ws.cell(i + 2, 3)
                    .string(task.initiator.surname + " " + task.initiator.name + " " + (task.initiator.lastname || ''))
                    .style(globalStyle)
                }
                if(task.executor !== null && task.executor !== 'null' && task.executor !== undefined){
                    ws.cell(i + 2, 4)
                    .string(task.executor.surname + " " + task.executor.name + " " + (task.executor.lastname || ''))
                    .style(globalStyle)
                }
                console.log(task.executor)
                if(task.creation_date !== null && task.creation_date !== 'null' && task.creation_date !== undefined){
                    ws.cell(i + 2, 5)
                    .string(moment(task.creation_date).format('DD.MM.YYYY'))
                    .style(globalStyle)
                }
                if(task.deadline_date !== null && task.deadline_date !== 'null' && task.deadline_date !== undefined){
                    ws.cell(i + 2, 6)
                    .string(moment(task.deadline_date).format('DD.MM.YYYY'))
                    .style(globalStyle)
                }
                if(task.status !== null && task.status !== 'null' && task.status !== undefined){
                    ws.cell(i + 2, 7)
                    .string(task.status.title)
                    .style(globalStyle)
                }
                if(task.comment !== null && task.comment !== 'null' && task.comment !== undefined){
                    ws.cell(i + 2, 8)
                    .string(task.comment)
                    .style(globalStyle)
                } else {
                    ws.cell(i + 2, 8)
                    .string('')
                    .style(globalStyle) 
                }
            }
            ws.column(1).setWidth(50);
            ws.column(2).setWidth(50);
            ws.column(3).setWidth(50);
            ws.column(4).setWidth(50);
            ws.column(5).setWidth(20);
            ws.column(5).setWidth(20);
            ws.column(7).setWidth(20);
            ws.column(8).setWidth(50);
        }

    wb.write(`tasks.xlsx`)
    } catch (error) {
        console.log(error)
    }
}

const deleteUserTasks = async (req, res, next) => {
    try {
        await User.updateMany({}, {
            $set: {
                tasks: []
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const setGroupProducts = async (req, res, next) => {
    try {
        for (let i = 0; i < regionsList.length; i++) {
            const region = regionsList[i];
            console.log(region)
            const updatedProducts = await Products.updateMany({
                'regions.region': mongoose.Types.ObjectId(region)
            }, {
                $set: {
                    'regions.$.product.group': false
                }
            })
        }
        // const updatedProducts = await Products.deleteMany({
        //     'regions.product.group': {
        //         $exists: false
        //     }
        // })
        console.log('final')
    } catch (error) {
        console.log(error)
    }
}

const deleteCurruptedProducts = async (req, res, next) => {
    try {
        let curruptedProducts = await Products.deleteMany({
            'regions.product.title': {
                $exists: false
            }
        })
        console.log('final')
    } catch(error) {
        console.log(error)
    }
}

const setDeletedProductsAndCategories = async (req, res, next) => {
    try {
        for (let i = 0; i < regionsList.length; i++) {
            const region = regionsList[i];
            console.log(region)
            const updatedProducts = await Products.updateMany({
                'regions.region': mongoose.Types.ObjectId(region),
            }, {
                $set: {
                    'regions.$.product.deleted': 'false',
                    'regions.$.product.group': 'false',
                }
            }, {multi: true})
            const updatedCategories = await Categories.updateMany({
                'regions.region': mongoose.Types.ObjectId(region),
            }, {
                $set: {
                    'regions.$.category.deleted': 'false',
                }
            }, {multi: true})
        }
        console.log('final')
    } catch (error) {
        console.log(error)
    }
}

const setUserDeleted = async (req, res, next) => {
    try {
        await User.updateMany({}, {
            $set: {
                deleted: false
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// init
startApp().then(async() => {
    // await transformBrandsToCategorories()
    // await transferImages()
    // await deleteTestRegionCategoriesAndProducts()
    // await setBuyedOfProducts()
    // await setTasksInitiator()
    // await setGroupProducts()
    await setDeletedProductsAndCategories()
    // await deleteUserTasks()
    // await getExcelFromTasks()
    // await removeProductBuyed()
    // await setCategoriesVisibility()
    // await setCategoriesBanner()
    // await deleteCurruptedProducts()
    // await setUserDeleted()
})