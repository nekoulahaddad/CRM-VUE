const mongoose = require("mongoose");
const Categories = require("../models/categories");
const Brands = require("../models/brands");
const Products = require("../models/products");
const path = require("path");
const util = require("util");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const { translit } = require("gost-transliteration");
const fs = require("fs");
const {
  PRODUCTS_PATH,
  TEMP_PATH,
  UPLOADS_PATH,
  FEEDS_PATH,
} = require("../utils/path");
// const {updateFeed} = require('./feeds')
const { feeds } = require("../utils/feeds");

const {
  uploadFilesFromTempToFolder,
  copyFilesFromTempToFolder,
  makeUserDir,
  removeUserDir,
  deleteUserUploadedFile,
  copyFolderRecursively,
} = require("../utils/fs");

const e = require("express");

exports.getProductsBySearch = async (req, res, next) => {
  try {
    let search = req.body.search;
    let region = req.body.region;

    let products = await Products.aggregate([
      {
        $project: {
          results: {
            regions: {
              $filter: {
                input: "$regions",
                as: "el",
                cond: {
                  $and: [
                    {
                      $eq: [
                        "$$el.region",
                        mongoose.Types.ObjectId(region.toString()),
                      ],
                    },
                    {
                      $eq: ["$$el.product.visible", true],
                    },
                    {
                      $eq: ["$$el.product.deleted", false],
                    },
                    {
                      $or: [
                        {
                          $regexFind: {
                            input: "$$el.product.title",
                            regex: new RegExp(
                              "(w|s){0,}" +
                                _.escapeRegExp(search) +
                                "(w|s){0,}",
                              "ui"
                            ),
                          },
                        },
                        {
                          $eq: ["$$el.product.article", +search],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$results.regions",
        },
      },
      {
        $project: {
          _id: "$results.regions.product._id",
          article: "$results.regions.product.article",
          title: "$results.regions.product.title",
          cost: "$results.regions.product.cost",
          full_cost: "$results.regions.product.full_cost",
          club_cost: "$results.regions.product.club_cost",
          unit: "$results.regions.product.unit",
          supplier_article: "$results.regions.product.supplier_article",
          rrp: "$results.regions.product.rrp",
          purchase_cost: "$results.regions.purchase_cost",
          margin: "$results.regions.product.margin",
          discount_percent: "$results.regions.product.discount_percent",
          stop_cost: "$results.regions.product.stop_cost",
        },
      },
    ]);
    let result = products && products.length ? products : [];
    console.log(result);
    res.status(200).json({
      products: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getProductsByArticle = async (req, res, next) => {
  try {
    let article = req.body.article;
    let region = req.body.region;
    console.log(req.body);
    let product = await Products.aggregate([
      {
        $project: {
          results: {
            regions: {
              $filter: {
                input: "$regions",
                as: "el",
                cond: {
                  $and: [
                    {
                      $eq: [
                        "$$el.region",
                        mongoose.Types.ObjectId(region.toString()),
                      ],
                    },
                    {
                      $eq: ["$$el.product.article", +article],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$results.regions",
        },
      },
      {
        $project: {
          product: {
            _id: "$results.regions.product._id",
            article: "$results.regions.product.article",
            title: "$results.regions.product.title",
            cost: "$results.regions.product.cost",
            club_cost: "$results.regions.product.club_cost",
            full_cost: "$results.regions.product.full_cost",
            unit: "$results.regions.product.club_cost",
          },
        },
      },
      {
        $unwind: {
          path: "$product",
        },
      },
    ]);
    let result = product && product[0] ? product[0].product : [];
    console.log(result);
    res.status(200).json({
      product: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createProduct = async (params, images, contentPath) => {
  return createNewProduct(params, images, contentPath);
};

const createNewProduct = async (params, images, contentPath) => {
  tempPath = contentPath ? contentPath : TEMP_PATH;
  const {
    region,
    title,
    options,
    cost,
    club_cost,
    unit,
    description,
    parent_value,
    discount,
    wholesale,
    discount_price,
    recomendsProductsIds,
    recomendsProductsTitles,
    buyedProductsIds,
    buyedProductsTitles,
    type,
    coef,
    supplier_article,
    rrp,
    purchase_cost,
    margin,
    discount_percent,
    stop_cost,
  } = params;
  const lastProduct = await Products.aggregate([
    {
      $unwind: {
        path: "$regions",
      },
    },
    {
      $sort: {
        "regions.product.article": -1,
      },
    },
    { $limit: 1 },
    {
      $project: {
        article: "$regions.product.article",
      },
    },
    {
      $unwind: {
        path: "$article",
      },
    },
  ]);

  const product = {
    _id: mongoose.Types.ObjectId(),
    article: +lastProduct[0].article + 1,
    title: title,
    description: description,
    cost: cost,
    unit: unit,
    images: [],
    updates: [],
  };

  if (club_cost) {
    product.club_cost = club_cost;
  }
  if (wholesale) {
    product.wholesale = true;
  }
  if (discount) {
    product.discount = true;
    product.discount_price = +discount_price;

    if (coef !== "undefined") {
      product.discount_full_price = (discount_price * +coef).toFixed(2);
    }
  }
  if (supplier_article !== undefined && supplier_article) {
    product.supplier_article = supplier_article;
  }
  if (rrp !== undefined && rrp) {
    product.rrp = rrp;
  }
  if (purchase_cost !== undefined && purchase_cost) {
    product.purchase_cost = purchase_cost;
  }
  if (margin !== undefined && margin) {
    product.margin = margin;
  }
  if (discount_percent !== undefined && discount_percent) {
    product.discount_percent = discount_percent;
  }
  if (stop_cost !== undefined && stop_cost) {
    product.stop_cost = stop_cost;
  }
  if (coef) {
    product.coef = +coef;
    product.full_cost = (product.cost * +coef).toFixed(2);
    if (product.club_cost)
      product.full_club_cost = (product.club_cost * +coef).toFixed(2);
  }

  if (options) {
    // console.log("Im in options");
    // let formatedOptions = [];
    //let optionsNew = JSON.parse(JSON.stringify(options));
    // console.log(optionsNew);
    // for (let key in optionsNew) {
    //     console.log(key);
    //     let newKey = key;
    //     console.log(newKey)
    //     formatedOptions.push({
    //         [newKey]: optionsNew[newKey],
    //     });
    // }
    // console.log(formatedOptions);
    product.options = options;
  }

  if (recomendsProductsIds) {
    if (Array.isArray(recomendsProductsIds) || !recomendsProductsIds.length) {
      let products_ids = [];
      console.log("/////////////recomends");
      for (let i = 0; i < recomendsProductsIds.length; i++) {
        console.log(util.inspect(recomendsProductsIds[i]));
        products_ids.push({
          title: recomendsProductsTitles[i],
          product_id: mongoose.Types.ObjectId(recomendsProductsIds[i]),
        });
      }
      product.recomended = products_ids;
    }
  } else {
    product.recomended = [];
  }
  if (buyedProductsIds) {
    if (Array.isArray(buyedProductsIds) || !buyedProductsIds.length) {
      let products_ids = [];
      for (let i = 0; i < buyedProductsIds.length; i++) {
        products_ids.push({
          title: buyedProductsTitles[i],
          product_id: mongoose.Types.ObjectId(buyedProductsIds[i]),
        });
      }
      product.buyed = products_ids;
    }
  } else {
    product.buyed = [];
  }

  product.slug = translit(_.kebabCase(product.title))
    .replace(/'/g, "")
    .toLowerCase();
  product.meta = {
    title: product.title,
    keywords: product.title,
    description: product.title,
  };

  // Находим родительскую категорию
  product.category_id = mongoose.Types.ObjectId(parent_value);
  product.images = [];

  // Ищем похожие товары среди всех регионов
  const matchedProducts = await Products.aggregate([
    {
      $project: {
        results: {
          $filter: {
            input: "$regions",
            as: "el",
            cond: {
              $eq: ["$$el.product.slug", product.slug],
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
      $group: {
        _id: "$_id",
        results: {
          $addToSet: "$results.product",
        },
      },
    },
  ]);

  // Если совпадений нет - добавляем
  if (!matchedProducts.length) {
    await makeUserDir(
      UPLOADS_PATH,
      `/catalog/${region}/categories/${product.category_id.toString()}/${product._id.toString()}`
    );

    for (let i = 0; i < images.length; i++) {
      if (contentPath) {
        await copyFilesFromTempToFolder(
          tempPath,
          UPLOADS_PATH,
          images[i].filename,
          `/catalog/${region}/categories/${product.category_id.toString()}/${product._id.toString()}`
        );
        product.images.push(images[i].filename);
      } else {
        await uploadFilesFromTempToFolder(
          tempPath,
          UPLOADS_PATH,
          images[i].filename,
          `/catalog/${region}/categories/${
            product.category_id
          }/${product._id.toString()}`
        );
        product.images.push(images[i].filename);
      }
    }
    product.path = `/uploads/catalog/${region}/categories/${product.category_id}/${product._id}/`;
    // Создаем категорию
    product.visible = true;
    product.deleted = false;
    const newProduct = await Products.create({
      regions: [
        {
          region: mongoose.Types.ObjectId(region),
          product: product,
        },
      ],
    });

    await newProduct.save();
    console.log(newProduct);
  } else {
    console.log("MATCHED");
    // Иначе у нас есть совпадения - добавляем в эту категорию регион
    let currentProduct = await Products.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: ["$$el.region", mongoose.Types.ObjectId(region)],
                  },
                  {
                    $eq: ["$$el.product.slug", product.slug],
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
        $project: {
          product: {
            _id: "$_id",
            title: "$results.product.title",
            article: "$results.product.article",
          },
        },
      },
    ]);
    console.log(currentProduct.length);
    // Если в таком регионе нет такого товара
    await makeUserDir(
      UPLOADS_PATH,
      `/catalog/${region}/categories/${product.category_id.toString()}/${product._id.toString()}`
    );
    for (let i = 0; i < images.length; i++) {
      if (contentPath) {
        await copyFilesFromTempToFolder(
          tempPath,
          UPLOADS_PATH,
          images[i].filename,
          `/catalog/${region}/categories/${product.category_id.toString()}/${product._id.toString()}`
        );
        product.images.push(images[i].filename);
      } else {
        await uploadFilesFromTempToFolder(
          tempPath,
          UPLOADS_PATH,
          images[i].filename,
          `/catalog/${region}/categories/${product.category_id.toString()}/${product._id.toString()}`
        );
        product.images.push(images[i].filename);
      }
    }
    product.path = `/uploads/catalog/${region}/categories/${product.category_id}/${product._id}/`;
    // Обновляем товар
    console.log(matchedProducts);
    product.article = matchedProducts[0].results[0].article;
    product._id = mongoose.Types.ObjectId(matchedProducts[0].results[0]._id);
    console.log(product);
    const updatedProducts = await Products.updateOne(
      {
        _id: mongoose.Types.ObjectId(matchedProducts[0]._id),
      },
      {
        $push: {
          regions: {
            region: mongoose.Types.ObjectId(region),
            product: product,
          },
        },
      }
    );
  }
  return product;
};

exports.addProduct = async (req, res, next) => {
  try {
    // Получаем данные

    const { images, certificates } = req.files;
    const params = req.body;
    const createdProduct = await createNewProduct(params, images, null);

    res.status(201).json({
      message: "ADDED",
      exist: false,
      product: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

var startTime, endTime;
function startCount() {
  startTime = new Date();
}
function endCount() {
  endTime = new Date();
  var timeDiff = endTime - startTime;
  timeDiffSec = timeDiff / 1000;
  var seconds = Math.round(timeDiffSec);
  console.log(seconds + " seconds(" + timeDiff + ")");
}

exports.editProduct = async (req, res, next) => {
  try {
    const {
      region,
      productId,
      title,
      options,
      cost,
      club_cost,
      discount,
      wholesale,
      discount_price,
      recomendsProductsIds,
      recomendsProductsTitles,
      buyedProductsIds,
      buyedProductsTitles,
      unit,
      description,
      coef,
      supplier_article,
      rrp,
      purchase_cost,
      margin,
      discount_percent,
      stop_cost,
    } = req.body;

    let changeTitle = false;
    const { images, certificates } = req.files;

    const updatedProduct = await Products.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: ["$$el.region", mongoose.Types.ObjectId(region)],
                  },
                  {
                    $eq: [
                      "$$el.product._id",
                      mongoose.Types.ObjectId(productId),
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

    const product = updatedProduct[0].product[0];
    let oldSlug = product.slug;

    if (title !== undefined && title) {
      let oldTitle = product.title.toLowerCase();
      product.title = title;
      product.slug = translit(_.kebabCase(product.title))
        .replace(/'/g, "")
        .toLowerCase();

      if (product.slug !== oldSlug && product.title.toLowerCase() !== oldTitle)
        changeTitle = true;
    }

    if (cost !== undefined && cost) {
      product.cost = cost;
    }

    if (club_cost === null || club_cost === 0) {
      product.club_cost = null;
    }

    if (club_cost !== undefined && club_cost) {
      product.club_cost = club_cost;
    }
    if (wholesale !== undefined) {
      product.wholesale = wholesale;
    }
    if (discount) {
      product.discount = discount;
      product.discount_price = discount_price;
      if (coef !== "undefined") {
        product.discount_full_price = (discount_price * +coef).toFixed(2);
      }
    } else {
      product.discount = false;
      product.discount_price = 0;
    }

    if (supplier_article !== undefined && supplier_article) {
      product.supplier_article = supplier_article;
    }
    if (rrp !== undefined && rrp) {
      product.rrp = rrp;
    }
    if (purchase_cost !== undefined && purchase_cost) {
      product.purchase_cost = purchase_cost;
    }
    if (margin !== undefined && margin) {
      product.margin = margin;
    }
    if (discount_percent !== undefined && discount_percent) {
      product.discount_percent = discount_percent;
    }
    if (stop_cost !== undefined && stop_cost) {
      product.stop_cost = stop_cost;
    }
    if (unit !== undefined && unit) {
      product.unit = unit;
    }

    if (coef !== undefined) {
      product.coef = +coef;
      product.full_cost = (product.cost * +coef).toFixed(2);
      console.log(product.club_cost, coef);
      if (product.club_cost)
        product.full_club_cost = (product.club_cost * +coef).toFixed(2);
    } else {
      product.coef = 0;
      product.full_cost = 0;
      product.full_club_cost = 0;
    }
    if (description !== undefined || description === "") {
      product.description = description;
    }

    if (options !== undefined) {
      let formatedOptions = [];
      let optionsNew = JSON.parse(JSON.stringify(options));
      for (let key in optionsNew) {
        let newKey = key.replace(/\./g, "##");
        formatedOptions.push({
          [newKey]: optionsNew[key],
        });
      }
      product.options = formatedOptions;
    } else {
      product.options = [];
    }

    if (recomendsProductsIds) {
      if (Array.isArray(recomendsProductsIds) || !recomendsProductsIds.length) {
        let products_ids = [];
        for (let i = 0; i < recomendsProductsIds.length; i++) {
          products_ids.push({
            title: recomendsProductsTitles[i],
            product_id: mongoose.Types.ObjectId(recomendsProductsIds[i]),
          });
        }
        product.recomended = products_ids;
      }
    } else {
      product.recomended = [];
    }

    if (buyedProductsIds) {
      if (Array.isArray(buyedProductsIds) || !buyedProductsIds.length) {
        let products_ids = [];
        for (let i = 0; i < buyedProductsIds.length; i++) {
          products_ids.push({
            title: buyedProductsTitles[i],
            product_id: mongoose.Types.ObjectId(buyedProductsIds[i]),
          });
        }
        product.buyed = products_ids;
      }
    } else {
      product.buyed = [];
    }

    // product.updates.push({
    //     user: mongoose.Types.ObjectId(req.userId),
    // });

    if (images && images.length > 0) {
      product.images = [];
      await removeUserDir(
        UPLOADS_PATH,
        `/catalog/${region}/categories/${product.category_id.toString()}/${
          product._id
        }`
      );
      await makeUserDir(
        UPLOADS_PATH,
        `/catalog/${region}/categories/${product.category_id.toString()}/${
          product._id
        }`
      );

      for (let i = 0; i < images.length; i++) {
        await uploadFilesFromTempToFolder(
          TEMP_PATH,
          UPLOADS_PATH,
          images[i].filename,
          `catalog/${region}/categories/${product.category_id}/${product._id}`
        );
        product.images.push(images[i].filename);
      }
      product.path = `/uploads/catalog/${region}/categories/${product.category_id}/${product._id}/`;
    }

    if (certificates && certificates.length > 0) {
      product.certificates = [];

      await removeUserDir(
        UPLOADS_PATH,
        `/catalog/${region}/categories/${product.category_id.toString()}/${
          product._id
        }/certificates`
      );
      await makeUserDir(
        UPLOADS_PATH,
        `/catalog/${region}/categories/${product.category_id.toString()}/${
          product._id
        }/certificates/`
      );

      for (let i = 0; i < certificates.length; i++) {
        await uploadFilesFromTempToFolder(
          TEMP_PATH,
          UPLOADS_PATH,
          certificates[i].filename,
          `catalog/${region}/categories/${product.category_id}/${product._id}/certificates/`
        );
        product.certificates.push(certificates[i].filename);
      }
    }
    /*
    else {
        product.images = []
        await removeUserDir(UPLOADS_PATH, `/catalog/${region}/categories/${product.category_id.toString()}/${product._id}`);
    }
    */
    // Если название было изменено
    if (changeTitle) {
      // Ищем похожие товары среди всех регионов
      const matchedProducts = await Products.aggregate([
        {
          $project: {
            results: {
              $filter: {
                input: "$regions",
                as: "el",
                cond: {
                  $and: [
                    {
                      $eq: ["$$el.region", mongoose.Types.ObjectId(region)],
                    },
                    {
                      $eq: ["$$el.product.slug", product.slug],
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
          $group: {
            _id: "$_id",
            results: {
              $addToSet: "$results.product",
            },
          },
        },
      ]);

      // Если совпадений нет - обнавляем
      if (!matchedProducts.length) {
        console.log("NOT MATCHED");

        const updatedProductDB = await Products.findOneAndUpdate(
          {
            "regions.product._id": mongoose.Types.ObjectId(product._id),
            "regions.region": mongoose.Types.ObjectId(region),
          },
          {
            $set: {
              "regions.$.product": product,
            },
          }
        );

        // Если совпадений есть отправляем ошибку клиенту
      } else {
        console.log("MATCHED");
        return res.status(400).json({
          message: "Товар с таким названием в данном регионе уже существует!",
        });
      }

      // Если название не было изменено
    } else {
      const updatedProductDB = await Products.findOneAndUpdate(
        {
          "regions.product._id": mongoose.Types.ObjectId(product._id),
          "regions.region": mongoose.Types.ObjectId(region),
        },
        {
          $set: {
            "regions.$.product": product,
          },
        }
      );
    }

    try {
      //await feeds.updateFeed(region, product.parent_id);
    } catch (err) {}

    res.status(201).json({
      message: "EDITED",
      product: product,
      changeTitle: changeTitle,
      old: product._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.transferProduct = async (req, res, next) => {
  try {
    const { region, productId, id } = req.body;

    console.log(req.body);

    const updatedProduct = await Products.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: ["$$el.region", mongoose.Types.ObjectId(region)],
                  },
                  {
                    $eq: [
                      "$$el.product._id",
                      mongoose.Types.ObjectId(productId),
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

    const product = updatedProduct[0].product[0];

    let categoryWithoutFormat = await Categories.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: ["$$el.region", mongoose.Types.ObjectId(region)],
                  },
                  {
                    $eq: ["$$el.category._id", mongoose.Types.ObjectId(id)],
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
        $group: {
          _id: "$_id",
          results: {
            $addToSet: "$results.category",
          },
        },
      },
    ]);
    let category = categoryWithoutFormat[0].results[0];
    console.log(category);
    if (category.nesting < 1) {
      res.status(400).json({
        message: "Невозможно переместить товар на данный уровень",
      });
      return;
    }
    product.category_id = mongoose.Types.ObjectId(id);
    if (product.brand_id) delete product.brand_id;

    // product.updates.push({
    //     user: mongoose.Types.ObjectId(req.userId),
    // });

    const updatedProductDB = await Products.findOneAndUpdate(
      {
        "regions.product._id": mongoose.Types.ObjectId(product._id),
        "regions.region": mongoose.Types.ObjectId(region),
      },
      {
        $set: {
          "regions.$.product": product,
        },
      }
    );

    console.log("///////////////////////");
    console.log("Updated Product");
    console.log(product);
    console.log("///////////////////////");
    res.status(201).json({
      message: "EDITED",
      product: product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.editProductVisibility = async (req, res, next) => {
  try {
    const { region, productId, visible } = req.body;

    console.log(req.body);

    const updatedProduct = await Products.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: [
                      "$$el.region",
                      mongoose.Types.ObjectId(region.toString()),
                    ],
                  },
                  {
                    $eq: [
                      "$$el.product._id",
                      mongoose.Types.ObjectId(productId),
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

    console.log(updatedProduct[0]);

    const product = updatedProduct[0].product[0];

    product.visible = visible;

    // product.updates.push({
    //     user: mongoose.Types.ObjectId(req.userId),
    // });

    console.log(product);

    const updatedProductDB = await Products.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(updatedProduct[0]._id),
        "regions.region": mongoose.Types.ObjectId(region),
      },
      {
        $set: {
          "regions.$.product": product,
        },
      }
    ).lean();

    console.log("///////////////////////");
    console.log("Updated Product");
    console.log(updatedProductDB);
    console.log("///////////////////////");
    res.status(201).json({
      message: "EDITED",
      product: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.editProductProvider = async (req, res, next) => {
  try {
    const { region, id, minq, providers } = req.body;

    console.log(req.body);
    const updatedProduct = await Products.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: [
                      "$$el.region",
                      mongoose.Types.ObjectId(region.toString()),
                    ],
                  },
                  {
                    $eq: ["$$el.product._id", mongoose.Types.ObjectId(id)],
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
    const product = updatedProduct[0].product[0];

    if (minq !== "undefined") {
      product.minq = minq;
    }

    if (providers !== "undefined") {
      product.providers = providers;
    }

    // product.updates.push({
    //     user: mongoose.Types.ObjectId(req.userId),
    // });

    console.dir(product);

    const updatedProductDB = await Products.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(updatedProduct[0]._id),
        "regions.region": mongoose.Types.ObjectId(region),
      },
      {
        $set: {
          "regions.$.product": product,
        },
      }
    ).lean();

    console.log("///////////////////////");
    console.log("Updated Product");
    console.log(updatedProductDB);
    console.log("///////////////////////");
    res.status(201).json({
      message: "EDITED",
      product: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const region = req.body.region;

    const deletedProduct = await Products.updateMany(
      {
        regions: {
          $elemMatch: {
            "product._id": mongoose.Types.ObjectId(productId),
            "product.deleted": false,
            region: mongoose.Types.ObjectId(region),
          },
        },
      },
      {
        $set: {
          "regions.$.product.deleted": true,
        },
      }
    );
    console.log(deletedProduct);

    console.log("///////////////////////");
    console.log("Deleted Product");
    console.log("///////////////////////");
    res.status(201).json({
      message: "DELETED",
      product: {
        _id: productId,
      },
    });
  } catch (error) {
    next(error);
  }
};
