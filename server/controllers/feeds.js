const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const moment = require('moment');
const { FEEDS_PATH } = require('../utils/path');
const Categories = require('../models/categories');
const Products = require('../models/products');
const Regions = require('../models/regions');

// runs as middleawre after product updates (productController.editProduct)
exports.updateFeed = async (region, category_id) => {
  try {
    // const { region, category_id } = req.body;
    console.log("🚀 ~ file: feeds.js ~ line 14 ~ exports.updateFeed= ~ req.body", region, category_id)
    let date = moment(Date.now()).format();
    let _currencyId = 'RUR';
    let _region = await Regions.findOne({ _id: mongoose.Types.ObjectId(region) });
    let _products = await getCategoryProducts(
      [mongoose.Types.ObjectId(category_id)],
      mongoose.Types.ObjectId(region)
    );
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
                  <category id="1">${category.categoryName}</category>
                  </categories>
                  <offers>
                  ${offers}
                  </offers>
                  </shop>
                  </yml_catalog>
                  `;
    let filePath = path.join(FEEDS_PATH, `/${_region.title} ${category.categoryName}.yml`);
    // let filePath = path.join('./uploads/feeds', `/${_region.title}_${category._id}.yml`);
    fs.writeFile(filePath, xmlData, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: 'Ошибка при сохранении' });
      }
    });
  } catch (error) {
    next(error);
  }
};

async function makeCategoryFeed(_region, category) {
  let offers = ``;
  let date = moment(Date.now()).format();
  let _currencyId = null;
  let _products = await getCategoryProducts(
    [mongoose.Types.ObjectId(category._id)],
    mongoose.Types.ObjectId(_region._id)
  );
  console.log('🚀 ~ file: feeds.js ~ line 79 ~ makeCategoryFeed ~ _products', _products);
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
                  <category id="1">${category.categoryName}</category>
                  </categories>
                  <offers>
                  ${offers}
                  </offers>
                  </shop>
                  </yml_catalog>
                  `;
  let filePath = path.join('./uploads/feeds', `/${_region.title}_${category._id}.yml`);
  // let filePath = path.join(FEEDS_PATH, `/${_region.title} ${category.categoryName}.yml`);
  fs.writeFile(filePath, xmlData, (err) => {
    if (err) {
      console.log(err);
      return;
      // res.status(500).send({ message: 'Ошибка при сохранении' });
    }
  });

  return;
}

// await makeAllFeeds()

exports.getFeeds = async (req, res, next) => {
  let { region, categoryId } = req.body;
  let _region = await Regions.findOne({ _id: mongoose.Types.ObjectId(region) });
  let category = await getCategory(region, categoryId);
  let _products = await getCategoryProducts(
    [mongoose.Types.ObjectId(categoryId)],
    mongoose.Types.ObjectId(region)
  );
  // let offers = ``;
  // let date = moment(Date.now()).format();
  await makeAllFeeds(_region);

  let xmlData = await makeCategoryFeed(_region, _products, category);
  // console.log("🚀 ~ file: feeds.js ~ line 150 ~ exports.getFeeds= ~ xmlData", xmlData)
  // switch (_region.valute.code) {
  //   case '643':
  //     _currencyId = 'RUR';
  //     break;
  //   case '933':
  //     _currencyId = 'BYN';
  //     break;
  //   case '398':
  //     _currencyId = 'KZT';
  //     break;
  //   case '417':
  //     _currencyId = 'KGS';
  //     break;
  // }

  // const makeOffers = async () => {
  //   _products.forEach((item) => {
  //     let _offer = `<offer id="${item.article}">
  //                     <name>${item.title}</name>
  //                     <url>https://tdcsk.com/products/region/${_region.value}/${item.slug}</url>
  //                     <price>${item.cost}</price>
  //                     <currencyId>${_currencyId}</currencyId>
  //                     <categoryId>1</categoryId>
  //                     <delivery>true</delivery>
  //                  </offer>`;
  //     offers = offers + _offer;
  //   });
  // };

  // await makeOffers();

  // let xmlData = `
  //     <?xml version="1.0" encoding="UTF-8"?>
  //         <yml_catalog date="${date}">
  //             <shop>
  //                 <name>ТД ЦСК</name>
  //                 <company>ООО "ТД ЦСК"</company>
  //                 <url>http://tdcsk.com</url>
  //                 <currencies>
  //                     <currency id="${_currencyId}" rate="1"/>
  //                 </currencies>
  //                 <categories>
  //                     <category id="1">${category.categoryName}</category>
  //                 </categories>
  //                 <offers>
  //                     ${offers}
  //                 </offers>
  //             </shop>
  //         </yml_catalog>
  //     `;

  let filePath = path.join(FEEDS_PATH, `/${_region.title} ${category.categoryName}.yml`);
  fs.writeFile(filePath, xmlData, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: 'Ошибка при сохранении' });
    }
  });
  res.status(200).download(FEEDS_PATH, `${categoryId}.yml`);
};

async function getCategory(region, categoryId) {
  let category = await Categories.aggregate([
    {
      $match: {
        'regions.category._id': mongoose.Types.ObjectId(categoryId),
        'regions.region': mongoose.Types.ObjectId(region),
      },
    },
    {
      $project: {
        results: {
          $filter: {
            input: '$regions',
            as: 'el',
            cond: {
              $eq: ['$$el.region', mongoose.Types.ObjectId(region)],
            },
          },
        },
      },
    },
    {
      $unwind: {
        path: '$results',
      },
    },
  ]);

  return category[0] ? category[0].results.category : null;
}

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

// async function makeAllFeeds(_region) {
//   // let { nesting, region } = req.body.options;

//   let nesting = 2;
//   let region = '5f85ba274a9a5d34e0a45fed';

//   // const page = +req.query.page - 1;
//   let parent_id = null;

//   let categories, products;
//   if (region !== null) {
//     let condDeleted = {
//       'regions.category.deleted': false,
//     };
//     if (nesting <= 3) {
//       let condRegion = {
//         'regions.region': mongoose.Types.ObjectId(region),
//       };
//       let condNesting;
//       if (nesting >= 0) {
//         condNesting = {
//           'regions.category.nesting': +nesting,
//         };
//       }
//       let condParent;
//       if (parent_id) {
//         condParent = {
//           'regions.category.parent_id': mongoose.Types.ObjectId(parent_id),
//         };
//       }
//       let allMatch = Object.assign({}, condDeleted, condRegion, condNesting || {}, condParent || {});
//       categories = await Categories.aggregate()
//         .unwind('regions')
//         .match(allMatch)
//         .lookup({
//           from: 'users',
//           localField: 'regions.category.manager',
//           foreignField: '_id',
//           as: 'regions.category.manager',
//         })
//         .sort({
//           'regions.category.order': 1,
//         })
//         .group({
//           _id: 0,
//           categories: {
//             $push: '$regions.category',
//           },
//         })
//         .replaceRoot({
//           categories: '$categories',
//         });
//     }
//   }
//   categories[0].categories.forEach((_c) => {
//     makeCategoryFeed(_region, _c);
//   });
// }
