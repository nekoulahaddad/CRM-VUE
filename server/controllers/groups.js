const mongoose = require('mongoose')
const Groups = require('../models/groups')
const Products = require('../models/products')
const _ = require('lodash')
const {
    translit
} = require('gost-transliteration')

exports.getCategoryGroups = async (req, res, next) => {
    try {
        let { categoryId, region } = req.body

        console.log("///////////////////////")
            console.log(`Run get Category Groups ${categoryId} from region ${region}`)
            console.log(`by user: user id = ${req.userId}, user role - ${req.userRole}`)
        console.log("///////////////////////")

        let currentGroup = await Groups.aggregate()
            .match({ "regions.group.category_id": mongoose.Types.ObjectId(categoryId) }) 
            .project(
                {
                    results: {
                        $filter: {
                            input: '$regions',
                            as: 'el',
                            cond: {
                                $and: [
                                    {
                                        $eq: [ '$$el.group.category_id', mongoose.Types.ObjectId(categoryId) ]                                        
                                    },
                                    {
                                        $eq: [ '$$el.region', mongoose.Types.ObjectId(region) ]
                                    }
                                ]
                            }
                        }
                    }
                }
            )
            .unwind({ path: '$results' })
            .group(
                {
                    _id: 0,
                    groups: { $push: '$results.group' }
                }
            )

        let groups = currentGroup[0].groups
        
        res.status(200).json({message: 'OK', groups})

    } catch (error) {
        next(error)
    }
}

exports.editGroup = async (req, res, next) => {
    try {
        let { title, visible, groupId, region, groupProperties } = req.body
        console.log("///////////////////////")
            console.log(`Run edit Group ${groupId} from region ${region}`)
            console.log(`by user: user id = ${req.userId}, user role - ${req.userRole}`)
        console.log("///////////////////////")

        let currentGroup = await Groups.aggregate()
            .match({ "regions.group._id": mongoose.Types.ObjectId(groupId) }) 
            .project(
                {
                    results: {
                        $filter: {
                            input: '$regions',
                            as: 'el',
                            cond: {
                                $and: [
                                    {
                                        $eq: [ '$$el.group._id', mongoose.Types.ObjectId(groupId) ]
                                    }, 
                                    {
                                        $eq: [ '$$el.region', mongoose.Types.ObjectId(region) ]
                                    }
                                ]
                            }
                        }
                    }
                }
            )
            .unwind({ path: '$results' })

        let group = currentGroup[0].results.group
        if(group.groupProperties !== groupProperties && groupProperties && groupProperties !== 'undefined'){
            const updatedGroupOption = await Groups.findOneAndUpdate(
                {
                    "regions.group._id": mongoose.Types.ObjectId(group._id),
                    "regions.region": mongoose.Types.ObjectId(region)
                }, 
                {
                    // Изменение поля groupProperties в группе при создании группы
                    $set: { 'regions.$.group.groupProperties': groupProperties }
                }
            )
        }

        if(group.title !== title && title && title !== 'undefined'){
            const oldId = group._id
            group.title = title
            group.slug = translit(_.kebabCase(title)).replace(/'/g, "").toLowerCase()
            group._id = mongoose.Types.ObjectId()

            let groupEquilNewSlug = await Groups.aggregate()
                .match({ "regions.group.slug": group.slug })
            
            if(!groupEquilNewSlug.length){
                // Нет подходящих групп
                // Создаем новую группу

                const newgroup = await Groups.create({
                    regions: [{
                        region: mongoose.Types.ObjectId(region),
                        group: group,
                    }]
                })
                newgroup.save()

                const updatedProductsDB = await Products.updateMany(
                    {
                        "regions.product._id": { $in: group.products },
                    }, 
                    {
                        $set: { 
                            "regions.$[elem].product.group": true,
                            'regions.$[elem].product.group_id': group._id 
                        },                    
                    }, 
                    {
                        arrayFilters: [ { "elem.region":  mongoose.Types.ObjectId(region)} ]
                    }
                )   
            } else {                
                // Есть подходящие группы
                // Проверяем в конкретном регионе

                let currentGroupInRegion = await Groups.aggregate()
                    .match({ "regions.group.slug": group.slug })
                    .project(
                        {
                            results: {
                                $filter: {
                                    input: '$regions',
                                    as: 'el',
                                    cond: {
                                        $and: [
                                            {
                                                $eq: [ '$$el.group.slug', group.slug ]
                                            }, 
                                            {
                                                $eq: [ '$$el.region', mongoose.Types.ObjectId(region) ]
                                            }
                                        ]
                                        
                                    }
                                }
                            }
                        }
                    )
                    .unwind({ path: '$results' })

                if(!currentGroupInRegion.length){
                    // Есть похожая группа, но не в данном регионе

                    const updatedGroupDB = await Groups.findOneAndUpdate(
                        {
                            "regions.group.slug": group.slug,
                        }, 
                        {
                            $push: {
                                regions: {
                                    region: mongoose.Types.ObjectId(region),
                                    group: group
                                }
                            },
                        }
                    )

                    const updatedProductsDB = await Products.updateMany(
                        {
                            "regions.product._id": { $in: group.products },
                        }, 
                        {
                            $set: { 
                                "regions.$[elem].product.group": true,
                                'regions.$[elem].product.group_id': group._id 
                            },                    
                        }, 
                        {
                            arrayFilters: [ { "elem.region":  mongoose.Types.ObjectId(region)} ]
                        }
                    )                     
                } else {
                    // Выдаем ошибку о полном совпадении

                    return res.status(403).json({message: 'Группа уже существует в данном регионе!'})                    
                }
            }

            const deleteRegionFromGroup = await Groups.findOneAndUpdate(
                {
                    "regions.group._id": mongoose.Types.ObjectId(oldId),            
                }, 
                {
                    $pull: { 'regions': { "region": mongoose.Types.ObjectId(region) } }
                }
            )

            const deleteGroupIsRegionsEmpty = await Groups.deleteMany(
                {
                    "regions": { $size: 0 }
                }
            )
        }

        if(visible !== 'undefined' && (visible === true || visible === false)){
            group.visible = visible
            const updatedGroupDB = await Groups.findOneAndUpdate(
                {
                    "regions.group._id": mongoose.Types.ObjectId(group._id),
                    "regions.region": mongoose.Types.ObjectId(region)
                }, 
                {
                    $set: { 'regions.$.group.visible': visible }
                }
            )

            const updatedProductsDB = await Products.updateMany(
                {
                    "regions.product.group_id": mongoose.Types.ObjectId(group._id),
                }, 
                {
                    $set: { 'regions.$[elem].product.visible': visible,
                    'regions.$[elem].product.groupProperties': groupProperties }                 
                }, 
                {
                    arrayFilters: [ { "elem.region":  mongoose.Types.ObjectId(region)} ]
                }
            )
        }
        if(group.groupProperties !== groupProperties && groupProperties && groupProperties !== 'undefined'){
            await Products.updateMany(
                {
                    "regions.product._id": { $in: group.products },
                }, 
                {
                    $set: { 'regions.$[elem].product.groupProperties': groupProperties },
                },
                {
                    arrayFilters: [ { "elem.region":  mongoose.Types.ObjectId(region)} ]
                }
            )
        }

        res.status(200).json({message: 'OK', group})
    } catch (error) {
        next(error)
    }
}

exports.addGroup = async (req, res, next) => {
    try {
        let { title, region, products, category_id, groupProperties } = req.body

        console.log("///////////////////////")
            console.log(`Run add Group ${category_id} from region ${region}`)
            console.log(`by user: user id = ${req.userId}, user role - ${req.userRole}`)

        console.log("///////////////////////")

        const slug = translit(_.kebabCase(title)).replace(/'/g, "").toLowerCase()

        const currentGroup = await Groups.aggregate()
            .match({ "regions.group.slug": slug })

        let group = {
            _id: mongoose.Types.ObjectId(),
            title,
            slug,
            products: [],
            category_id: mongoose.Types.ObjectId(category_id),
            groupProperties
        }
        products.forEach( (prod_id)=> group.products.push(mongoose.Types.ObjectId(prod_id)) )    
        
        //Нет подходящих групп
        if(!currentGroup.length){
            const newgroup = await Groups.create(
                {
                    regions: [
                        {
                            region: mongoose.Types.ObjectId(region),
                            group: group,
                        }
                    ]
                }
            )
            newgroup.save()
        } else {
            // Есть подходящие группы            
            let currentGroupInRegion = await Groups.aggregate()
                .match({ "regions.group.slug": slug })
                .project(
                    {
                        results: {
                            $filter: {
                                input: '$regions',
                                as: 'el',
                                cond: {
                                    $and: [
                                        {
                                            $eq: [ '$$el.group.slug', slug ]
                                        }, 
                                        {
                                            $eq: [ '$$el.region', mongoose.Types.ObjectId(region) ]
                                        }
                                    ]                                    
                                }
                            }
                        }
                    }
                )
                .unwind({ path: '$results' })

            if(!currentGroupInRegion.length){
                // Есть похожая группа, но не в данном регионе
                const updatedGroupDB = await Groups.findOneAndUpdate(
                    {
                        "regions.group.slug": slug,
                    }, 
                    {
                        $push: {
                            regions: {
                                region: mongoose.Types.ObjectId(region),
                                group: group
                            }
                        },
                    }
                )
            } else {
                // Выдаем ошибку о полном совпадении
                return res.status(400).json({message: 'Группа уже существует в данном регионе!'})                
            }
        }

        const updatedProductsDB = await Products.updateMany(
            {
                "regions.product._id": { $in: group.products },
            }, 
            {
                $set: { 
                    'regions.$[elem].product.group': true,
                    'regions.$[elem].product.group_id': group._id,
                    // Добавление нового поля в товар
                    'regions.$[elem].product.groupProperties': groupProperties,
                },                
            }, 
            {
                arrayFilters: [ { "elem.region":  mongoose.Types.ObjectId(region)} ]
            }
        )

        res.status(200).json()
    } catch (error) {
        next(error)
    }
}

exports.removeProductFromGroup = async (req, res, next) => {
    try {
        let { groupId, productId, region } = req.body
        
        console.log("///////////////////////")
            console.log(`Run remove Product from Group ${productId} ${groupId} from region ${region}`)
            console.log(`by user: user id = ${req.userId}, user role - ${req.userRole}`)
        console.log("///////////////////////") 

        const updatedProductDB = await Products.findOneAndUpdate(
            {
                "regions.product._id": mongoose.Types.ObjectId(productId),
                "regions.region": mongoose.Types.ObjectId(region)
            }, 
            {
                $set: { 'regions.$.product.group': false },
                $unset: { 'regions.$.product.group_id': 1 },
                // Удаляет поле при удалении товара из группы
                $unset: { 'regions.$.product.groupProperties': '' }
            }
        )

        const updatedGroupDB = await Groups.findOneAndUpdate(
            {
                "regions.group._id": mongoose.Types.ObjectId(groupId),
                "regions.region": mongoose.Types.ObjectId(region)
            }, 
            {
                $pull: { 'regions.$.group.products': mongoose.Types.ObjectId(productId) }
            }
        )

        const deleteRegionFromGroupIsProductsEmpty = await Groups.findOneAndUpdate(
            {
                "regions.group._id": mongoose.Types.ObjectId(groupId),
                "regions.region": mongoose.Types.ObjectId(region)
            }, 
            {
                $pull: { 'regions': { 'group.products': { $size: 0} } }
            }
        )

        const deleteGroupIsRegionsEmpty = await Groups.deleteMany(
            {
                "regions": { $size: 0 }
            }
        )

        res.status(200).json({message: 'Товар успешно удален из группы!'})
    } catch (error) {
        next(error)
    }
}

exports.removeGroup = async (req, res, next) => {
    try {
        let { groupId, region } = req.body

        console.log("///////////////////////")
            console.log(`Run remove Group ${groupId} from region ${region}`)
            console.log(`by user: user id = ${req.userId}, user role - ${req.userRole}`)
        console.log("///////////////////////")
        
        let currentGroup = await Groups.aggregate()
            .match({ "regions.group._id": mongoose.Types.ObjectId(groupId) })
            .project(
                {
                    results: {
                        $filter: {
                            input: '$regions',
                            as: 'el',
                            cond: {
                                $and: [
                                    {
                                        $eq: [ '$$el.group._id', mongoose.Types.ObjectId(groupId) ]
                                    }, 
                                    {
                                        $eq: [ '$$el.region', mongoose.Types.ObjectId(region) ]
                                    }
                                ]
                            }
                        }
                    }
                }
            )
            .unwind({ path: '$results' })

        if (!currentGroup.length) return res.status(400).json({message: 'Что-то пошло не так!'})

        let products = currentGroup[0].results.group.products

        const updatedProductsDB = await Products.updateMany(
            {
                "regions.product._id": { $in: products },
            }, 
            {
                $set: { 'regions.$[elem].product.group': false },
                $unset: {'regions.$[elem].product.group_id': 1 },
                // Удалить из продукта при удалении группы
                $unset: {'regions.$[elem].product.groupProperties': '' }
            }, 
            {
                arrayFilters: [ { "elem.region":  mongoose.Types.ObjectId(region)} ]
            }
        )

        const deleteRegionFromGroup = await Groups.findOneAndUpdate(
            {
                "regions.group._id": mongoose.Types.ObjectId(groupId),            
            }, 
            {
                $pull: { 'regions': { "region": mongoose.Types.ObjectId(region) } }
            }
        )

        const deleteGroupIsRegionsEmpty = await Groups.deleteMany(
            {
                "regions": { $size: 0 }
            }
        )

        res.status(200).json({message: 'Группа успешно удалена!'})
    } catch (error) {
        next(error)
    }
}

exports.addProductToGroup = async (req, res, next) => {
    try {
        let { productId, groupId, region, groupProperties } = req.body
        
        console.log("///////////////////////")
            console.log(`Run add Product to Group ${productId} ${groupId} from region ${region}`)
            console.log(`by user: user id = ${req.userId}, user role - ${req.userRole}`)
        console.log("///////////////////////")

        if (!groupId) return res.status(400).json({message: 'Выберите группу!'})

        let currentGroup = await Groups.aggregate()
        .match({ "regions.group._id": mongoose.Types.ObjectId(groupId) }) 
        .project(
            {
                results: {
                    $filter: {
                        input: '$regions',
                        as: 'el',
                        cond: {
                            $and: [
                                {
                                    $eq: [ '$$el.group._id', mongoose.Types.ObjectId(groupId) ]
                                }, 
                                {
                                    $eq: [ '$$el.region', mongoose.Types.ObjectId(region) ]
                                }
                            ]
                        }
                    }
                }
            }
        )

        let group = currentGroup[0].results[0].group
        group.products.push(mongoose.Types.ObjectId(productId))

        const updatedProductDB = await Products.updateOne({
            "regions.product._id": mongoose.Types.ObjectId(productId),
            "regions.region": mongoose.Types.ObjectId(region)
        }, {
            $set: {
                'regions.$.product.group': true,
                'regions.$.product.group_id': mongoose.Types.ObjectId(groupId),
                // Добавление поля groupProperties в товар в уже созданную группу
                'regions.$.product.groupProperties': group.groupProperties,

            }
        })

        const updatedGroupDB = await Groups.updateOne({
            "regions.group._id": mongoose.Types.ObjectId(groupId),
            "regions.region": mongoose.Types.ObjectId(region)
        }, {
            $set: {
                'regions.$.group': group
            }
        })

        res.status(200).json({message: 'Товар добавлен в группу'})
    } catch (error) {
        next(error)
    }
}