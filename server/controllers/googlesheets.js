const mongoose = require('mongoose')
const { google } = require('googleapis')
const gDocProducts = require('../models/gDocProducts')
const Region = require('../models/regions')
const Categories = require('../models/categories')
const Products = require('../models/products')
const path = require("path");
const fs = require("fs")
const moment = require('moment')
const { G_DOCS_PRODUCTS_PATH, ROOT } = require('../utils/path')
const { makeUserDir, removeUserDir, deleteUserUploadedFile } = require('../utils/fs')


const addSheet = async (region, categoryId, categoryName) => {

	let products = await setHeaderRows(region)
	const productsFromRegion = await getProductsFromRegion(region, [categoryId])
	for (p of productsFromRegion) {
		let values = []
		values.push(p.article, p.title, p.cost, p.club_cost, p.category[0].category.categoryName, p.coef)
		products.push(values)
	}

	writeJson(products, region, categoryId)

	const existedDoc = await gDocProducts.findOne({ region })
	if (existedDoc.sheets.some(sheet => sheet.categoryId === categoryId)) {
		return "Категория уже существует в документе";
	}
	const request = {
		"spreadsheetId": existedDoc.spreadsheetId,
		"resource": {
			"requests": [
				{
					"addSheet": {
						"properties": {
							"title": categoryName
						},
					}
				}]
		}
	}

	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(ROOT, process.env.GOOGLE_API),
		scopes: "https://www.googleapis.com/auth/spreadsheets"
	})
	const client = await auth.getClient()
	const googleSheets = google.sheets({ version: "v4", auth: client })


	await googleSheets.spreadsheets.batchUpdate(request)
	const metaData = await googleSheets.spreadsheets.get({
		auth,
		spreadsheetId: existedDoc.spreadsheetId
	})
	const sheetId = (metaData.data.sheets.filter(sheet => sheet.properties.title === categoryName))[0].properties.sheetId

	await googleSheets.spreadsheets.values.update({
		auth,
		spreadsheetId: existedDoc.spreadsheetId,
		range: `${categoryName}!A1`,
		valueInputOption: "USER_ENTERED",
		resource: {
			values: products
		}
	})
		.then(async () => {
			await updateHeader(existedDoc.spreadsheetId, sheetId)
			let sheet = {
				sheetId: sheetId,
				categoryName: categoryName,
				categoryId: categoryId
			}
			await gDocProducts.updateOne({ region },
				{
					$addToSet: { "sheets": sheet }
				})
		})

	return "Все прошло успешно";
}

// заполнение google таблицы данными из базы данных
const fillProductDataInGoogleTable = async (categoriesData, region) => {
	console.log('========== fillProductDataInGoogleTable ===========');
	try {

		for (let i = 0; i < categoriesData.length; i++) {
			const { _id, categoryName } = categoriesData[i]
			const res = await addSheet(region, _id, categoryName)
			if (res == 'Все прошло успешно') console.log(`Таблица "${categoryName}" - готова!`);
			else {
				return {
					status: "mistake",
					msg: `Не удалось загрузить таблицу - ${categoryName}`
				}
			}
		}

	} catch (error) {
		console.log(`func fillProductDataInGoogleTable ${error}`);
		return {
			status: "error",
			msg: `Не удалось загрузить таблицы возникла ошибка`
		}
	}

}

exports.linkDocToRegion = async (req, res, next) => {
	try {
		const { region, spreadsheetId, categoriesData } = req.body

		const auth = new google.auth.GoogleAuth({
			keyFile: path.join(ROOT, process.env.GOOGLE_API),
			scopes: "https://www.googleapis.com/auth/spreadsheets"
		})
		const client = await auth.getClient()
		const googleSheets = google.sheets({ version: "v4", auth: client })

		const sheet = await googleSheets.spreadsheets.get({
			auth,
			spreadsheetId,
		}).catch(err => console.log(err.data))
		if (!sheet) {
			return res.status(404).send({ message: "Документ не найден" })
		}

		const regionSheet = await gDocProducts.findOne({ spreadsheetId }).populate({
			path: 'region',
			select: '_id title value'
		})

		if (regionSheet) {
			const message = "Документ уже привязан к региону " + regionSheet.region.title
			return res.status(403).send({ message })
		}

		const gDoc = {
			region,
			spreadsheetId,
			sheets: []
		}

		const newRegionSheet = await gDocProducts.create(gDoc)
		await newRegionSheet.save()
		await makeUserDir(G_DOCS_PRODUCTS_PATH, `${region}`)

		const resFill = await fillProductDataInGoogleTable(categoriesData, region)

		if (resFill?.status === 'error' || resFill?.status === 'mistake') {
			res.send({
				message: "Документ добавлен. Не удалось загрузить данные в google таблицу",
				data: newRegionSheet
			})
		} else {
			res.send({
				message: "Документ добавлен. Данные добавлены в google таблицу",
				data: newRegionSheet
			})
		}


	} catch (error) {
		console.log('linkDocToRegion ' + error);
	}
}

exports.unlinkDocRegion = async (req, res, next) => {
	let { region } = req.body
	const existedDoc = await gDocProducts.findOne({ region: mongoose.Types.ObjectId(region) })
	if (!existedDoc) {
		res.status(404).send({ message: "Документ не найден" })
	}
	for (sheet of existedDoc.sheets) {
		await deleteSheet(region, sheet.categoryId, existedDoc)
	}
	await gDocProducts.deleteOne({ region: mongoose.Types.ObjectId(region) })
	res.status(200).send({ message: "Документ обнулен" })
}

async function getProductsFromRegion(region, categoryId) {
	categoryId = categoryId.map(id => { return mongoose.Types.ObjectId(id) })
	let catsIds = [...categoryId]
	for (i = 0; i < 4; i++) {
		catsIds = await getSubCategoriesIds(region, catsIds)
		categoryId.push(...catsIds)
	}
	let productsFromRegion = await Products.aggregate()
		.match({
			"regions.region": mongoose.Types.ObjectId(region),
			"regions.product.category_id": { $in: categoryId }
		})
		.project({
			results: {
				$filter: {
					input: '$regions',
					as: 'el',
					cond: {
						$and: [
							{
								$eq: ['$$el.region', mongoose.Types.ObjectId(region)],
							},
							{
								$eq: ['$$el.product.deleted', false]
							},
							{
								$gte: ["$$el.product.cost", 0]
							}
						]
					}
				},
			},
			lastModified: "$updatedAt"
		})
		.project({
			"results": "$results",
			"lastModified": "$lastModified"
		})
		.unwind('$results')
		.group({
			_id: "$_id",
			product: {
				$push: '$results.product'
			},
			lastModified: {
				$push: "$lastModified"
			}
		})
		.unwind("$product")
		.unwind("$lastModified")
		.sort({ "product.article": 1 })
		.lookup({
			from: 'categories',
			localField: 'product.category_id',
			foreignField: 'regions.category._id',
			as: 'product.category'
		})
		.unwind("$product.category")
		.project({
			_id: 0,
			article: "$product.article",
			visible: "$product.visible",
			id: "$product._id",
			title: "$product.title",
			cost: "$product.cost",
			club_cost: "$product.club_cost",
			full_cost: "$product.full_cost",
			full_club_cost: "$product.cost",
			options: "$product.options",
			images: "$product.images",
			unit: "$product.unit",
			coef: "$product.coef",
			description: "$product.description",
			lastModified: "$lastModified",
			category: {
				$filter: {
					input: '$product.category.regions',
					as: 'el',
					cond: {
						$and: [
							{
								'$eq': [
									'$$el.region',
									mongoose.Types.ObjectId(region)
								],
							},

						]
					}
				},
			}
		})
	return productsFromRegion
}

async function compareProductsData(json, gDoc) {
	let changes = []
	for (let row = 2; row < gDoc.length; row++) {
		gDoc[row][0] = Number.parseInt(gDoc[row][0])

		gDoc[row][2] = gDoc[row][2].replace(",", ".")
		gDoc[row][2] = Number.parseFloat(gDoc[row][2])

		gDoc[row][3] = gDoc[row][3].replace(",", ".")
		gDoc[row][3] = Number.parseFloat(gDoc[row][3]) || null
		gDoc[row][5] = Number.parseFloat(json[row][5]) || null
		let matched = json.find(p => p[0] == gDoc[row][0])
		if (matched) {
			if (matched[2] != gDoc[row][2] || matched[3] != gDoc[row][3]) {
				changes.push(gDoc[row])
			}
		}
	}
	return changes
}

function writeJson(products, region, categoryId) {
	const jsonObj = {
		"values": products,
	}
	const json = JSON.stringify(jsonObj)
	const jsonPath = path.join(G_DOCS_PRODUCTS_PATH, region, `${categoryId}.json`)
	fs.writeFileSync(jsonPath, json);
}

async function updateHeader(spreadsheetId, sheetId) {
	console.log('========== updateHeader ============');
	const request = {
		"spreadsheetId": spreadsheetId,
		"resource": {
			"requests": [
				{
					"repeatCell": {
						"range": {
							"sheetId": sheetId,
							"startRowIndex": 0,
							"endRowIndex": 1
						},
						"cell": {
							"userEnteredFormat": {
								"backgroundColor": {
									"red": 0.1,
									"green": 0.1,
									"blue": 0.1
								},
								"horizontalAlignment": "CENTER",
								"verticalAlignment": "MIDDLE",
								"textFormat": {
									"foregroundColor": {
										"red": 1.0,
										"green": 1.0,
										"blue": 1.0
									},
									"fontSize": 12,
									"bold": true
								}
							}
						},
						"fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
					}
				},
				{
					"repeatCell": {
						"range": {
							"sheetId": sheetId,
							"startRowIndex": 1,
							"endRowIndex": 2
						},
						"cell": {
							"userEnteredFormat": {
								"backgroundColor": {
									"red": 0.5,
									"green": 0.5,
									"blue": 0.5
								},
								"horizontalAlignment": "CENTER",
								"textFormat": {
									"foregroundColor": {
										"red": 1.0,
										"green": 1.0,
										"blue": 1.0
									},
									"fontSize": 12,
									"bold": true
								}
							}
						},
						"fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
					}
				},
				{
					"repeatCell": {
						"range": {
							"sheetId": sheetId,
							"startColumnIndex": 0,
							"endColumnIndex": 1,
						},
						"cell": {
							"userEnteredFormat": {
								"horizontalAlignment": "CENTER",
							}
						},
						"fields": "userEnteredFormat(horizontalAlignment)"
					}
				},
				{
					"repeatCell": {
						"range": {
							"sheetId": sheetId,
							"startColumnIndex": 2,
							"endColumnIndex": 4,
						},
						"cell": {
							"userEnteredFormat": {
								"horizontalAlignment": "CENTER",
							}
						},
						"fields": "userEnteredFormat(horizontalAlignment)"
					}
				},
				{
					"updateSheetProperties": {
						"properties": {
							"sheetId": sheetId,
							"gridProperties": {
								"frozenRowCount": 2
							}
						},
						"fields": "gridProperties.frozenRowCount"
					}
				},
				{
					"autoResizeDimensions": {
						"dimensions": {
							"sheetId": sheetId,
							"dimension": "COLUMNS",
							"startIndex": 0,
							"endIndex": 4
						}
					}
				},
				{
					"updateDimensionProperties": {
						"range": {
							"sheetId": sheetId,
							"dimension": "ROWS",
							"startIndex": 0,
							"endIndex": 1
						},
						"properties": {
							"pixelSize": 70
						},
						"fields": "pixelSize"
					}
				},
				{
					"updateDimensionProperties": {
						"range": {
							"sheetId": sheetId,
							"dimension": "COLUMNS",
							"startIndex": 2,
							"endIndex": 3
						},
						"properties": {
							"pixelSize": 150
						},
						"fields": "pixelSize"
					}
				},
				{
					"updateDimensionProperties": {
						"range": {
							"sheetId": sheetId,
							"dimension": "COLUMNS",
							"startIndex": 4,
							"endIndex": 5
						},
						"properties": {
							"pixelSize": 240
						},
						"fields": "pixelSize"
					}
				},
				{
					"updateDimensionProperties": {
						"range": {
							"sheetId": sheetId,
							"dimension": "COLUMNS",
							"startIndex": 5,
							"endIndex": 6
						},
						"properties": {
							"pixelSize": 140
						},
						"fields": "pixelSize"
					}
				},
				{
					"addProtectedRange": {
						"protectedRange": {
							"range": {
								"sheetId": sheetId,
								"startRowIndex": 0,
								"endRowIndex": 1
							},
							"description": "Protecting total row",
							"warningOnly": false
						}
					}
				}
			]
		}
	}
	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(ROOT, process.env.GOOGLE_API),
		scopes: "https://www.googleapis.com/auth/spreadsheets"
	})
	const client = await auth.getClient()
	const googleSheets = google.sheets({ version: "v4", auth: client })


	await googleSheets.spreadsheets.batchUpdate(request)
}

exports.addSheet = async (req, res, next) => {
	let { region, categoryId, categoryName } = req.body

	let products = await setHeaderRows(region)
	const productsFromRegion = await getProductsFromRegion(region, [categoryId])
	for (p of productsFromRegion) {
		let values = []
		values.push(p.article, p.title, p.cost, p.club_cost, p.category[0].category.categoryName, p.coef)
		products.push(values)
	}

	writeJson(products, region, categoryId)

	const existedDoc = await gDocProducts.findOne({ region })
	if (existedDoc.sheets.some(sheet => sheet.categoryId === categoryId)) {
		return res.status(500).send({ message: "Категория уже существует в документе" })
	}
	const request = {
		"spreadsheetId": existedDoc.spreadsheetId,
		"resource": {
			"requests": [
				{
					"addSheet": {
						"properties": {
							"title": categoryName
						},
					}
				}]
		}
	}

	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(ROOT, process.env.GOOGLE_API),
		scopes: "https://www.googleapis.com/auth/spreadsheets"
	})
	const client = await auth.getClient()
	const googleSheets = google.sheets({ version: "v4", auth: client })


	await googleSheets.spreadsheets.batchUpdate(request)
	const metaData = await googleSheets.spreadsheets.get({
		auth,
		spreadsheetId: existedDoc.spreadsheetId
	})
	const sheetId = (metaData.data.sheets.filter(sheet => sheet.properties.title === categoryName))[0].properties.sheetId

	await googleSheets.spreadsheets.values.update({
		auth,
		spreadsheetId: existedDoc.spreadsheetId,
		range: `${categoryName}!A1`,
		valueInputOption: "USER_ENTERED",
		resource: {
			values: products
		}
	})
		.then(async () => {
			await updateHeader(existedDoc.spreadsheetId, sheetId)
			let sheet = {
				sheetId: sheetId,
				categoryName: categoryName,
				categoryId: categoryId
			}
			await gDocProducts.updateOne({ region },
				{
					$addToSet: { "sheets": sheet }
				})
		})

	res.status(200).send({ message: "Категория добавлена в документ", data: metaData })
}

function getUpdatedProduct(params, region) {
	let set = {
		// "regions.$[regionEl].product.title": params.title,
		// "regions.$[regionEl].product.unit": params.unit,
		// "regions.$[regionEl].product.visible": params.visible,
		// "regions.$[regionEl].product.coef": params.coef,
		"regions.$[regionEl].product.cost": params[2],
		"regions.$[regionEl].product.club_cost": params[3] || null,
		"regions.$[regionEl].product.full_cost": params[2] * params[5],
		"regions.$[regionEl].product.full_club_cost": params[3] == null ? null : (params[3] * params[5]),
		// "regions.$[regionEl].product.description": params.description
	}
	return {
		updateOne: {
			filter: {
				'regions.product.article': params[0],
				"regions.region": mongoose.Types.ObjectId(region),
			},
			update: {
				$set: set
			},
			arrayFilters: [{ "regionEl.region": mongoose.Types.ObjectId(region) }]
		}
	}
}

async function setHeaderRows(regionId) {
	let region = await Region.findOne({ _id: mongoose.Types.ObjectId(regionId) })
	let products = []
	let dateNow = moment().format("YY-MM-DD")
	let timeNow = moment().format("HH:mm")
	const logo = `=IMAGE("https://xn--j1ano.com/uploads/logo.png")`
	const date = `\n Обновлено \n ${dateNow} ${timeNow}`
	const info = `${region.title} \n Телефон: ${region.phones} \n Почта: ${region.email}`
	products.push([logo, info, date])
	products.push(["Артикул", "Наименование", "Цена", "Клубная цена", "Категория", "Коэффициент"])
	return products
}

async function syncCategoryProducts(region, sheet, spreadsheetId) {
	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(ROOT, process.env.GOOGLE_API),
		scopes: "https://www.googleapis.com/auth/spreadsheets"
	})
	const client = await auth.getClient()
	const googleSheets = google.sheets({ version: "v4", auth: client })
	const gDocsProducts = await googleSheets.spreadsheets.values.get({
		auth,
		spreadsheetId,
		range: `${sheet.categoryName}`
	})
	const jsonPath = path.join(G_DOCS_PRODUCTS_PATH, `${region}/${sheet.categoryId}.json`)
	const rawData = fs.readFileSync(jsonPath)
	const file = JSON.parse(rawData)
	const changes = await compareProductsData(file.values, gDocsProducts.data.values)
	let bulk = []

	if (changes.length) {
		for (c of changes) {
			let doc = getUpdatedProduct(c, region)
			bulk.push(doc)
		}
		bulkUpdate = await Products.bulkWrite(bulk)
			.then(async () => {
				let products = await setHeaderRows(region)
				const productsFromRegion = await getProductsFromRegion(region, [sheet.categoryId])
				for (p of productsFromRegion) {
					let values = []
					values.push(p.article, p.title, p.cost, p.club_cost, p.category[0].category.categoryName, p.coef)
					products.push(values)
				}
				await googleSheets.spreadsheets.values.update({
					auth,
					spreadsheetId: spreadsheetId,
					range: `${sheet.categoryName}!A1`,
					valueInputOption: "USER_ENTERED",
					resource: {
						values: products
					}
				})
				writeJson(products, region, sheet.categoryId)

			})

	}

}

exports.syncRegionProducts = async (req, res, next) => {
	console.log('===========syncRegionProducts==============');
	try {
		const region = req.body.region
		const existedDoc = await gDocProducts.findOne({ region })
		for (sheet of existedDoc.sheets) {
			await syncCategoryProducts(region, sheet, existedDoc.spreadsheetId)
			await updateHeader(existedDoc.spreadsheetId, sheet.sheetId)
		}
		await gDocProducts.updateOne({ region: mongoose.Types.ObjectId(region) }, { $set: { region: mongoose.Types.ObjectId(region) } })
		res.status(200).send({ message: "Категории и таблицы региона обновлены" })
	} catch (error) {
		console.log(error);
	}
}

async function deleteSheet(region, categoryId, existedDoc) {
	const sheet = (existedDoc.sheets.filter(sheet => sheet.categoryId === categoryId))[0]

	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(ROOT, process.env.GOOGLE_API),
		scopes: "https://www.googleapis.com/auth/spreadsheets"
	})
	const client = await auth.getClient()
	const googleSheets = google.sheets({ version: "v4", auth: client })

	const request = {
		"spreadsheetId": existedDoc.spreadsheetId,
		"resource": {
			"requests": {
				"deleteSheet": {
					"sheetId": sheet.sheetId
				}
			}
		}
	}
	await googleSheets.spreadsheets.batchUpdate(request)
		.then(async () => {
			await gDocProducts.updateOne({ region }, {
				$pull: { "sheets": { "sheetId": sheet.sheetId } }
			})
		})
	const jsonPath = path.join(G_DOCS_PRODUCTS_PATH, `${region}/${categoryId}.json`)
	deleteUserUploadedFile(jsonPath)
}

exports.deleteSheetRequest = async (req, res, next) => {
	let { region, categoryId } = req.body
	const existedDoc = await gDocProducts.findOne({ region, "sheets.categoryId": categoryId })
	if (!existedDoc) {
		res.status(404).send({ message: "Документ не найден" })
	}
	await deleteSheet(region, categoryId, existedDoc)

	res.status(200).send({ message: "Категория удалена из документа" })
}

exports.getDoc = async (req, res, next) => {
	let { region } = req.body
	const existedDoc = await gDocProducts.findOne({ region: mongoose.Types.ObjectId(region) })
	if (!existedDoc) {
		return res.status(404).send({ message: "Документ не найден" })
	}
	res.status(200).send(existedDoc)
}

async function getSubCategoriesIds(region, categoryIds) {
	const subCategoriesId = await Categories.aggregate()
		.match({
			"regions.region": mongoose.Types.ObjectId(region),
			"regions.category.parent_id": { $in: categoryIds }
		})
		.project({
			_id: null,
			categories: {
				$filter: {
					input: "$regions",
					as: "region",
					cond: {
						$eq: ["$$region.region", mongoose.Types.ObjectId(region)]
					}
				}
			}
		})
		.unwind("$categories")
		.project({
			"ids": "$categories.category._id",
			"name": "$categories.category.categoryName",
		})
		.group({
			_id: null,
			"category_ids": { $addToSet: "$ids" },
			"names": { $addToSet: "$name" }
		})
	return subCategoriesId[0] ? subCategoriesId[0].category_ids ? subCategoriesId[0].category_ids : [] : []
}