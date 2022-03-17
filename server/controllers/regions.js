const mongoose = require('mongoose')
const Regions = require('../models/regions')
const { SALES_PATH, TEMP_PATH } = require("../utils/path");

const {
    uploadFilesFromTempToFolder,
    makeUserDir,
    removeUserDir,
    deleteUserUploadedFile,
    copyFolderRecursively,
} = require("../utils/fs");

exports.getRegions = async(req, res, next) => {
    try {
        console.log("get regions")
        const regions = await Regions.find().sort({ order: 1 }).lean()
        console.log("///////////////////////")
        console.log("Regions")
        console.log("///////////////////////")
        res.status(200).json({
            regions: regions
        })
    } catch (error) {
        next(error)
    }
}

exports.getRegionById = async(req, res, next) => {
    try {
        const regionId = req.body.regionId
        const region = await Regions.findById(regionId).lean()
        console.log("///////////////////////")
        console.log("Region")
        console.log(region)
        console.log("///////////////////////")
        res.status(200).json({
            region: region
        })
    } catch (error) {
        next(error)
    }
}

exports.getRegionBySlug = async(req, res, next) => {
    try {
        const regionSlug = req.body.slug
        const region = await Regions.find({value: regionSlug}).lean()
        res.status(200).json({
            region: region[0]
        })
    } catch (error) {
        next(error)
    }
}

exports.addRegion = async(req, res, next) => {
    try {
        const dataRegion = req.body
        const newRegion = await Regions.insertOne(dataRegion)
        console.log("///////////////////////")
        console.log("New Region")
        console.log(newRegion)
        console.log("///////////////////////")
        await newRegion.save()
        res.status(201).json({ message: "ADDED" })
    } catch (error) {
        next(error)
    }
}

exports.editRegion = async(req, res, next) => {
    try {
        console.log(req.body)
        const regionId = req.body.regionId
        const valute = req.body.valute
        const salesHref = req.body.salesHref
        const msalesHref = req.body.msalesHref
        await Regions.updateOne({
            _id: mongoose.Types.ObjectId(regionId)
        }, 
            [{ $set: { 'valute' : valute }}, {   
                $set: {
                    sales: {
                        $map: {
                            input: {$range: [0, { $size: "$sales"}]},
                            in: {
                                $mergeObjects: [
                                    { $arrayElemAt: [ "$sales", "$$this" ] },
                                    { href: { $arrayElemAt: [ salesHref, "$$this"] } }
                                ]
                            }
                        }
                    }
            }},
               { $set: {
                    msales: {
                        $map: {
                            input: {$range: [0, { $size: "$msales"}]},
                            in: {
                                $mergeObjects: [
                                    { $arrayElemAt: [ "$msales", "$$this" ] },
                                    { href: { $arrayElemAt: [ msalesHref, "$$this"] } }
                                ]
                            }
                        }
                    }
                }
            }
        ])

        console.log("///////////////////////")
        console.log("Updated Region")
        console.log("///////////////////////")
        res.status(204).json({ message: "EDITED" })
    } catch (error) {
        next(error)
    }
}

exports.deleteRegion = async(req, res, next) => {
    try {
        const regionId = req.body.regionId
        const deletedRegion = await Regions.deleteOne({ _id: regionId })
        console.log("///////////////////////")
        console.log("Deleted Region")
        console.log(deletedRegion)
        console.log("///////////////////////")
        res.status(204).json({ message: "DELETED" })
    } catch (error) {
        next(error)
    }
}

exports.replaceImageInRegionSales = async (req, res, next) => {
    try {
        let { index, type, region} = req.body
        let images = req.files.sale
        console.log(req.body)
        //let currentRegion = await Regions.findById(region)

        await makeUserDir(SALES_PATH, `${region}/`);
        await uploadFilesFromTempToFolder(
            TEMP_PATH,
            SALES_PATH,
            images[0].filename,
            `${region}/`
        )
        let arrayStr = type + "." + index + ".img"
        // let sale = {
        //     img: images[0].filename,
        //     href: sales[index].href
        // }
        let img = images[0].filename
        const updateRegion = await Regions.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(region)
        }, {
            $set: { [arrayStr] : img}
        })
        res.status(200).json()
    } catch (error) {
        next(error)
    }
}

exports.removeSalesFromRegion = async (req, res, next) => {
    try {
        let { index, type, region } = req.body
        //let currentRegion = await Regions.findById(region)
        let arrayStr = type + "." + index
        let sale = {
            img: null,
            href: null
        }
        await Regions.updateOne({
            _id: mongoose.Types.ObjectId(region)
        }, {
            $set: { [arrayStr] : sale}
        })
        res.status(200).json()
    } catch (error) {
        next(error)
    }
}