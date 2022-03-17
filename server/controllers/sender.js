const mongoose = require('mongoose')
const Products = require('../models/products')
const Clients = require('../models/clients')
const Orders = require('../models/orders')

const pdf = require('html-pdf');
const path = require('path')
const { ORDERS_PATH } = require('../utils/path')

exports.getPdfFileFromOrder = async(req, res, next) => {
        try {
            const orderId = req.body.orderId

            const order = await Orders.aggregate(
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
                    }, {
                        $facet: {
                            orders: [{
                                $project: {
                                    _id: "$_id",
                                    created: "$created",
                                    buyed: "$buyed",
                                    deliver: "$deliver",
                                    region: "$region",
                                    status: "$status",
                                    number: "$number",
                                    comment: "$comment",
                                    products: "$products",
                                    client: "$client",
                                    delivery: "$delivery",
                                    manager: '$manager'
                                }
                            }]
                        }
                    }
                ]
            )
            console.log(order[0])
            let formattedOrder = order[0].orders[0]
            console.log(formattedOrder)
            let productsId = formattedOrder.products.map((el) => el.product_id)
            let products = await Products.aggregate([{
                $project: {
                    results: {
                        regions: {
                            $filter: {
                                input: '$regions',
                                as: 'el',
                                cond: {
                                    $and: [{
                                        $in: [
                                            '$$el.product._id',
                                            productsId
                                        ]
                                    }, {
                                        $eq: [
                                            '$$el.region',
                                            mongoose.Types.ObjectId(formattedOrder.region._id.toString())
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
                        images: "$results.regions.product.images",
                        options: '$results.regions.product.options',
                        order: '$results.regions.product.order',
                        article: '$results.regions.product.article',
                        link: '$results.regions.product.link',
                        caregory_id: '$results.regions.product.category_id',
                        brand_id: '$results.regions.product.brand_id',
                        title: '$results.regions.product.title',
                        path: '$results.regions.product.path',
                        cost: '$results.regions.product.cost',
                        full_cost: '$results.regions.product.full_cost',
                        slug: '$results.regions.product.slug',
                        club_cost: '$results.regions.product.club_cost',
                        full_club_cost: '$results.regions.product.full_club_cost',
                        recomended: '$results.regions.product.recomended',
                        buyed: '$results.regions.product.buyed',
                        discount: '$results.regions.product.discount',
                        discount_price: '$results.regions.product.discount_price',
                        discount_full_price: '$results.regions.product.discount_full_price',
                        unit: '$results.regions.product.unit',
                        coef: '$results.regions.product.coef',
                        description: '$results.regions.product.description',
                        visible: '$results.regions.product.visible'
                    }
                }
            }, {
                $group: {
                    _id: 0,
                    products: {
                        $push: '$product'
                    }
                }
            }])
            console.log(products)
            let productsList = products[0].products
            let client = formattedOrder.client
            for (let i = 0; i < formattedOrder.products.length; i++) {
                productsList[i].quantity = formattedOrder.products[i].quantity
            }
            let defaultHTML = ``
            defaultHTML += `<!DOCTYPE html>
            <html lang="ru">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Информация о заказе №${formattedOrder.number}</title>
                </head>
                <style>
                    * {
                        font-family: "Roboto", sans-serif;
                    }
                    body {
                        display: flex;
                        flex-direction: column;
                        padding-bottom: 50px;
                    }
                    .container {
                        width: 1500px;
                        display: block;
                        margin: 0 auto;
                        clear: 'both';
                    }
                    header svg {
                        width: 100px;
                        height: auto;
                        background-repeat: no-repeat;
                    }
                    header h5 {
                        font-size: 16px;
                        margin-left: auto;
                        float: right;
                        line-height: 32px;
                    }
                    section {
                        display: block;
                        text-align: center;
                    }
            
                    section h5.heading {
                        margin: 50px auto 20px auto;
                        font-size: 16px;
                    }
                    .row {
                        display: flex;
                        justify-content: space-between;
                    }
                    .row div {
                        width: 50%;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        text-align: left
                    }
                    .row div:first-child {
                        float: left
                    }
                    .row div:nth-child(2) {
                        float: right
                    }
                    table {
                        width: 100%; /* Ширина таблицы */
                        border: 1px solid black; /* Рамка вокруг таблицы */
                        border-collapse: collapse; /* Отображать только одинарные линии */
                    }
                    th {
                        text-align: left; /* Выравнивание по левому краю */
                        background: #ccc; /* Цвет фона ячеек */
                        padding: 5px; /* Поля вокруг содержимого ячеек */
                        border: 1px solid black; /* Граница вокруг ячеек */
                    }
                    td {
                        border: 1px solid black; /* Граница вокруг ячеек */
                        padding: 5px;
                    }
                </style>
                <body>
                    <div class="container">
                        <header>
                            <svg width="65" height="83" viewBox="0 0 65 83" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="65" height="82.8859" fill="url(#pattern0)"/>
                            <defs>
                            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image0" transform="translate(0.0332475) scale(0.000933505 0.000732064)"/>
                            </pattern>
                            </defs>
                            </svg>
                        
                            <h5>Центр строительной комплектации - торговый дом ЦСК</h5>
                        </header>
                        <hr />
                        <section>
                            <h5 class="heading">Информация о покупателе:</h5>
                            <div class="row">
                                <div>
                                    ${client.surname ? `<p>Фамилия: ${client.surname}</p>` : ''}
                                    ${client.name ? `<p>Имя: ${client.name}</p>` : ''}
                                    ${client.lastname ? `<p>Отчество: ${client.lastname}</p>` : ''}
                                    ${client.phone ? `<p>Контактный телефон: ${client.phone}</p>` : ''}
                                    ${(formattedOrder.delivery && formattedOrder.delivery.city) ? `<p>Город: ${formattedOrder.delivery.city}</p>` : ''}
                                    ${(formattedOrder.delivery && formattedOrder.delivery.street) ? `<p>Улица: ${formattedOrder.delivery.street}</p>` : ''}
                                    ${(formattedOrder.delivery && formattedOrder.delivery.house) ? `<p>Дом: ${formattedOrder.delivery.house}</p>` : ''}
                                    ${(formattedOrder.delivery && formattedOrder.delivery.building) ? `<p>Корпус/строение: ${formattedOrder.delivery.building}</p>` : ''}
                                    ${(formattedOrder.delivery && formattedOrder.delivery.appt) ? `<p>Квартира: ${formattedOrder.delivery.appt}</p>` : ''}
                                    ${formattedOrder.comment ? `<p>Комментарий: ${formattedOrder.comment}</p>` : ''}
                                    ${formattedOrder.manager && formattedOrder.manager[0] ? `<p>Менеджер: ${formattedOrder.manager[0].name} ${formattedOrder.manager[0].surname} ${formattedOrder.manager[0].lastname}</p>` : ''}
                                    ${formattedOrder.manager && formattedOrder.manager[0] ? `<p>Номер менеджера: ${formattedOrder.manager[0].number}</p>` : ''}
                                </div>
                                ${client.director ? `
                                <div>
                                    ${client.account_number ? `<p>Расчетный счет: ${client.account_number}</p>` : ''}
                                    ${client.bank ? `<p>Банк: ${client.bank}</p>` : ''}
                                    ${client.bik ? `<p>БИК: ${client.bik}</p>` : ''}
                                    ${client.director ? `<p>Директор: ${client.director}</p>` : ''}
                                    ${client.inn ? `<p>ИНН: ${client.inn}</p>` : ''}
                                    ${client.kpp ? `<p>КПП: ${client.kpp}</p>` : ''}
                                    ${client.okpo ? `<p>ОКПО: ${client.okpo}</p>` : ''}
                                    ${client.organisation ? `<p>организация: ${client.organisation}</p>` : ''}
                                    ${client.ownership ? `<p>Форма собственности: ${client.ownership}</p>` : ''}
                                    ${client.ur_actualAddress ? `<p>Фактический адрес: ${client.ur_actualAddress}</p>` : ''}
                                    ${client.ur_address ? `<p>Юридический адрес: ${client.ur_address}</p>` : ''}
                                    ${client.ur_corScore ? `<p>Номер кореспондетского счета: ${client.ur_corScore}</p>` : ''}
                                </div>
                                ` : ''}
                            </div>
                        </section>
                    </div>
                    <div class="container" style="clear: both; margin: 50px auto">
                        <section style="margin-bottom: 50px">
                            <h5 class="heading">Информация о компании:</h5>
                            <div class="row">
                            ${formattedOrder.payment === 'cash' || formattedOrder.paymentStatus === 'cartReceiving' ?
                                    `<div style="width: 100%">
                                    <p>ИП: Соломахо Олег Леонидович</p>
                                    <p>ОГРНИП: 3175024000026057</p>
                                    <p>ИНН: 509234350962</p>
                                    <p>КПП: 503201001</p>
                                    <p>ИНН: 503234350962</p>
                                    <p>Адрес: 113923, Московская обл., г. Одинцово город, ул. Садовая, д.22 А, кв. 108</p>
                                    <p>Банковские реквизиты</p>
                                    <p>БИК044525974 АО "ТИНЬКОФФ БАНК"</p>
                                    </div>`
                                :
                                    `<div style="width: 100%">
                                        <p>ИП: Соломахо Олег Леонидович</p>
                                        <p>ОГРН: 1165047055403</p>
                                        <p>ИНН: 5047184546</p>
                                        <p>КПП: 503201001</p>
                                        <p>Юридический адрес: 143007, Московская область, Одинцово город, Молодежная улица, дом 46, офис 523</p>
                                    </div>`
                                }
                            </div>
                        </section>
                    </div>
                    <div class="container" style="clear: both; padding-top: 1px">
                        <section>
                            <h5 class="heading">Информация о заказе №${formattedOrder.number}</h5>
                            <table>
                                <tr>
                                    <th>№</th>
                                    <th>Наименование</th>
                                    <th>Артикул</th>
                                    <th>Кол-во</th>
                                    <th>Цена за ед.</th>
                                    <th>Итого</th>
                                </tr>
                                `
                                    let productsStr = ``
                                    for(let i = 0; i < productsList.length; i++){
                                        productsStr += `
                                            <tr>
                                                <td>${i + 1}</th>
                                                <td>${productsList[i].title}</td>
                                                <td>${productsList[i].article}</td>
                                                <td>${productsList[i].quantity}</td>
                                                <td>${productsList[i].cost} &#8381;</td>
                                                <td>${productsList[i].cost * productsList[i].quantity} &#8381;</td>
                                            </tr>
                                        `
                                    }
                                    defaultHTML += productsStr
                                    defaultHTML +=
                                `
                                <tr>
                                    <td colspan="5"></td>
                                    <td>Итого: 
                                `    
                                let sum = 0
                                console.log(productsList)
                                productsList.map((el) => sum += el.cost * el.quantity) 
                                defaultHTML +=
                                    `${sum} &#8381;</td>
                                </tr>
                            </table>
                        </section>
                    </div>
                </body>
            </html>
        `


        let options = { 
            width: '1600px',
            height: '2000px'
        };
        console.log(ORDERS_PATH)
        pdf.create(defaultHTML, options).toFile(path.join(ORDERS_PATH, `${formattedOrder.number}.pdf`), function(err, res) {
            if (err) return console.log(err);
            console.log(res); 
        })

        let link = `https://цск.com/uploads/documents/orders/${formattedOrder.number}.pdf`
		res.status(200).json({
            link
        })
	} catch (error) {
		next(error)
	}
}