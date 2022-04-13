const mongoose = require("mongoose");
const { exec } = require("child_process");
const Region = require("../models/regions");
const Categories = require("../models/categories");
const Products = require("../models/products");
const path = require("path");
const fs = require("fs");
const Excel = require("exceljs");
const moment = require("moment");
const { STATIC_SITES_PATH, TEMP_PATH } = require("../utils/path");
const { uploadFilesFromTempToFolder } = require("../utils/fs");
const staticSites = require("../models/staticSites");
const { EXAMPLES } = require("../utils/excel");

exports.createSite = async (req, res, next) => {
  let { folder, url, category_id, categoryName, categories, content, manager } =
    req.body;
  // regions.map( r => mongoose.Types.ObjectId(r))
  // const regionsOfSite = await Region.aggregate()
  //     .match({
  //         _id: { $exists : true }
  //     })
  //     .project({
  //         _id: "$_id",
  //         value: "$value",
  //         active: { $literal: false}
  //     })

  const data = {
    url: url,
    category_id: category_id,
    categories: categories.map((c) => mongoose.Types.ObjectId(c)),
    categoryName: categoryName,
    folder: folder,
    region: mongoose.Types.ObjectId("5f85ba274a9a5d34e0a45fed"),
    origin: "н/д",
    content: content,
  };

  if (manager) {
    data.manager = [manager];
  }

  await staticSites.create(data);
  res.status(200).send({ message: "ok" });
};

exports.getSites = async (req, res, next) => {
  // let sites = await staticSites.find({}).lean()
  let result = [];
  let sites = await staticSites
    .aggregate()
    .lookup({
      from: "users",
      localField: "manager",
      foreignField: "_id",
      as: "manager",
    })
    .project({
      _id: "$_id",
      url: "$url",
      categoryName: "$categoryName",
      categories: "$categories",
      updatedAt: "$updatedAt",
      origin: "$origin",
      folder: "$folder",
      uploadedFile: "$uploadedFile",
      content: "$content",
      regionId: "$region",
    });
  await Promise.all(
    sites.map(async (s) => {
      let _region = await Region.findOne({
        _id: mongoose.Types.ObjectId(s.regionId),
      });
      return result.push({
        ...s,
        regionTitle: _region.title,
      });
    })
  );
  if (!sites) {
    return res.status(404).send({ message: "Нет настроенных сайтов" });
  }
  res.status(200).send({ data: result });
};

const getSubCategoriesIds = async (region, categoryIds) => {
  // доработать
  let subCategoriesId = await Categories.aggregate()
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
            $eq: ["$$region.category.deleted", false],
          },
        },
      },
    })
    .unwind("$categories")
    .project({
      ids: "$categories.category._id",
    })
    .group({
      _id: null,
      category_ids: { $addToSet: "$ids" },
    });
  subCategoriesId = subCategoriesId[0]
    ? subCategoriesId[0].category_ids
      ? subCategoriesId[0].category_ids
      : []
    : [];
  let result = [...new Set(subCategoriesId)]; // subCategoriesId.filter((item, pos)=> subCategoriesId.indexOf(item) === pos)
  return result;
};

async function getCategoryProducts(categories, region, articles) {
  let myMatch = {
    "regions.region": mongoose.Types.ObjectId(region),
    "regions.product.category_id": { $in: categories }, // mongoose.Types.ObjectId(category)
  };
  if (articles) {
    myMatch["regions.product.article"] = { $in: articles };
  }
  let productsFromCategory = await Products.aggregate()
    .match(myMatch)
    .project({
      product: {
        $filter: {
          input: "$regions",
          as: "el",
          cond: {
            $and: [
              {
                $eq: ["$$el.region", mongoose.Types.ObjectId(region)],
              },
              {
                $eq: ["$$el.product.deleted", false],
              },
              {
                $gte: ["$$el.product.cost", 0],
              },
            ],
          },
        },
      },
    })
    .project({
      product: "$product.product",
    })
    .unwind("$product")
    .sort({ "product.article": 1 })
    .project({
      _id: 0,
      article: "$product.article",
      visible: "$product.visible",
      id: "$product._id",
      title: "$product.title",
      cost: "$product.cost",
      club_cost: "$product.club_cost",
      options: "$product.options",
      images: "$product.images",
      path: "$product.path",
      unit: "$product.unit",
      coef: "$product.coef",
      description: "$product.description",
      slug: "$product.slug",
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

async function getAllCategoryIds(id, region) {
  let categoryIds = [id];
  categoryIds = categoryIds.map((id) => {
    return mongoose.Types.ObjectId(id);
  });
  let catsIdsTmp = [...categoryIds];
  for (i = 0; i < 2; i++) {
    catsIdsTmp = await getSubCategoriesIds(region, catsIdsTmp);
    categoryIds.push(...catsIdsTmp);
  }
  return categoryIds;
}

function writeJson(products, folder) {
  const json = JSON.stringify(products);
  const jsonPath = path.join(STATIC_SITES_PATH, `${folder}.json`);
  fs.writeFileSync(jsonPath, json);
}

exports.updateSite = async (req, res, next) => {
  const { id } = req.body;
  const site = await staticSites.findOne({ _id: mongoose.Types.ObjectId(id) });
  if (!site) {
    return res.status(404).send({ message: "Сайт неактивен" });
  }
  // if no "category_id" provided, then pick up "categories" array from site
  // ! default region - Moscow
  let categoryIds = [];
  if (site.category_id) {
    categoryIds = await getAllCategoryIds(site.category_id, site.region);
  }
  if (!site.category_id) {
    categoryIds = site.categories.map((c) => mongoose.Types.ObjectId(c));
  }

  let products = await getCategoryProducts(categoryIds, site.region, null);

  writeJson(products, site.folder);

  const command = `npm --prefix /var/www/static_sites/${site.folder} run export`;
  exec(command, async (error, stdout, stderr) => {
    if (error !== null) {
      console.log(`exec error: ${error}`);
      return res.status(500).send({ message: "Ошибка при обновлении" });
    }
    await staticSites.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { origin: "БД" }
    );
    res.status(200).send({ message: `Сайт ${site.url} обновлен` });
  });
};

exports.importPriceExcel = async (req, res, next) => {
  const { id } = req.body;
  const site = await staticSites.findOne({ _id: mongoose.Types.ObjectId(id) });
  if (!site) {
    return res.status(404).send({ message: "Сайт неактивен" });
  }
  const file = req.files.document[0];
  let categoryIds = [];
  let products = [];
  let articles = [];
  let productsFromExcel = [];
  let workbook = new Excel.Workbook();
  let book = await workbook.xlsx.readFile(file.path);

  if (site.regions.length !== 0) {
    await Promise.all(
      site.regions.map(async (r) => {
        let _tempProductsFromExcel = [];
        let _tempRegion = await Region.findOne({
          _id: mongoose.Types.ObjectId(r),
        });
        let _tempWorksheet = await book.getWorksheet(`${_tempRegion.title}`);
        await _tempWorksheet.eachRow(
          { includeEmpty: false },
          (row, rowNumber) => {
            if (rowNumber != 1) {
              let product = {};
              product.article = _tempWorksheet.getCell(`A${rowNumber}`).value;
              product.title = _tempWorksheet.getCell(`B${rowNumber}`).value;
              product.cost = _tempWorksheet.getCell(`C${rowNumber}`).value;
              articles.push(product.article);
              _tempProductsFromExcel.push(product);
            }
          }
        );
        if (!_tempProductsFromExcel.length) {
          res
            .status(404)
            .send({ message: "Импортируемый файл пуст или лист EXCEL пуст!" });
        }
        if (site.category_id) {
          categoryIds = await getAllCategoryIds(site.category_id, site.region);
        } else {
          categoryIds = site.categories.map((c) => mongoose.Types.ObjectId(c));
        }
        let _tempProducts = await getCategoryProducts(
          categoryIds,
          mongoose.Types.ObjectId(r),
          articles
        );
        if (!_tempProducts.length) {
          res.status(404).send({ message: "Несоответствие данных" });
        }
        for (p of _tempProducts) {
          let excelProduct = _tempProductsFromExcel.find(
            (ep) => ep.article == p.article
          );
          if (excelProduct) {
            p.cost = excelProduct.cost;
          }
        }
        writeJson(_tempProducts, site.folder + `${r}`);
      })
    );
  } else {
    let worksheet = await book.getWorksheet("Products");
    await worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber != 1) {
        let product = {};
        product.article = worksheet.getCell(`A${rowNumber}`).value;
        product.title = worksheet.getCell(`B${rowNumber}`).value;
        product.cost = worksheet.getCell(`C${rowNumber}`).value;
        articles.push(product.article);
        productsFromExcel.push(product);
      }
    });
    if (!productsFromExcel.length) {
      res.status(404).send({ message: "Импортируемый файл пуст!" });
    }
    if (site.category_id) {
      categoryIds = await getAllCategoryIds(site.category_id, site.region);
    } else {
      categoryIds = site.categories.map((c) => mongoose.Types.ObjectId(c));
    }
    products = await getCategoryProducts(categoryIds, site.region, articles);
    if (!products.length) {
      res.status(404).send({ message: "Несоответствие данных" });
    }
    for (p of products) {
      let excelProduct = productsFromExcel.find(
        (ep) => ep.article == p.article
      );
      if (excelProduct) {
        p.cost = excelProduct.cost;
      }
    }
    writeJson(products, site.folder);
  }

  await uploadFilesFromTempToFolder(
    TEMP_PATH,
    STATIC_SITES_PATH + "/uploaded",
    file.filename,
    ""
  );
  const command = `npm --prefix /var/www/static_sites/${site.folder} run export`;
  exec(command, async (error, stdout, stderr) => {
    if (error !== null) {
      console.log(`exec error: ${error}`);
      return res.status(500).send({ message: "Ошибка при обновлении" });
    }
    for (p of products) {
      let excelProduct = productsFromExcel.find(
        (ep) => ep.article == p.article
      );
      if (excelProduct) {
        p.cost = excelProduct.cost;
        p.title = excelProduct.title;
      }
    }
    await staticSites.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { origin: "Excel", uploadedFile: file.filename }
    );
    res.status(200).send({ message: `Сайт ${site.url} обновлен` });
  });
};

// exports.updateStaticSitesContent = async (req, res, next) => {};

exports.exportPriceExcel = async (req, res, next) => {
  const { id } = req.body;
  const site = await staticSites.findOne({ _id: mongoose.Types.ObjectId(id) });
  let workbook = new Excel.Workbook();
  let products = [];
  let categoryIds = [];
  if (site.regions.length) {
    await Promise.all(
      site.regions.map(async (r) => {
        if (site.category_id) {
          categoryIds = await getAllCategoryIds(
            site.category_id,
            mongoose.Types.ObjectId(r)
          );
        } else {
          categoryIds = site.categories.map((c) => mongoose.Types.ObjectId(c));
        }
        let _tempRegion = await Region.findOne({
          _id: mongoose.Types.ObjectId(r),
        });
        let _tempProducts = await getCategoryProducts(
          categoryIds,
          mongoose.Types.ObjectId(r),
          null
        );
        let _tempWorksheet = workbook.addWorksheet(`${_tempRegion.title}`);
        _tempWorksheet.columns = [
          { header: "Артикул", key: "article" },
          { header: "Наименование", key: "title" },
          { header: "Цена", key: "cost" },
        ];
        _tempWorksheet.columns.forEach((column, i) => {
          if (i === 0) column.width = 15;
          if (i === 1) column.width = 80;
          if (i === 2) column.width = 15;
        });
        _tempProducts.forEach((value) => {
          _tempWorksheet.addRow({
            ...value,
          });
        });
        return;
      })
    );
  } else {
    if (site.category_id) {
      categoryIds = await getAllCategoryIds(site.category_id, site.region);
    } else {
      categoryIds = site.categories.map((c) => mongoose.Types.ObjectId(c));
    }
    products = await getCategoryProducts(categoryIds, site.region, null);
    let worksheet = workbook.addWorksheet(`Products`);
    worksheet.columns = [
      { header: "Артикул", key: "article" },
      { header: "Наименование", key: "title" },
      { header: "Цена", key: "cost" },
    ];
    worksheet.columns.forEach((column, i) => {
      if (i === 0) column.width = 15;
      if (i === 1) column.width = 80;
      if (i === 2) column.width = 15;
    });
    products.forEach((value) => {
      worksheet.addRow({
        ...value,
      });
    });
  }

  //!
  let filePath = path.join(
    STATIC_SITES_PATH,
    "templates",
    `/${site.folder}.xlsx`
  );
  // let filePath = path.join('./', 'templates', `/${site.folder}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  res.status(200).download(filePath, `${site.folder}.xlsx`);
};

// for (let i = 0; i < global.users.length; i++) {
//     const user = global.users[i];
//     if (user.userId === req.userId) {
//         setTimeout(() => {
//             global.io.to(req.userId).emit("DownloadExcel", {
//                 link: `/uploads/staticsites/templates/${site.folder}.xlsx`,
//                 filename: `${site.folder}.xlsx`
//             })
//         }, 3000)
//     }
// }
// };
