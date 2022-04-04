const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const moment = require('moment');
const { FEEDS_PATH } = require('../utils/path');
const Categories = require('../models/categories');
const Products = require('../models/products');
const Regions = require('../models/regions');

const feedTemplate = {
  base: (date, _currencyId, categories, offers) => `
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
          ${categories}
          </categories>
          <offers>
          ${offers}
          </offers>
        </shop>
      </yml_catalog>
    `,
  offers: (product, _region, _currencyId, i) => `<offer id="${product.article}">
        <name>${product.title}</name>
        <url>https://tdcsk.com/products/region/${_region.value}/${product.slug}</url>
        <price>${product.cost}</price>
        <currencyId>${_currencyId}</currencyId>
        <categoryId>${i}</categoryId>
        <delivery>true</delivery>
      </offer>\n`,
  categories: (id, name, last) => `<category id="${id}">${name}</category>${!last && '\n'}`,
};

async function updateFeed(region, category_id, cb) {
  try {
    let date = moment(Date.now()).format();
    let _currencyId = 'RUR';
    let category = await getCategory(region, category_id);
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
    console.log('🚀 ~ file: feeds.js ~ line 117 ~ updateFeed ~ filePath', filePath);
    // let filePath = path.join('./uploads/feeds', `/${_region.title}_${category._id}.yml`); // test
    fs.writeFile(filePath, xmlData, (err) => {
      if (err) {
        console.log(err);
        return cb();
      }
      if (cb) {
        cb(filePath);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function createLargeFeed(region, categories, date) {
  let res = '';
  let _feedOffers = '';
  let _feedCategories = '';
  const makeOffers = async (products, i) => {
    products.forEach((item) => {
      let _offer = feedTemplate.offers(item, region, 'RUR', i);
      _feedOffers = _feedOffers + _offer;
    });
  };
  const feedTemplate = {
    base: (date, _currencyId, categories, offers) => `
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
            ${categories}
            </categories>
            <offers>
            ${offers}
            </offers>
          </shop>
        </yml_catalog>
      `,
    offers: (product, _region, _currencyId, i) => `<offer id="${product.article}">
          <name>${product.title}</name>
          <url>https://tdcsk.com/products/region/${_region.value}/${product.slug}</url>
          <price>${product.cost}</price>
          <currencyId>${_currencyId}</currencyId>
          <categoryId>${i}</categoryId>
          <delivery>true</delivery>
        </offer>\n`,
    categories: (id, name, last) => `<category id="${id}">${name}</category>${!last && '\n'}`,
  };
  await Promise.all(
    categories.map(async (_c, i) => {
      let last = categories.length - 1 === i;
      let _categoryFeed = feedTemplate.categories(i + 1, _c.categoryName, last);
      _feedCategories = _feedCategories + _categoryFeed;
      let _products = await getCategoryProducts(
        [mongoose.Types.ObjectId(_c._id)],
        mongoose.Types.ObjectId(region)
      );
      await makeOffers(_products, i + 1);
    })
  );
  res = feedTemplate.base(date, 'RUR', _feedCategories, _feedOffers);
  return res;
}

async function getSubCategories(region, parent_id, nesting) {
  let categories;
  let condDeleted = {
    'regions.category.deleted': false,
  };
  if (nesting <= 3) {
    let condRegion = {
      'regions.region': mongoose.Types.ObjectId(region),
    };
    let condNesting;
    if (nesting >= 0) {
      condNesting = {
        'regions.category.nesting': +nesting,
      };
    }
    let condParent;
    if (parent_id) {
      condParent = {
        'regions.category.parent_id': mongoose.Types.ObjectId(parent_id),
      };
    }
    let allMatch = Object.assign({}, condDeleted, condRegion, condNesting || {}, condParent || {});
    categories = await Categories.aggregate()
      .unwind('regions')
      .match(allMatch)
      .lookup({
        from: 'users',
        localField: 'regions.category.manager',
        foreignField: '_id',
        as: 'regions.category.manager',
      })
      .sort({
        'regions.category.order': 1,
      })
      .group({
        _id: 0,
        categories: {
          $push: '$regions.category',
        },
      })
      .replaceRoot({
        categories: '$categories',
      });
  }
  return categories[0].categories;
}

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

async function createFullFeed(region) {
    let categories = await getSubCategories(region);
    filePath = path.join('./uploads/feeds', `/${_region.title}_All.yml`);
    let _categories = await Promise.all(
      categories.map(async (_c) => {
        let _t = await getSubCategories(region, _c._id, 1);
        return _t.map((_tt) => ({ _id: _tt._id, categoryName: _tt.categoryName }));
      })
    );
    let xmlData = await createLargeFeed(
      region,
      _categories.flat().map((c) => ({ _id: c._id, categoryName: c.categoryName })),
      date
    );
    fs.writeFile(filePath, xmlData, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: 'Ошибка при сохранении' });
      }
      res.status(200).download(filePath);
    }); 
}

exports.feeds = {
  feedTemplate,
  updateFeed,
  createLargeFeed,
  getSubCategories,
  getCategory,
  getCategoryProducts,
};
