const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const moment = require('moment');
const Regions = require('../models/regions');
const { feeds } = require('../utils/feeds');

exports.downloadFeed = async (req, res, next) => {
  try {
    const { region, category_id, nesting } = req.body;
    let date = moment(Date.now()).format();
    let category = await feeds.getCategory(region, category_id);
    let _region = await Regions.findOne({
      _id: mongoose.Types.ObjectId(region),
    });
    let filePath = '';
   
    switch (nesting) {
      case 2 | 3:
        {
          filePath = path.join('./uploads/feeds', `/${_region.title}_${category._id}.yml`);
          let cb = (a) => res.status(200).download(a);
          await feeds.updateFeed(region, category_id, cb);
        }
        break;
      case 1:
        {
          filePath = path.join('./uploads/feeds', `/${_region.title}_${category._id}.yml`);
          let categories = await feeds.getSubCategories(region, category_id, nesting);
          let xmlData = await feeds.createLargeFeed(
            region,
            categories.map((c) => ({
              _id: c._id,
              categoryName: c.categoryName,
            })),
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
        break;
      case 0:
        {
          let categories = await feeds.getSubCategories(region, category_id, 0);
          filePath = path.join('./uploads/feeds', `/${_region.title}_All.yml`);
          let _categories = await Promise.all(
            categories.map(async (_c) => {
              let _t = await feeds.getSubCategories(region, _c._id, 1);
              return _t.map((_tt) => ({
                _id: _tt._id,
                categoryName: _tt.categoryName,
              }));
            })
          );
          let xmlData = await feeds.createLargeFeed(
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
        break;

      default:
        {
          res.status(500).send({ message: 'Ошибка при скачивании' });
        }
        break;
    }
  } catch (error) {
    next(error);
  }
};

exports.askALink = async (req, res, next) => {
  try {
    const { region, category_id, nesting } = req.body;
    let date = moment(Date.now()).format();
    let category = await feeds.getCategory(region, category_id);
    let _region = await Regions.findOne({
      _id: mongoose.Types.ObjectId(region),
    });
    let filePath = '';
    switch (nesting) {
      case 2:
        {
          filePath = path.join('./uploads/feeds', `/${_region.title}_${category._id}.yml`);
        }
        break;
      case 1:
        {
          filePath = path.join('./uploads/feeds', `/${_region.title}_${category._id}.yml`);
        }
        break;
      case 0:
        {
          filePath = path.join('./uploads/feeds', `/${_region.title}_All.yml`);
        }
        break;
      default:
        break;
    }
    filePath = path.join('https://xn--j1ano.com/uploads/feeds', `/${_region.title}_All.yml`);
    res.status(200).json(filePath);
  } catch (error) {
    next(error);
  }
};
