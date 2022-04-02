const mongoose = require("mongoose");
const cachegoose = require("cachegoose");
const Categories = require("../models/categories");
const Groups = require("../models/groups");
const Brands = require("../models/brands");
const Products = require("../models/products");
const gDocProducts = require("../models/gDocProducts");
const path = require("path");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const { translit } = require("gost-transliteration");

const { CATEGORIES_PATH, TEMP_PATH, UPLOADS_PATH } = require("../utils/path");

const {
  uploadFilesFromTempToFolder,
  makeUserDir,
  removeUserDir,
  deleteUserUploadedFile,
  removeDir,
  copyFolderRecursively,
} = require("../utils/fs");

exports.getCategories = async (req, res, next) => {
  try {
    let { nesting, region } = req.body.options;
    const page = +req.query.page - 1;
    let parent_id = req.body.options.parent_value;

    let categories, products;
    if (region !== null) {
      let condDeleted = {
        "regions.category.deleted": false,
      };
      if (nesting <= 3) {
        let condRegion = {
          "regions.region": mongoose.Types.ObjectId(region),
        };
        let condNesting;
        if (nesting >= 0) {
          condNesting = {
            "regions.category.nesting": +nesting,
          };
        }
        let condParent;
        if (parent_id) {
          condParent = {
            "regions.category.parent_id": mongoose.Types.ObjectId(parent_id),
          };
        }
        let allMatch = Object.assign(
          {},
          condDeleted,
          condRegion,
          condNesting || {},
          condParent || {}
        );
        categories = await Categories.aggregate()
          .unwind("regions")
          .match(allMatch)
          .lookup({
            from: "users",
            localField: "regions.category.manager",
            foreignField: "_id",
            as: "regions.category.manager",
          })
          .sort({
            "regions.category.order": 1,
          })
          .group({
            _id: 0,
            categories: {
              $push: "$regions.category",
            },
          })
          .replaceRoot({
            categories: "$categories",
          });
      }
      if (parent_id && nesting >= 2) {
        products = await Products.aggregate([
          {
            $facet: {
              grouped: [
                {
                  $match: {
                    "regions.product.group": true,
                    "regions.product.category_id":
                      mongoose.Types.ObjectId(parent_id),
                    "regions.region": mongoose.Types.ObjectId(region),
                  },
                },
                {
                  $project: {
                    results: {
                      $filter: {
                        input: "$regions",
                        as: "el",
                        cond: {
                          $and: [
                            {
                              $eq: ["$$el.product.group", true],
                            },
                            {
                              $eq: ["$$el.product.deleted", false],
                            },
                            {
                              $eq: [
                                "$$el.region",
                                mongoose.Types.ObjectId(region),
                              ],
                            },
                            {
                              $eq: [
                                "$$el.product.category_id",
                                mongoose.Types.ObjectId(parent_id),
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
                  $lookup: {
                    from: "groups",
                    localField: "results.product.group_id",
                    foreignField: "regions.group._id",
                    as: "group",
                  },
                },
                {
                  $unwind: {
                    path: "$group",
                  },
                },
                {
                  $project: {
                    results: "$results",
                    group: {
                      $filter: {
                        input: "$group.regions",
                        as: "el",
                        cond: {
                          $and: [
                            {
                              $eq: [
                                "$$el.region",
                                mongoose.Types.ObjectId(region),
                              ],
                            },
                            {
                              $eq: [
                                "$$el.group.category_id",
                                mongoose.Types.ObjectId(parent_id),
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
                    path: "$group",
                  },
                },
                {
                  $project: {
                    _id: "$group.group._id",
                    title: "$group.group.title",
                    type: "group",
                    slug: "$group.group.title",
                    visible: "$group.group.visible",
                    category_id: "$group.group.category_id",
                    products: "$results.product",
                    groupProperties: "$group.group.groupProperties",
                  },
                },
                {
                  $group: {
                    _id: "$_id",
                    title: {
                      $first: "$title",
                    },
                    type: {
                      $first: "$type",
                    },
                    slug: {
                      $first: "$slug",
                    },
                    visible: {
                      $first: "$visible",
                    },
                    category_id: {
                      $first: "$category_id",
                    },
                    products: {
                      $push: "$products",
                    },
                    groupProperties: {
                      $first: "$groupProperties",
                    },
                  },
                },
              ],
              ungrouped: [
                {
                  $match: {
                    "regions.product.group": false,
                    "regions.product.category_id":
                      mongoose.Types.ObjectId(parent_id),
                    "regions.region": mongoose.Types.ObjectId(region),
                  },
                },
                {
                  $sort: {
                    "regions.product.article": 1,
                  },
                },
                {
                  $project: {
                    results: {
                      $filter: {
                        input: "$regions",
                        as: "el",
                        cond: {
                          $and: [
                            {
                              $eq: ["$$el.product.group", false],
                            },
                            {
                              $eq: ["$$el.product.deleted", false],
                            },
                            {
                              $eq: [
                                "$$el.region",
                                mongoose.Types.ObjectId(region),
                              ],
                            },
                            {
                              $eq: [
                                "$$el.product.category_id",
                                mongoose.Types.ObjectId(parent_id),
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
                  $replaceRoot: {
                    newRoot: "$results.product",
                  },
                },
              ],
            },
          },
          {
            $project: {
              product: {
                $concatArrays: ["$grouped", "$ungrouped"],
              },
            },
          },
          {
            $project: {
              product: 1,
              count: {
                $size: "$product",
              },
            },
          },
          {
            $facet: {
              productsList: [
                {
                  $unwind: {
                    path: "$product",
                  },
                },
                {
                  $sort: {
                    "product._id": -1,
                  },
                },
                {
                  $skip: +page * 15,
                },
                {
                  $limit: 15,
                },
                {
                  $group: {
                    _id: 0,
                    products: {
                      $push: "$product",
                    },
                    count: {
                      $first: "$count",
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$productsList",
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                products: "$productsList.products",
                count: "$productsList.count",
              },
            },
          },
        ]);
      }
    }
    const googleDoc = await gDocProducts
      .findOne({ region: mongoose.Types.ObjectId(region) })
      .populate({
        path: "region",
        model: "Regions",
        select: "_id title value",
      });
    let categoriesList =
      categories && categories[0] ? categories[0].categories : [];
    let productsList = products && products[0] ? products[0].products : [];
    let count = products && products[0] ? products[0].count : 0;

    res.status(200).json({
      categories: categoriesList,
      products: productsList,
      count: count,
      googleDoc: googleDoc || null,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    let region = req.body.region;
    let category_id = req.body.categoryId;

    let category = await Categories.aggregate([
      {
        $match: {
          "regions.category._id": mongoose.Types.ObjectId(category_id),
          "regions.region": mongoose.Types.ObjectId(region),
        },
      },
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $eq: ["$$el.region", mongoose.Types.ObjectId(region)],
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
    ]);

    let result = category[0] ? category[0].results.category : null;

    res.status(200).json({
      message: "OK",
      category: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getCategoriesViews = async (req, res, next) => {
  try {
    const { parent_id, region, nesting } = req.body;
    let categoryWithoutFormat = await Categories.aggregate([
      {
        $match: {
          "regions.category._id": mongoose.Types.ObjectId(parent_id),
        },
      },
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
                      "$$el.category._id",
                      mongoose.Types.ObjectId(parent_id),
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
    ]);
    let category = categoryWithoutFormat[0].results.category;
    let views;
    if (category.views.length) {
      views = await Categories.aggregate([
        {
          $match: {
            "regions.category._id": mongoose.Types.ObjectId(parent_id),
          },
        },
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
                        "$$el.category._id",
                        mongoose.Types.ObjectId(parent_id),
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "results.category.views",
            foreignField: "regions.category._id",
            as: "views",
          },
        },
        {
          $unwind: {
            path: "$views",
          },
        },
        {
          $project: {
            results: {
              $filter: {
                input: "$views.regions",
                as: "el",
                cond: {
                  $and: [
                    {
                      $eq: ["$$el.region", mongoose.Types.ObjectId(region)],
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
          $project: {
            category: {
              _id: "$results.category._id",
              categoryName: "$results.category.categoryName",
            },
          },
        },
        {
          $group: {
            _id: 0,
            views: {
              $push: "$category",
            },
          },
        },
      ]);
    } else {
      views = [];
    }
    let id = mongoose.Types.ObjectId(parent_id);
    let filtersAggregate, hasProducts;
    if (nesting >= 1) {
      hasProducts = await Products.count({
        "regions.region": mongoose.Types.ObjectId(region),
        "regions.product.category_id": mongoose.Types.ObjectId(parent_id),
      });
      let categoriesIds = await getSubCategoriesIds(region, [id]);
      categoriesIds.push(parent_id);
      categoriesIds = categoriesIds.map((id) => {
        return mongoose.Types.ObjectId(id);
      });
      filtersAggregate = await Products.aggregate()
        .match({
          "regions.region": mongoose.Types.ObjectId(region),
        })
        .match({
          "regions.product.category_id": { $in: categoriesIds },
        })
        .project({
          _id: null,
          product: {
            $filter: {
              input: "$regions",
              as: "region",
              cond: {
                $eq: ["$$region.region", mongoose.Types.ObjectId(region)],
              },
            },
          },
        })
        .project({
          _id: null,
          filters: "$product.product.options",
        })
        .unwind({ path: "$filters" })
        .unwind({ path: "$filters" })
        .replaceRoot("$filters")
        .replaceRoot({
          $arrayElemAt: [{ $objectToArray: "$$ROOT" }, 0],
        })
        .group({
          _id: null,
          filters: { $addToSet: "$k" },
        });
    }
    res.status(200).json({
      views: views && views[0] ? views[0].views : [],
      filters:
        filtersAggregate && filtersAggregate[0]
          ? filtersAggregate[0].filters
          : [],
      hasProducts: hasProducts && hasProducts > 0 ? true : false,
    });
  } catch (error) {
    next(error);
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    // Получаем данные
    const { region, nesting, categoryName, parent_value, views } = req.body;

    const images = req.files;

    let exist = false;

    const order = await Categories.aggregate([
      {
        $unwind: {
          path: "$regions",
        },
      },
      {
        $match: {
          "regions.category.nesting": +nesting,
          "regions.region": mongoose.Types.ObjectId(region),
        },
      },
      {
        $sort: {
          "regions.category.order": -1,
        },
      },
      { $limit: 1 },
      {
        $project: {
          order: "$regions.category.order",
        },
      },
      {
        $unwind: {
          path: "$order",
        },
      },
    ]);

    let lastOrder = order && order[0] && +order[0].order ? +order[0].order : 0;

    // Ищем похожие категории среди всех регионов
    const matchedCategories = await Categories.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $regexFind: {
                      input: "$$el.category.categoryName",
                      regex: new RegExp("^" + categoryName + "$", "i"),
                    },
                  },
                  {
                    $eq: [
                      "$$el.category.parent_id",
                      mongoose.Types.ObjectId(parent_value),
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
        $group: {
          _id: "$_id",
          results: {
            $addToSet: "$results.category",
          },
        },
      },
    ]);

    const category = {
      _id: mongoose.Types.ObjectId(),
      nesting: +nesting,
      order: +lastOrder,
      categoryName: categoryName,
      updates: [],
      visible: true,
    };
    if (typeof views !== "undefined") {
      if (views && views.length) {
        let viewsList = JSON.parse(views).map((view) =>
          mongoose.Types.ObjectId(view._id.toString())
        );

        category.views = viewsList;
      } else {
        category.views = [];
      }
    }
    if (parent_value) {
      category.parent_id = mongoose.Types.ObjectId(parent_value);
    }

    category.meta = {
      title: category.categoryName,
      keywords: category.categoryName,
      description: category.categoryName,
    };

    // Делаем cSlug
    category.cSlug = translit(_.kebabCase(categoryName))
      .replace(/'/g, "")
      .toLowerCase();
    req.categorySlug = category.cSlug;
    req.region = region;

    // Если совпадений нет - добавляем
    if (!matchedCategories.length) {
      // Создаем категорию
      if (images) {
        if (images.categoryImage) {
          // Image
          category.img = "";
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${category._id}/`
          );
          await uploadFilesFromTempToFolder(
            TEMP_PATH,
            UPLOADS_PATH,
            images.categoryImage[0].filename,
            `/catalog/${region}/categories/${category._id}/`
          );
          category.img = images.categoryImage[0].filename;
          category.path = `/uploads/catalog/${region}/categories/${category._id}/`;
        } else {
          category.img = "default.jpeg";
          category.path = "/uploads/";
        }
        if (images.categorySlide) {
          // Image
          category.slide = "";
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${category._id}/`
          );
          await uploadFilesFromTempToFolder(
            TEMP_PATH,
            UPLOADS_PATH,
            images.categorySlide[0].filename,
            `/catalog/${region}/categories/${category._id}/`
          );
          category.slide = images.categorySlide[0].filename;
          category.slidePath = `/uploads/catalog/${region}/categories/${category._id}/`;
        } else {
          category.slide = "default.jpeg";
          category.slidePath = "/uploads/";
        }
        if (images.categoryBanner) {
          // Image
          category.banner = "";
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${category._id}/`
          );
          await uploadFilesFromTempToFolder(
            TEMP_PATH,
            UPLOADS_PATH,
            images.categoryBanner[0].filename,
            `/catalog/${region}/categories/${category._id}/`
          );
          category.banner = images.categoryBanner[0].filename;
          category.bannerPath = `/uploads/catalog/${region}/categories/${category._id}/`;
        } else {
          category.banner = "default.jpeg";
          category.bannerPath = "/uploads/";
        }
        if (images.categoryIcon) {
          // Icon
          category.icon = "";
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${category._id}/`
          );
          await uploadFilesFromTempToFolder(
            TEMP_PATH,
            UPLOADS_PATH,
            images.categoryIcon[0].filename,
            `/catalog/${region}/categories/${category._id}/`
          );
          category.icon = images.categoryIcon[0].filename;
          category.iconPath = `/uploads/catalog/${region}/categories/${category._id}/`;
        } else {
          category.icon = "default.jpeg";
          category.iconPath = "/uploads/";
        }
      }
      const newCategory = await Categories.create({
        regions: [
          {
            region: mongoose.Types.ObjectId(region),
            category: category,
          },
        ],
      });

      await newCategory.save();
    } else {
      // Иначе у нас есть совпадения - добавляем в эту категорию регион
      let currentCategory = await Categories.aggregate([
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
                      $regexFind: {
                        input: "$$el.category.categoryName",
                        regex: new RegExp(
                          "^" + category.categoryName + "$",
                          "i"
                        ),
                      },
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
            path: "$results.category",
          },
        },
        {
          $project: {
            category: {
              _id: "$_id",
              categoryName: "$results.category.categoryName",
              cSlug: "$results.category.cSlug",
              link: "$results.category.link",
              nesting: "$results.category.nesting",
            },
          },
        },
      ]);

      // Если в таком регионе нет такой категории
      if (images) {
        if (images.categoryImage) {
          // Image
          category.img = "";

          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${category._id.toString()}`
          );
          await uploadFilesFromTempToFolder(
            TEMP_PATH,
            UPLOADS_PATH,
            images.categoryImage[0].filename,
            `/catalog/${region}/categories/${category._id}/`
          );
          category.img = images.categoryImage[0].filename;
          category.path = `/uploads/catalog/${region}/categories/${category._id}/`;
        } else {
          category.img = "default.jpeg";
          category.path = "/uploads/";
        }
        if (images.categorySlide) {
          // Image
          category.slide = "";
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${category._id}`
          );
          await uploadFilesFromTempToFolder(
            TEMP_PATH,
            UPLOADS_PATH,
            images.categorySlide[0].filename,
            `/catalog/${region}/categories/${category._id}`
          );
          category.slide = images.categorySlide[0].filename;
          category.slidePath = `/uploads/catalog/${region}/categories/${category._id}/`;
        } else {
          category.slide = "default.jpeg";
          category.slidePath = "/uploads/";
        }
        if (images.categoryBanner) {
          // Image
          category.banner = "";
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${category._id}`
          );
          await uploadFilesFromTempToFolder(
            TEMP_PATH,
            UPLOADS_PATH,
            images.categoryBanner[0].filename,
            `/catalog/${region}/categories/${category._id}/`
          );
          category.banner = images.categoryBanner[0].filename;
          category.bannerPath = `/uploads/catalog/${region}/categories/${category._id}/`;
        } else {
          category.img = "default.jpeg";
          category.path = "/uploads/";
        }
        if (images.categoryIcon) {
          // Icon
          category.icon = "";
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${category._id}`
          );
          await uploadFilesFromTempToFolder(
            TEMP_PATH,
            UPLOADS_PATH,
            images.categoryIcon[0].filename,
            `/catalog/${region}/categories/${category._id}/`
          );
          category.icon = images.categoryIcon[0].filename;
          category.iconPath = `/uploads/catalog/${region}/categories/${category._id}/`;
        } else {
          category.slide = "default.jpeg";
          category.slidePath = "/uploads/";
        }
      }
      // Обновляем категорию категорию
      const updatedCategory = await Categories.updateOne(
        {
          _id: mongoose.Types.ObjectId(matchedCategories[0]._id),
        },
        {
          $push: {
            regions: {
              region: mongoose.Types.ObjectId(region),
              category: category,
            },
          },
        }
      );
    }
    res.status(201).json({
      message: "ADDED",
      exist: exist,
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDataFromSearchQuery = async (req, res, next) => {
  try {
    let search = req.body.search,
      region = req.body.region;

    let categories = await Categories.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: ["$$el.category.deleted", false],
                  },
                  {
                    $eq: [
                      "$$el.region",
                      mongoose.Types.ObjectId(region.toString()),
                    ],
                  },
                  {
                    $regexFind: {
                      input: "$$el.category.categoryName",
                      regex: new RegExp(
                        "(w|s){0,}" + _.escape(search) + "(w|s){0,}",
                        "ui"
                      ),
                    },
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
          path: "$results.category",
        },
      },
      {
        $project: {
          category: {
            _id: "$results.category._id",
            img: "$results.category.img",
            path: "$results.category.path",
            icon: "$results.category.icon",
            iconPath: "$results.category.iconPath",
            categoryName: "$results.category.categoryName",
            manager: "$results.category.manager",
            cSlug: "$results.category.cSlug",
            link: "$results.category.link",
            nesting: "$results.category.nesting",
            views: "$results.category.views",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "category.manager",
          foreignField: "_id",
          as: "category.manager",
        },
      },
      {
        $group: {
          _id: 0,
          categories: {
            $push: "$category",
          },
        },
      },
    ]);
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
                      $eq: ["$$el.product.deleted", false],
                    },
                    {
                      $or: [
                        {
                          $regexFind: {
                            input: "$$el.product.title",
                            regex: new RegExp(
                              "(w|s){0,}" + _.escape(search) + "(w|s){0,}",
                              "ui"
                            ),
                          },
                        },
                        {
                          $regexFind: {
                            input: { $toString: "$$el.product.article" },
                            regex: new RegExp(
                              "(w|s){0,}" + _.escape(search) + "(w|s){0,}",
                              "ui"
                            ),
                          },
                        },
                      ],
                    },
                    {
                      $eq: [
                        "$$el.region",
                        mongoose.Types.ObjectId(region.toString()),
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
        $facet: {
          products: [
            {
              $project: {
                product: {
                  _id: "$results.regions.product._id",
                  images: "$results.regions.product.images",
                  options: "$results.regions.product.options",
                  order: "$results.regions.product.order",
                  article: "$results.regions.product.article",
                  link: "$results.regions.product.link",
                  category_id: "$results.regions.product.category_id",
                  brand_id: "$results.regions.product.brand_id",
                  title: "$results.regions.product.title",
                  path: "$results.regions.product.path",
                  cost: "$results.regions.product.cost",
                  full_cost: "$results.regions.product.full_cost",
                  slug: "$results.regions.product.slug",
                  club_cost: "$results.regions.product.club_cost",
                  full_club_cost: "$results.regions.product.full_club_cost",
                  recomended: "$results.regions.product.recomended",
                  buyed: "$results.regions.product.buyed",
                  discount: "$results.regions.product.discount",
                  discount_price: "$results.regions.product.discount_price",
                  discount_full_price:
                    "$results.regions.product.discount_full_price",
                  unit: "$results.regions.product.unit",
                  coef: "$results.regions.product.coef",
                  description: "$results.regions.product.description",
                  visible: "$results.regions.product.visible",
                  deleted: "$results.regions.product.deleted",
                  supplier_article: "$results.regions.product.supplier_article",
                  rrp: "$results.regions.product.rrp",
                  purchase_cost: "$results.regions.purchase_cost",
                  margin: "$results.regions.product.margin",
                  discount_percent: "$results.regions.product.discount_percent",
                  stop_cost: "$results.regions.product.stop_cost",
                },
              },
            },
            {
              $sort: {
                "product.order": 1,
              },
            },
            {
              $group: {
                _id: 0,
                productsListWithPagination: {
                  $push: "$product",
                },
              },
            },
          ],
          count: [
            {
              $group: {
                _id: 0,
                count: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$products",
        },
      },
      {
        $unwind: {
          path: "$count",
        },
      },
      {
        $project: {
          products: "$products.productsListWithPagination",
          count: "$count.count",
        },
      },
    ]);

    let categoriesList =
      categories && categories[0] ? categories[0].categories : [];
    let productsList = products && products[0] ? products[0].products : [];
    res.status(200).json({
      categories: categoriesList,
      products: productsList,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoriesBySearch = async (req, res, next) => {
  try {
    let search = req.body.title,
      region = req.body.region;

    let categories = await Categories.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: ["$$el.category.deleted", false],
                  },
                  {
                    $eq: [
                      "$$el.region",
                      mongoose.Types.ObjectId(region.toString()),
                    ],
                  },
                  {
                    $regexFind: {
                      input: "$$el.category.categoryName",
                      regex: new RegExp(
                        "(w|s){0,}" + _.escape(search) + "(w|s){0,}",
                        "ui"
                      ),
                    },
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
          path: "$results.category",
        },
      },
      {
        $project: {
          category: {
            _id: "$results.category._id",
            img: "$results.category.img",
            path: "$results.category.path",
            icon: "$results.category.icon",
            iconPath: "$results.category.iconPath",
            categoryName: "$results.category.categoryName",
            cSlug: "$results.category.cSlug",
            link: "$results.category.link",
            nesting: "$results.category.nesting",
            views: "$results.category.views",
          },
        },
      },
      {
        $limit: 5,
      },
      {
        $group: {
          _id: 0,
          categories: {
            $push: "$category",
          },
        },
      },
    ]);
    let categoriesList =
      categories && categories[0] ? categories[0].categories : [];
    res.status(200).json({
      views: categoriesList,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoriesAndBrandsBySearch = async (req, res, next) => {
  try {
    let search = req.body.title,
      region = req.body.region;

    let categories = await Categories.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: ["$$el.category.deleted", false],
                  },
                  {
                    $eq: [
                      "$$el.region",
                      mongoose.Types.ObjectId(region.toString()),
                    ],
                  },
                  {
                    $regexFind: {
                      input: "$$el.category.categoryName",
                      regex: new RegExp(
                        "(w|s){0,}" + _.escape(search) + "(w|s){0,}",
                        "ui"
                      ),
                    },
                  },
                  {
                    $gte: ["$$el.category.nesting", 1],
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
          path: "$results.category",
        },
      },
      {
        $group: {
          _id: 0,
          categories: {
            $push: "$results.category",
          },
        },
      },
    ]);

    let categoriesList =
      categories && categories[0] ? categories[0].categories : [];
    let result = categoriesList;
    res.status(200).json({
      views: result,
    });
  } catch (error) {
    next(error);
  }
};
exports.setManagerCategory = async (req, res, next) => {
  try {
    const { region, categoryId, managerId } = req.body;
    const updatedCategoryDB = await Categories.findOneAndUpdate(
      {
        "regions.category._id": mongoose.Types.ObjectId(categoryId),
        "regions.region": mongoose.Types.ObjectId(region),
      },
      {
        $set: {
          "regions.$.category.manager": managerId,
        },
      }
    ).lean();

    res.status(201).json({
      message: "MANAGER SET",
      updatedCategoryDB: updatedCategoryDB,
    });
  } catch (error) {
    next(error);
  }
};
exports.editCategory = async (req, res, next) => {
  try {
    const { region, categoryId, categoryName, views, categoryFilters, remove } =
      req.body;
    const images = req.files;
    const updatedCategory = await Categories.aggregate([
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
                      "$$el.category._id",
                      mongoose.Types.ObjectId(categoryId),
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
          path: "$results.category",
        },
      },
      {
        $group: {
          _id: "$_id",
          category: {
            $addToSet: "$results.category",
          },
        },
      },
    ]);

    let category = updatedCategory[0].category[0];
    if (typeof categoryFilters !== "undefined") {
      category.filters = JSON.parse(categoryFilters);
    }

    if (
      typeof categoryName !== "undefined" &&
      categoryName !== category.categoryName
    ) {
      category.categoryName = categoryName;
      category.cSlug = translit(_.kebabCase(categoryName))
        .replace(/'/g, "")
        .toLowerCase();
    }

    if (typeof views !== "undefined") {
      if (views && views.length) {
        let viewsList = JSON.parse(views).map((view) =>
          mongoose.Types.ObjectId(view._id.toString())
        );

        category.views = viewsList;
      } else {
        category.views = [];
      }
    }

    if (Array.isArray(images.categoryImage)) {
      // Image
      await makeUserDir(
        UPLOADS_PATH,
        `/catalog/${region}/categories/${category._id}`
      );
      await uploadFilesFromTempToFolder(
        TEMP_PATH,
        UPLOADS_PATH,
        images.categoryImage[0].filename,
        `catalog/${region}/categories/${category._id.toString()}/`
      );
      category.img = images.categoryImage[0].filename;
      category.path = `/uploads/catalog/${region}/categories/${category._id}/`;
    } else if (remove.includes("image")) {
      category.img = "default.jpeg";
      category.path = `/uploads/`;
    }

    if (Array.isArray(images.categorySlide)) {
      // Image
      await makeUserDir(
        UPLOADS_PATH,
        `/catalog/${region}/categories/${category._id}`
      );
      await uploadFilesFromTempToFolder(
        TEMP_PATH,
        UPLOADS_PATH,
        images.categorySlide[0].filename,
        `catalog/${region}/categories/${category._id.toString()}/`
      );
      category.slide = images.categorySlide[0].filename;
      category.slidePath = `/uploads/catalog/${region}/categories/${category._id}/`;
    } else if (remove.includes("slide")) {
      category.slide = "default.jpeg";
      category.slidePath = `/uploads/`;
    }
    if (Array.isArray(images.categoryBanner)) {
      // Image
      await makeUserDir(
        UPLOADS_PATH,
        `/catalog/${region}/categories/${category._id}`
      );
      await uploadFilesFromTempToFolder(
        TEMP_PATH,
        UPLOADS_PATH,
        images.categoryBanner[0].filename,
        `catalog/${region}/categories/${category._id.toString()}/`
      );
      category.banner = images.categoryBanner[0].filename;
      category.bannerPath = `/uploads/catalog/${region}/categories/${category._id}/`;
    } else if (remove.includes("banner")) {
      category.banner = "default.jpeg";
      category.bannerPath = `/uploads/`;
    }
    if (Array.isArray(images.categoryBannerMob)) {
      // Image
      await makeUserDir(
        UPLOADS_PATH,
        `/catalog/${region}/categories/${category._id}`
      );
      await uploadFilesFromTempToFolder(
        TEMP_PATH,
        UPLOADS_PATH,
        images.categoryBannerMob[0].filename,
        `catalog/${region}/categories/${category._id.toString()}/`
      );
      category.bannerMob = images.categoryBannerMob[0].filename;
      category.bannerPathMob = `/uploads/catalog/${region}/categories/${category._id}/`;
    } else if (remove.includes("bannerMob")) {
      category.bannerMob = "default.jpeg";
      category.bannerPathMob = `/uploads/`;
    }
    if (Array.isArray(images.categoryIcon)) {
      // Icon
      await makeUserDir(
        UPLOADS_PATH,
        `/catalog/${region}/categories/${category._id}`
      );
      await uploadFilesFromTempToFolder(
        TEMP_PATH,
        UPLOADS_PATH,
        images.categoryIcon[0].filename,
        `catalog/${region}/categories/${category._id.toString()}/`
      );
      category.icon = images.categoryIcon[0].filename;
      category.iconPath = `/uploads/catalog/${region}/categories/${category._id}/`;
    } else if (remove.includes("icon")) {
      category.icon = "default.jpeg";
      category.iconPath = `/uploads/`;
    }

    // category.updates.push({
    //     user: mongoose.Types.ObjectId(req.userId)
    // })

    const updatedCategoryDB = await Categories.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(updatedCategory[0]._id),
        "regions.region": mongoose.Types.ObjectId(region),
      },
      {
        $set: {
          "regions.$[regionEl].category": category,
        },
      },
      { arrayFilters: [{ "regionEl.region": mongoose.Types.ObjectId(region) }] }
    ).lean();
    res.status(201).json({
      message: "EDITED",
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.editCategoryOrder = async (req, res, next) => {
  try {
    const { region, categoryId, order } = req.body;

    const updatedCategory = await Categories.aggregate([
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
                      "$$el.category._id",
                      mongoose.Types.ObjectId(categoryId),
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
          path: "$results.category",
        },
      },
      {
        $group: {
          _id: "$_id",
          category: {
            $addToSet: "$results.category",
          },
        },
      },
    ]);

    let category = updatedCategory[0].category[0];
    category.order = +order;

    const updatedCategoryDB = await Categories.findOneAndUpdate(
      {
        "regions.category._id": mongoose.Types.ObjectId(categoryId),
        "regions.region": mongoose.Types.ObjectId(region),
      },
      {
        $set: {
          "regions.$.category": category,
        },
      }
    ).lean();
    res.status(201).json({
      message: "EDITED",
      category: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.body.categoryId;
    const region = req.body.region;

    let categories = [mongoose.Types.ObjectId(categoryId)];

    const parent = await Categories.aggregate([
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
                    $eq: ["$$el.category.deleted", false],
                  },
                  {
                    $eq: [
                      "$$el.category._id",
                      mongoose.Types.ObjectId(categoryId),
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
        $group: {
          _id: 0,
          category: {
            $addToSet: "$results.category",
          },
        },
      },
    ]);

    // Собираем ссылки на категории nesting = 1
    const deletedCategory = await Categories.aggregate([
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
                    $eq: ["$$el.category.deleted", false],
                  },
                  {
                    $eq: [
                      "$$el.category.parent_id",
                      mongoose.Types.ObjectId(categoryId),
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
        $group: {
          _id: 0,
          categories: {
            $addToSet: "$results.category._id",
          },
        },
      },
    ]);

    if (deletedCategory.length) {
      categories = categories.concat(deletedCategory[0].categories);

      for (let i = 0; i < deletedCategory[0].categories.length; i++) {
        let category = deletedCategory[0].categories[i];

        // Собираем id категорий nesting = 2
        const deletedSubCategory = await Categories.aggregate([
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
                        $eq: ["$$el.category.deleted", false],
                      },
                      {
                        $eq: [
                          "$$el.category.parent_id",
                          mongoose.Types.ObjectId(category),
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
            $group: {
              _id: 0,
              categories: {
                $addToSet: "$results.category._id",
              },
            },
          },
        ]);
        if (deletedSubCategory[0] && deletedSubCategory[0].categories) {
          categories = categories.concat(deletedSubCategory[0].categories);
        }
      }
    }

    for (let i = 0; i < categories.length; i++) {
      const updatedCategories = await Categories.updateMany(
        {
          regions: {
            $elemMatch: {
              "category.deleted": false,
              "category._id": mongoose.Types.ObjectId(categories[i]),
              region: mongoose.Types.ObjectId(region),
            },
          },
        },
        {
          $set: {
            "regions.$.category.deleted": true,
          },
        }
      );

      const updatedProducts = await Products.updateMany(
        {
          regions: {
            $elemMatch: {
              "product.deleted": false,
              "product.category_id": mongoose.Types.ObjectId(categories[i]),
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
    }

    res.status(201).json({
      message: "DELETED",
      category: categories[0],
    });
  } catch (error) {
    next(error);
  }
};

exports.copyCategory = async (req, res, next) => {
  function cloneAndChangeCategory(oldCategory, targetRegion) {
    const newPath = `/uploads/catalog/${targetRegion}/categories/${oldCategory._id}/`;

    if (oldCategory.meta && oldCategory.meta.title !== undefined)
      oldCategory.meta.title = "";
    if (oldCategory.meta && oldCategory.meta.keywords !== undefined)
      oldCategory.meta.keywords = "";
    if (oldCategory.meta && oldCategory.meta.description !== undefined)
      oldCategory.meta.description = "";

    if (oldCategory.path !== "/uploads/") oldCategory.path = newPath;
    if (oldCategory.slidePath !== "/uploads/") oldCategory.slidePath = newPath;
    if (oldCategory.bannerPath !== "/uploads/")
      oldCategory.bannerPath = newPath;
    if (oldCategory.iconPath !== "/uploads/") oldCategory.iconPath = newPath;

    oldCategory.description = "";

    return oldCategory;
  }

  function cloneAndChangeProduct(oldProduct, targetRegion) {
    if (oldProduct.meta && oldProduct.meta.title !== undefined)
      oldProduct.meta.title = "";
    if (oldProduct.meta && oldProduct.meta.keywords !== undefined)
      oldProduct.meta.title = "";
    if (oldProduct.meta && oldProduct.meta.description !== undefined)
      oldProduct.meta.title = "";

    if (oldProduct.path !== "/uploads/")
      oldProduct.path = `/uploads/catalog/${targetRegion}/categories/${oldProduct.category_id}/${oldProduct._id}/`;

    return oldProduct;
  }

  try {
    const categoryId = req.body.categoryId;
    const region = req.body.region;
    const targetRegion = req.body.targetRegion;

    // Ищем категорию
    const cluster = await Categories.aggregate([
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
                    $eq: ["$$el.category.deleted", false],
                  },
                  {
                    $eq: [
                      "$$el.category._id",
                      mongoose.Types.ObjectId(categoryId),
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
        $group: {
          _id: "$_id",
          category: { $addToSet: "$results.category" },
        },
      },
      {
        $unwind: {
          path: "$category",
        },
      },
    ]);
    // Ищем категорию в целевом регионе
    const targetCluster = await Categories.aggregate([
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "el",
              cond: {
                $and: [
                  {
                    $eq: ["$$el.region", mongoose.Types.ObjectId(targetRegion)],
                  },
                  {
                    $eq: [
                      "$$el.category._id",
                      mongoose.Types.ObjectId(categoryId),
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
        $group: {
          _id: "$_id",
          category: { $addToSet: "$results.category" },
        },
      },
      {
        $unwind: {
          path: "$category",
        },
      },
    ]);

    // Если категория уже есть и не удалена
    if (
      targetCluster[0] &&
      targetCluster[0].category &&
      !targetCluster[0].category.deleted
    ) {
      return res.status(400).json({
        message: "Категория уже в целевом регионе",
      });
    }

    let category = cluster[0].category;
    let categoriesIds = [category._id];
    let categories = [category];

    // Ищем все подкатегории
    // Второй уровень
    const ids = await Categories.aggregate([
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
                      "$$el.category.parent_id",
                      mongoose.Types.ObjectId(categoryId),
                    ],
                  },
                  {
                    $eq: ["$$el.category.deleted", false],
                  },
                  {
                    $eq: ["$$el.category.nesting", 1],
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
          _id: 0,
          categoriesIds: { $push: "$results.category._id" },
          categories: { $push: "$results.category" },
        },
      },
    ]);

    if (ids.length) {
      if (ids[0].categoriesIds)
        categoriesIds = categoriesIds.concat(ids[0].categoriesIds);
      if (ids[0].categories) categories = categories.concat(ids[0].categories);
    }

    // Третий уровень
    const thirdids = await Categories.aggregate([
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
                    $eq: ["$$el.category.deleted", false],
                  },
                  {
                    $in: ["$$el.category.parent_id", categoriesIds],
                  },
                  {
                    $eq: ["$$el.category.nesting", 2],
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
          _id: 0,
          categoriesIds: { $push: "$results.category._id" },
          categories: { $push: "$results.category" },
        },
      },
    ]);

    if (thirdids.length && thirdids[0].categoriesIds) {
      if (thirdids[0].categoriesIds)
        categoriesIds = categoriesIds.concat(thirdids[0].categoriesIds);
      if (thirdids[0].categories)
        categories = categories.concat(thirdids[0].categories);
    }

    // Ищем все продукты
    const products = await Products.aggregate([
      {
        $match: {
          $and: [
            { "regions.product.category_id": { $in: categoriesIds } },
            { "regions.product.deleted": { $eq: false } },
          ],
        },
      },
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "region",
              cond: {
                $eq: ["$$region.region", mongoose.Types.ObjectId(region)],
              },
            },
          },
        },
      },
      {
        $match: { "results.product": { $exists: true } },
      },
      {
        $project: {
          _id: 0,
          results: { $arrayElemAt: ["$results", 0] },
        },
      },
      {
        $replaceRoot: { newRoot: "$results.product" },
      },
    ]);

    // Ищем все группы
    const groups = await Groups.aggregate([
      {
        $match: {
          $and: [
            { "regions.group.category_id": { $in: categoriesIds } },
            // { 'regions.group.deleted': {$eq: false} },
          ],
        },
      },
      {
        $project: {
          results: {
            $filter: {
              input: "$regions",
              as: "region",
              cond: {
                $eq: ["$$region.region", mongoose.Types.ObjectId(region)],
              },
            },
          },
        },
      },
      {
        $match: { "results.group": { $exists: true } },
      },
      {
        $project: {
          _id: 0,
          results: { $arrayElemAt: ["$results", 0] },
        },
      },
      {
        $replaceRoot: { newRoot: "$results.group" },
      },
    ]);

    //Если в целевом регионе категория была удалена
    if (
      targetCluster[0] &&
      targetCluster[0].category &&
      targetCluster[0].category.deleted
    ) {
      console.dir(`Target Category ${targetCluster[0]._id} deleted`);

      // Обновляем все категории
      for (let i = 0; i < categories.length; i++) {
        const updatedCategory = await Categories.findOneAndUpdate(
          {
            "regions.category._id": mongoose.Types.ObjectId(categories[i]._id),
            "regions.region": mongoose.Types.ObjectId(targetRegion),
          },
          {
            $set: { "regions.$.category.deleted": false },
          }
        );

        // Если целевой регион не найден в категория то добавляем его в категорию
        if (!updatedCategory) {
          const createdCategory = cloneAndChangeCategory(
            categories[i],
            targetRegion
          );

          const createdCategoryResult = await Categories.updateOne(
            {
              "regions.category._id": mongoose.Types.ObjectId(
                categories[i]._id
              ),
            },
            {
              $addToSet: {
                regions: {
                  region: mongoose.Types.ObjectId(targetRegion),
                  category: createdCategory,
                },
              },
            }
          );

          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${categories[i]._id}/`
          );
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${targetRegion}/categories/${categories[i]._id}/`
          );

          await copyFolderRecursively(
            path.join(
              UPLOADS_PATH,
              `/catalog/${region}/categories/${categories[i]._id}/`
            ),
            path.join(
              UPLOADS_PATH,
              `/catalog/${targetRegion}/categories/${categories[i]._id}/`
            )
          );
        }
      }

      // Обновляем все товары
      for (let i = 0; i < products.length; i++) {
        const updatedCategory = await Products.findOneAndUpdate(
          {
            "regions.product._id": mongoose.Types.ObjectId(products[i]._id),
            "regions.region": mongoose.Types.ObjectId(targetRegion),
          },
          {
            $set: { "regions.$.product.deleted": false },
          }
        );

        // Если целевой регион не найден в категория то добавляем его в категорию
        if (!updatedCategory) {
          const createdProduct = cloneAndChangeProduct(
            products[i],
            targetRegion
          );

          const createdProductResult = await Products.updateOne(
            {
              "regions.product._id": mongoose.Types.ObjectId(products[i]._id),
            },
            {
              $addToSet: {
                regions: {
                  region: mongoose.Types.ObjectId(targetRegion),
                  product: createdProduct,
                },
              },
            }
          );
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${products[i].category_id}/${products[i]._id}`
          );
          await makeUserDir(
            UPLOADS_PATH,
            `/catalog/${targetRegion}/categories/${products[i].category_id}/${products[i]._id}`
          );

          await copyFolderRecursively(
            path.join(
              UPLOADS_PATH,
              `/catalog/${region}/categories/${products[i].category_id}/`
            ),
            path.join(
              UPLOADS_PATH,
              `/catalog/${targetRegion}/categories/${products[i].category_id}/`
            )
          );
        }
      }
      for (let i = 0; i < groups.length; i++) {
        if (!(i % 500)) console.log("copy groups i = ", i);

        const createdGroupResult = await Groups.updateOne(
          {
            "regions.group._id": mongoose.Types.ObjectId(groups[i]._id),
          },
          {
            $addToSet: {
              regions: {
                region: mongoose.Types.ObjectId(targetRegion),
                group: groups[i],
              },
            },
          }
        );
        if (!createdGroupResult.nModified)
          console.log(`Group ${groups[i]._id} not created`);
      }

      // Если в целевом регионе категории нет
    } else {
      console.dir(`Target Category in region ${targetRegion} don't exist`);
      // Создаем новые категории
      for (let i = 0; i < categories.length; i++) {
        if (!(i % 10)) console.log("copy categories i = ", i);

        const createdCategory = cloneAndChangeCategory(
          categories[i],
          targetRegion
        );

        const createdCategoryResult = await Categories.updateOne(
          {
            "regions.category._id": mongoose.Types.ObjectId(categories[i]._id),
          },
          {
            $addToSet: {
              regions: {
                region: mongoose.Types.ObjectId(targetRegion),
                category: createdCategory,
              },
            },
          }
        );

        await makeUserDir(
          UPLOADS_PATH,
          `/catalog/${region}/categories/${categories[i]._id}/`
        );
        await makeUserDir(
          UPLOADS_PATH,
          `/catalog/${targetRegion}/categories/${categories[i]._id}/`
        );

        await copyFolderRecursively(
          path.join(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${categories[i]._id}/`
          ),
          path.join(
            UPLOADS_PATH,
            `/catalog/${targetRegion}/categories/${categories[i]._id}/`
          )
        );

        if (!createdCategoryResult.nModified)
          console.log(`Category ${categories[i]._id} not created`);
      }
      // Создаем новые товары
      for (let i = 0; i < products.length; i++) {
        if (!(i % 500)) console.log("copy products i = ", i);

        const createdProduct = cloneAndChangeProduct(products[i], targetRegion);

        const createdProductResult = await Products.updateOne(
          {
            "regions.product._id": mongoose.Types.ObjectId(products[i]._id),
          },
          {
            $addToSet: {
              regions: {
                region: mongoose.Types.ObjectId(targetRegion),
                product: createdProduct,
              },
            },
          }
        );

        await makeUserDir(
          UPLOADS_PATH,
          `/catalog/${region}/categories/${products[i].category_id}/${products[i]._id}`
        );
        await makeUserDir(
          UPLOADS_PATH,
          `/catalog/${targetRegion}/categories/${products[i].category_id}/${products[i]._id}`
        );

        await copyFolderRecursively(
          path.join(
            UPLOADS_PATH,
            `/catalog/${region}/categories/${products[i].category_id}/`
          ),
          path.join(
            UPLOADS_PATH,
            `/catalog/${targetRegion}/categories/${products[i].category_id}/`
          )
        );

        if (!createdProductResult.nModified)
          console.log(`Product ${products[i]._id} not created`);
      }
      for (let i = 0; i < groups.length; i++) {
        if (!(i % 500)) console.log("copy groups i = ", i);

        const createdGroupResult = await Groups.updateOne(
          {
            "regions.group._id": mongoose.Types.ObjectId(groups[i]._id),
          },
          {
            $addToSet: {
              regions: {
                region: mongoose.Types.ObjectId(targetRegion),
                group: groups[i],
              },
            },
          }
        );
        if (!createdGroupResult.nModified)
          console.log(`Group ${groups[i]._id} not created`);
      }
    }
    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const getProductsIds = async (region, categoryIds) => {
  const model = mongoose.model("Products");
  const products = await model
    .aggregate()
    .match({
      "regions.region": mongoose.Types.ObjectId(region),
    })
    .match({
      "regions.product.category_id": { $in: categoryIds },
    })
    .project({
      _id: null,
      products: {
        $filter: {
          input: "$regions",
          as: "region",
          cond: {
            $eq: ["$$region.region", mongoose.Types.ObjectId(region)],
          },
        },
      },
    })
    .unwind("$products")
    .project({
      ids: "$products.product._id",
      title: "$products.product.title",
      group_id: "$products.product.group_id",
    })
    .group({
      _id: null,
      products_ids: { $addToSet: "$ids" },
      group_ids: { $addToSet: "$group_id" },
      title: { $addToSet: "$title" },
    });

  return {
    prodIds: products[0]
      ? products[0].products_ids
        ? products[0].products_ids
        : []
      : [],
    groupIds: products[0]
      ? products[0].group_ids
        ? products[0].group_ids
        : []
      : [],
  };
};

const getSubCategoriesIds = async (region, categoryIds) => {
  const subCategoriesId = await Categories.aggregate()
    .match({
      "regions.region": mongoose.Types.ObjectId(region),
      "regions.category.parent_id": { $in: categoryIds },
    })
    .project({
      _id: null,
      categories: {
        $filter: {
          input: "$regions",
          as: "region",
          cond: {
            $eq: ["$$region.region", mongoose.Types.ObjectId(region)],
          },
        },
      },
    })
    .unwind("$categories")
    .project({
      ids: "$categories.category._id",
      name: "$categories.category.categoryName",
    })
    .group({
      _id: null,
      category_ids: { $addToSet: "$ids" },
      names: { $addToSet: "$name" },
    });
  return subCategoriesId[0]
    ? subCategoriesId[0].category_ids
      ? subCategoriesId[0].category_ids
      : []
    : [];
};

const setProductsVisibilty = async (prodIds, groupIds, region, visible) => {
  if (prodIds.length) {
    prodIds = prodIds.map((id) => {
      return mongoose.Types.ObjectId(id);
    });
    await Products.updateMany(
      {
        "regions.product._id": { $in: prodIds },
        "regions.region": mongoose.Types.ObjectId(region),
      },
      {
        $set: {
          "regions.$[regionEl].product.visible": visible,
        },
      },
      {
        arrayFilters: [{ "regionEl.region": mongoose.Types.ObjectId(region) }],
      }
    );
  }
  if (groupIds.length) {
    groupIds = groupIds.map((id) => {
      return mongoose.Types.ObjectId(id);
    });
    await Groups.updateMany(
      {
        "regions.group._id": { $in: groupIds },
        "regions.region": mongoose.Types.ObjectId(region),
      },
      { $set: { "regions.$[regionEl].group.visible": visible } },
      { arrayFilters: [{ "regionEl.region": mongoose.Types.ObjectId(region) }] }
    );
  }
};

const setCategoryVisibility = async (catIds, region, visible, userId) => {
  await Categories.updateMany(
    {
      "regions.category._id": { $in: catIds },
      "regions.region": mongoose.Types.ObjectId(region),
    },
    {
      $set: {
        "regions.$[regionEl].category.visible": visible,
      },
      $addToSet: {
        "regions.$[regionEl].category.updates": {
          user: userId,
          type: "set_visibility",
        },
      },
    },
    {
      arrayFilters: [{ "regionEl.region": mongoose.Types.ObjectId(region) }],
    }
  );
};

const performVisibilityUpdate = async (catIds, region, visible, userId) => {
  await setCategoryVisibility(catIds, region, visible, userId);
  let { prodIds, groupIds } = await getProductsIds(region, catIds);
  catIds = await getSubCategoriesIds(region, catIds);
  catIds = catIds.map((id) => {
    return mongoose.Types.ObjectId(id);
  });

  if (catIds.length) {
    await performVisibilityUpdate(catIds, region, visible, userId);
  }
  await setProductsVisibilty(prodIds, groupIds, region, visible);
};

exports.editCategoryVisibility = async (req, res, next) => {
  try {
    let { region, categoryId, visible } = req.body;
    const userId = req.userId;
    categoryId = categoryId.map((id) => {
      return mongoose.Types.ObjectId(id);
    });

    await performVisibilityUpdate(categoryId, region, visible, userId);
    res.status(201).json({
      message: "EDITED",
      visible: visible,
    });
  } catch (error) {
    next(error);
  }
};
