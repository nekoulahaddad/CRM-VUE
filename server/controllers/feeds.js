const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const moment = require('moment');
const { FEEDS_PATH } = require('../utils/path');
const Categories = require('../models/categories');
const Products = require('../models/products');
const Regions = require('../models/regions');

exports.getFeeds = async (req, res, next) => {
  let { region, categoryId } = req.body;
  let _region = await Regions.findOne({ _id: mongoose.Types.ObjectId(region) });
  let _products = await getCategoryProducts(
    [mongoose.Types.ObjectId(categoryId)],
    mongoose.Types.ObjectId(region)
  );
  let _currencyId = null;

  switch (_region.valute.code) {
    case '643':
      _currencyId = 'RUR';
      break;
    case '933':
      _currencyId = 'BYN';
      break;
    case '398':
      _currencyId = 'KZT';
      break;
    case '417':
      _currencyId = 'KGS';
      break;
  }

  //   console.log('🚀  _category', _products);
  let offers = ``;

  const makeOffers = async () => {
    _products.forEach((item) => {
      let _offer = `<offer id="${item.article}">
                 <name>${item.title}</name>
                 <url>https://tdcsk.com/products/region/${_region.value}/${item.slug}</url>
                 <price>${item.cost}</price>
                 <currencyId>${_currencyId}</currencyId>
                 <categoryId>1</categoryId>
                 <delivery>true</delivery>
             </offer>`;
      offers = offers + _offer;
    });
  };

  await makeOffers();

  let date = moment(Date.now()).format();
  let xmlData = `
      <?xml version="1.0" encoding="UTF-8"?>
          <yml_catalog date="${date}">
              <shop>
                  <name>ТД ЦСК</name>
                  <company>ООО "ТД ЦСК"</company>
                  <url>http://tdcsk.com</url>
                  <currencies>
                      <currency id="${_currencyId}" rate="1"/>
                  </currencies>
                  <categories>
                      <category id="1">Гибкая черепица</category>
                  </categories>
                  <offers>
                      ${offers}
                  </offers>
              </shop>
          </yml_catalog>
      `;

  let filePath = path.join(FEEDS_PATH, `/${categoryId}.yml`);
  fs.writeFile(filePath, xmlData, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: 'Ошибка при сохранении' });
    }
  });
  res.status(200).download(FEEDS_PATH, `${categoryId}.yml`);
};

async function getCategoryProducts(categories, region) {
  let myMatch = {
    'regions.region': mongoose.Types.ObjectId(region),
    'regions.product.category_id': { $in: categories }, // mongoose.Types.ObjectId(category)
  };
  let productsFromCategory = await Products.aggregate()
    .match(myMatch)
    .project({
      product: {
        $filter: {
          input: '$regions',
          as: 'el',
          cond: {
            $and: [
              {
                $eq: ['$$el.region', mongoose.Types.ObjectId(region)],
              },
              {
                $eq: ['$$el.product.deleted', false],
              },
              {
                $gte: ['$$el.product.cost', 0],
              },
            ],
          },
        },
      },
    })
    .project({
      product: '$product.product',
    })
    .unwind('$product')
    .sort({ 'product.article': 1 })
    .project({
      _id: 0,
      article: '$product.article',
      visible: '$product.visible',
      id: '$product._id',
      title: '$product.title',
      cost: '$product.cost',
      club_cost: '$product.club_cost',
      options: '$product.options',
      images: '$product.images',
      path: '$product.path',
      unit: '$product.unit',
      coef: '$product.coef',
      description: '$product.description',
      slug: '$product.slug',
    });
  for (p of productsFromCategory) {
    let options = [];
    for (o of p.options) {
      Object.entries(o).forEach(([key, value]) => {
        let obj = {
          key: key,
          value: value,
        };
        options.push(obj);
      });
    }
    p.options = options;
  }
  return productsFromCategory;
}
