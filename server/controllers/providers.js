const mongoose = require('mongoose')
const { findById } = require('../models/providers')
const Provider = require('../models/providers')
const _ = require('lodash')

exports.getProviders = async (req, res, next) => {
  try {
    const page = +req.query.page - 1
    const { region } = req.body.options
    const myMatch = {}

    if (region && region !== 'all') {
      myMatch.region = mongoose.Types.ObjectId(region)
    }

    const providersAggregate = await Provider.aggregate()
      .match(myMatch)
      .facet({
        elements: new mongoose.Aggregate()
          .skip(15 * page)
          .limit(15)
          .lookup({
            from: 'regions',
            let: {
              region: '$region',
            },
            pipeline: [
              ...new mongoose.Aggregate()
                .match({ 
                  $expr: {
                    $eq: ['$_id', '$$region']
                  }
                })
                .pipeline(),
            ],
            as: 'region',
          })
          .unwind({ path: "$region", })
          .pipeline(),
        count: new mongoose.Aggregate().count('count').pipeline(),
      })

    const count = providersAggregate[0].count.length ? providersAggregate[0].count[0].count : 0
    const providers = providersAggregate[0].elements

    console.log('///////////////////////')
    console.log('Providers')
    console.log('///////////////////////')
    res.status(200).json({ providers, count })
  } catch (error) {
    next(error)
  }
}

exports.getProvidersByName = async (req, res, next) => {
  try {
    const title = req.body.title
    console.log('debug - getProvidersByName', title)

    const providers = await Provider.aggregate([
      {
        $addFields: {
          providers: {
            $regexMatch: {
              input: '$name',
              regex: new RegExp('(w|s){0,}' + _.escape(title) + '(w|s){0,}', 'ui'),
            },
          },
        },
      },
      {
        $match: { providers: true },
      },
    ])
    console.log('///////////////////////')
    console.log('Providers')
    console.log('debug - providers', providers[0])

    console.log('///////////////////////')
    res.status(200).json({ provider: providers[0] })
  } catch (error) {
    next(error)
  }
}

exports.addProvider = async (req, res, next) => {
  try {
    const dataProvider = req.body.provider
    if (typeof dataProvider.categories !== 'undefined') {
      if (dataProvider.categories && dataProvider.categories.length) {
        console.log(dataProvider.categories)
        let viewsList = dataProvider.categories.map((Category) =>
          mongoose.Types.ObjectId(Category._id.toString())
        )
        dataProvider.categories = viewsList
      } else {
        dataProvider.categories = []
      }
    }
    const newProvider = await Provider.create(dataProvider)
    console.log('///////////////////////')
    console.log('New Provider')
    console.log('///////////////////////')
    await newProvider.save()
    res.status(201).json({
      message: 'ADDED',
      provider: newProvider,
    })
  } catch (error) {
    next(error)
  }
}

exports.editProvider = async (req, res, next) => {
  try {
    const providerId = req.body.providerId
    const dataProvider = req.body.provider
    let provider = await Provider.findById(providerId).lean()

    if (typeof dataProvider.categories !== 'undefined') {
      if (dataProvider.categories && dataProvider.categories.length) {
        console.log(dataProvider.categories)
        let viewsList = dataProvider.categories.map((categories) =>
          mongoose.Types.ObjectId(categories._id.toString())
        )
        provider.categories = viewsList
      } else {
        provider.categories = []
      }
    }

    if (typeof dataProvider.name !== 'undefined') {
      provider.name = dataProvider.name
    }
    if (typeof dataProvider.site !== 'undefined') {
      provider.site = dataProvider.site
    }
    if (typeof dataProvider.inn !== 'undefined') {
      provider.inn = dataProvider.inn
    }
    if (typeof dataProvider.office_address !== 'undefined') {
      provider.office_address = dataProvider.office_address
    }
    if (typeof dataProvider.warehouse_address !== 'undefined') {
      provider.warehouse_address = dataProvider.warehouse_address
    }
    if (typeof dataProvider.specialist !== 'undefined') {
      provider.specialist = dataProvider.specialist
    }
    if (typeof dataProvider.director !== 'undefined') {
      provider.director = dataProvider.director
    }
    if (typeof dataProvider.region !== 'undefined') {
      provider.region = mongoose.Types.ObjectId(dataProvider.region._id.toString())
    }

    console.log(dataProvider.categories)
    const updateProvider = await Provider.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(providerId),
      },
      {
        ...provider,
      }
    )
    console.log('///////////////////////')
    console.log('Updated Provider')
    console.log('///////////////////////')
    res.status(201).json({ message: 'EDITED', provider: { ...provider, region: dataProvider.region} })
  } catch (error) {
    next(error)
  }
}

exports.deleteProvider = async (req, res, next) => {
  try {
    const providerId = req.body.providerId
    const deletedProvider = await Provider.findOneAndDelete({ _id: providerId }).lean()
    console.log('///////////////////////')
    console.log('Deleted Event')
    console.log('///////////////////////')
    res.status(201).json({
      message: 'DELETED',
      provider: deletedProvider,
    })
  } catch (error) {
    next(error)
  }
}

exports.getProvidersCategories = async (req, res, next) => {
  try {
    const { parent_id, region } = req.body

    let provider = await Provider.findById(parent_id)
    let categories
    if (provider.categories.length) {
      categories = await Provider.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(parent_id),
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: 'regions.category._id',
            as: 'categories',
          },
        },
        {
          $unwind: {
            path: '$categories',
          },
        },
        {
          $project: {
            results: {
              $filter: {
                input: '$categories.regions',
                as: 'el',
                cond: {
                  $and: [
                    {
                      $eq: ['$$el.region', mongoose.Types.ObjectId(region)],
                    },
                  ],
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
        {
          $group: {
            _id: 0,
            categories: {
              $push: '$results.category',
            },
          },
        },
      ])
    } else {
      categories = []
    }
    res.status(200).json({
      categories: categories && categories[0] ? categories[0].categories : [],
    })
  } catch (error) {
    next(error)
  }
}

exports.getDataFromSearchQuery = async (req, res, next) => {
  try {
    let search = req.body.search

    let providers = await Provider.aggregate()
      .match({
        $or: [
          { name: { $regex: new RegExp('(w|s){0,}' + _.escape(search) + '(w|s){0,}', 'ui') } },
          {
            'specialist.name': {
              $regex: new RegExp('(w|s){0,}' + _.escape(search) + '(w|s){0,}', 'ui'),
            },
          },
        ],
      })
      .lookup({
        from: 'regions',
        let: {
          region: '$region',
        },
        pipeline: [
          ...new mongoose.Aggregate()
            .match({ 
              $expr: {
                $eq: ['$_id', '$$region']
              }
            })
            .pipeline(),
        ],
        as: 'region',
      })
      .unwind({ path: "$region", })
   
    console.log('///////////////////////')
    console.log('Categories')
    console.log('///////////////////////')
    res.status(200).json({ providers })
  } catch (error) {
    next(error)
  }
}
