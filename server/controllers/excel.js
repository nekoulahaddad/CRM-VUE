const md5 = require("md5");
const mongoose = require("mongoose");
const path = require("path");
const moment = require("moment");
const {
	REGIONS_PATH,
	USERS_PATH,
	SEO_PATH,
	ONEC_PATH,
	FEEDS_PATH,
} = require("../utils/path");
const Categories = require("../models/categories");
const Products = require("../models/products");
const Users = require("../models/user");
const Test = require("../models/test");
const Clients = require("../models/clients");
const Tasks = require("../models/tasks");
const Regions = require("../models/regions");
const xl = require("excel4node");
const Excel = require("exceljs");
const { createProduct } = require("./products");
const Orders = require("../models/orders");
const Conditions = require("../models/conditions");
const { Parser } = require("json2csv");
const fs = require("fs");
const { create } = require("xmlbuilder2");
const { sum } = require("lodash");

const generatingNumberEmployee = (id, numberOfСharacters = 4) => {
	id = md5(id).replace(/[a-zа-яё]/gi, '') + (id).toString().replace(/[a-zа-яё]/gi, '')
	return id = id.slice(0, numberOfСharacters)
}

exports.getTasks = async (req, res) => {
	try {
	} catch (e) { }
};

exports.getExcelFromCategories = async (req, res, next) => {
	try {
		const region = req.body.region;
		let categories = [];
		let rootCategories = await Categories.aggregate([
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
										$eq: ["$$el.category.nesting", 0],
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
		rootCategories = rootCategories[0].categories;
		categories = rootCategories;
		// Собираем ссылки на категории nesting = 1
		let childCategory = await Categories.aggregate([
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
										$in: ["$$el.category.parent_id", categories],
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
		if (childCategory.length) {
			categories = categories.concat(childCategory[0].categories);

			for (let i = 0; i < childCategory[0].categories.length; i++) {
				let category = childCategory[0].categories[i];

				// Собираем id категорий nesting = 2
				const childSubCategory = await Categories.aggregate([
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
				if (childSubCategory[0] && childSubCategory[0].categories) {
					categories = categories.concat(childSubCategory[0].categories);
				}
			}
		}

		const filePath = await generateExcel(req, res, region, categories);
	} catch (error) {
		next(error);
	}
};

exports.getExcelFromAllUsers = async (req, res, next) => {
	try {
		const deletedUsers = await Users.aggregate([
			{
				$match: {
					deleted: false,
				},
			},
			{
				$lookup: {
					from: "regions",
					localField: "region",
					foreignField: "_id",
					as: "region",
				},
			},
			{
				$unwind: {
					path: "$region",
				},
			},
			{
				$lookup: {
					from: "departments",
					localField: "department",
					foreignField: "_id",
					as: "department",
				},
			},
			{
				$unwind: {
					path: "$department",
				},
			},
			{
				$project: {
					_id: "$_id",
					name: "$name",
					surname: "$surname",
					lastname: "$lastname",
					position: "$position",
					department: "$department.title",
					region: "$region.title",
					role: "$role",
					phone: "$phone",
					email: "$email",
				},
			},
		]);
		console.log(deletedUsers);

		if (deletedUsers.length) {
			let globalStyle = {
				alignment: {
					wrapText: true,
					horizontal: "center",
					vertical: "center",
				},
			};
			let wb = new xl.Workbook();
			let ws = wb.addWorksheet("Все сотрудники");
			ws.cell(1, 1).string("ФИО").style(globalStyle);
			ws.cell(1, 2).string("Должность").style(globalStyle);
			ws.cell(1, 3).string("Телефон").style(globalStyle);
			ws.cell(1, 4).string("Регион").style(globalStyle);
			ws.cell(1, 5).string("Отдел").style(globalStyle);

			for (let i = 0; i < deletedUsers.length; i++) {
				let user = deletedUsers[i];

				ws.cell(i + 2, 1) // ФИО
					.string(
						`${user.surname} ${user.name}${user.lastname ? " " + user.lastname : ""
						}`
					)
					.style(globalStyle);

				ws.cell(i + 2, 2) // Должность
					.string(user.position)
					.style(globalStyle);

				ws.cell(i + 2, 3) // Телефон
					.string(user.phone)
					.style(globalStyle);

				ws.cell(i + 2, 4) // Регион
					.string(user.region)
					.style(globalStyle);

				ws.cell(i + 2, 5) // Отдел
					.string(user.department)
					.style(globalStyle);
			}

			ws.column(1).setWidth(50);
			ws.column(2).setWidth(50);
			ws.column(3).setWidth(30);
			ws.column(4).setWidth(30);
			ws.column(5).setWidth(30);

			let filePath = path.join(USERS_PATH, `/Все_Сотрудники.xlsx.xlsx`);
			await wb.write(filePath);
			setTimeout(() => {
				res.status(200).download(filePath, `Все_Сотрудники.xlsx.xls`);
			}, 500);
		} else {
			res.status(400).json({ message: "Уволеные сотрудники не найдены" });
			return;
		}

		// res.status(200)
	} catch (error) {
		next(error);
	}
};

exports.getExcelFromChildren = async (req, res, next) => {
	try {
		// age = req.body.age
		// targetAge = new Date();
		// targetAge = targetAge.setFullYear(targetAge.getFullYear() - age)

		let children = await Users.aggregate()
			.match({ children: { $gte: { $size: 1 } } })
			// .project({
			//         children: {
			//             $filter: {
			//                 input: '$children',
			//                 as: 'el',
			//                 cond: {
			//                     $gt: ["$$el.birthDate", new Date(targetAge)]
			//                 }
			//             }
			//         }
			//     })
			.unwind("$children")
			.replaceRoot("$children");

		if (children.length) {
			let globalStyle = {
				alignment: {
					wrapText: true,
					horizontal: "center",
					vertical: "center",
				},
			};
			let wb = new xl.Workbook();
			let ws = wb.addWorksheet("Все сотрудники");
			ws.cell(1, 1).string("ФИО").style(globalStyle);
			ws.cell(1, 2).string("Пол").style(globalStyle);
			ws.cell(1, 3).string("Дата рождения").style(globalStyle);

			for (let i = 0; i < children.length; i++) {
				let child = children[i];

				ws.cell(i + 2, 1) // ФИО
					.string(child.fio)
					.style(globalStyle);

				ws.cell(i + 2, 2) // Пол
					.string(child.gender)
					.style(globalStyle);

				ws.cell(i + 2, 3) // Дата рождения
					.string(moment(child.birthDate).format("DD.MM.YYYY"))
					.style(globalStyle);
			}
			ws.column(1).setWidth(50);
			ws.column(2).setWidth(20);
			ws.column(3).setWidth(20);

			// wb.write(path.join(USERS_PATH, `/Дети_сотрудников.xlsx`))
			let filePath = path.join(USERS_PATH, `/Дети_сотрудников.xlsx`);
			await wb.write(filePath);
			setTimeout(() => {
				res.status(200).download(filePath, `Дети_сотрудников.xls`);
			}, 500);
			// let findUser = false
			// for (let i = 0; i < global.users.length; i++) {
			//     const user = global.users[i];
			//     console.log(req.userId)
			//     if (user.userId === req.userId) {
			//         console.log('find user')
			//         findUser = true
			//         setTimeout(() => {
			//             global.io.to(req.userId).emit("DownloadExcel", {
			//                 link: `/uploads/documents/users//Дети_сотрудников.xlsx`,
			//                 filename: `/Дети_сотрудников.xlsx`
			//             })
			//         }, 3000)
			//     }
			// }
			// if (!findUser) {
			//     res.status(404).json({message: 'Обновите страницу!'})
			// }
		} else {
			res.status(400).json({ message: "Нет подходящих условий" });
			return;
		}
	} catch (error) {
		next(error);
	}
};

exports.getExcelFromDeletedUsers = async (req, res, next) => {
	try {
		// Добавление поля number с уникальным значением на основе _id юзера
		// const users = await Users.find()
		// let count = 0
		// const arr = []
		//  users.forEach(async (user, i) => {
		// 	const id = user._id.toString()
		// 	const generateId = generatingNumberEmployee(id) 
		// 	const res = await Users.findByIdAndUpdate(id, { $set: { "number": generateId } })
		// 	count++
		// 	if (count % 100 === 0) console.log(count);
		// 	if (arr.includes(generateId)) console.log(`Одинаковый id = ${generateId}`);
		// 	arr.push(generateId)
		// })
		
		// return

		let deletedUsers = await Users.find({ deleted: true });
		if (deletedUsers.length) {
			let globalStyle = {
				alignment: {
					wrapText: true,
					horizontal: "center",
					vertical: "center",
				},
			};
			let wb = new xl.Workbook();
			let ws = wb.addWorksheet("Уволеные сотрудники");
			ws.cell(1, 1).string("ФИО").style(globalStyle);
			ws.cell(1, 2).string("Должность").style(globalStyle);
			ws.cell(1, 3).string("Телефон").style(globalStyle);
			for (let i = 0; i < deletedUsers.length; i++) {
				let user = deletedUsers[i];

				ws.cell(i + 2, 1) // ФИО
					.string(
						`${user.surname} ${user.name}${user.lastname ? " " + user.lastname : ""
						}`
					)
					.style(globalStyle);

				ws.cell(i + 2, 2) // Должность
					.string(user.position)
					.style(globalStyle);

				ws.cell(i + 2, 3) // Телефон
					.string(user.phone)
					.style(globalStyle);
			}

			ws.column(1).setWidth(50);
			ws.column(2).setWidth(30);
			ws.column(3).setWidth(30);

			let filePath = path.join(USERS_PATH, `/Сотрудники.xlsx`);
			await wb.write(filePath);
			setTimeout(() => {
				res.status(200).download(filePath, `Сотрудники.xls`);
			}, 500);
			// console.log(global.users)
			// let findUser = false
			// for (let i = 0; i < global.users.length; i++) {
			//     const user = global.users[i];
			//     console.log(req.userId)
			//     if (user.userId === req.userId) {
			//         console.log('find user')
			//         findUser = true
			//         setTimeout(() => {
			//             global.io.to(req.userId).emit("DownloadExcel", {
			//                 link: `/uploads/documents/users/Сотрудники.xlsx`,
			//                 filename: `Сотрудники.xlsx`
			//             })
			//         }, 3000)
			//     }
			// }
			// if (!findUser) {
			//     res.status(404).json({message: 'Обновите страницу!'})
			// }
		} else {
			res.status(400).json({ message: "Уволеные сотрудники не найдены" });
			return;
		}

		res.status(200);
	} catch (error) {
		next(error);
	}
};

exports.getExcelFromUsersBirthday = async (req, res, next) => {
	try {
		let usersBirthday = await Users.find({ deleted: false });
		let acceptedUsers = [];
		for (let i = 0; i < usersBirthday.length; i++) {
			let user = usersBirthday[i];
			let currentMonth = moment().month();
			let birthday = moment(user.date_of_birth).month();
			if (currentMonth === birthday) {
				acceptedUsers.push(user);
			}
		}
		if (acceptedUsers.length) {
			let globalStyle = {
				alignment: {
					wrapText: true,
					horizontal: "center",
					vertical: "center",
				},
			};
			let wb = new xl.Workbook();
			let ws = wb.addWorksheet("Дни рождения сотрудников за текущий месяц");
			ws.cell(1, 1).string("ФИО").style(globalStyle);
			ws.cell(1, 2).string("Должность").style(globalStyle);
			ws.cell(1, 3).string("Телефон").style(globalStyle);
			ws.cell(1, 4).string("День рождения").style(globalStyle);
			for (let i = 0; i < acceptedUsers.length; i++) {
				let user = acceptedUsers[i];
				console.log(user);
				ws.cell(i + 2, 1) // ФИО
					.string(
						`${user.surname} ${user.name}${user.lastname ? " " + user.lastname : ""
						}`
					)
					.style(globalStyle);

				ws.cell(i + 2, 2) // Должность
					.string(user.position)
					.style(globalStyle);

				ws.cell(i + 2, 3) // Телефон
					.string(user.phone)
					.style(globalStyle);

				ws.cell(i + 2, 4) // День рождения
					.string(moment(user.date_of_birth).format("DD.MM.YYYY"))
					.style(globalStyle);
			}

			ws.column(1).setWidth(50);
			ws.column(2).setWidth(30);
			ws.column(3).setWidth(30);
			ws.column(4).setWidth(30);

			let filePath = path.join(USERS_PATH, `/Дни_рождения.xlsx`);
			await wb.write(filePath);
			setTimeout(() => {
				res.status(200).download(filePath, `Дни_рождения.xlsx`);
			}, 500);

			// console.log(global.users)
			// let findUser = false
			// for (let i = 0; i < global.users.length; i++) {
			//     const user = global.users[i];
			//     console.log(req.userId)
			//     if (user.userId === req.userId) {
			//         console.log('find user')
			//         findUser = true
			//         setTimeout(() => {
			//             global.io.to(req.userId).emit("DownloadExcel", {
			//                 link: `/uploads/documents/users/Дни_рождения.xlsx`,
			//                 filename: `Дни_рождения.xlsx`
			//             })
			//         }, 3000)
			//     }
			// }
			// if (!findUser) {
			//     res.status(404).json({message: 'Обновите страницу!'})
			// }
			// console.log("finish excel")
		} else {
			res
				.status(400)
				.json({ message: "Дни рождения за текущий месяц не найдены" });
			return;
		}

		res.status(200);
	} catch (error) {
		next(error);
	}
};

const getSubCategoriesIds = async (region, categoryIds) => {
	// доработать
	console.log("getting subs cats");
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
			name: "$categories.category.categoryName",
		})
		.group({
			_id: null,
			category_ids: { $addToSet: "$ids" },
			names: { $addToSet: "$name" },
		});
	subCategoriesId = subCategoriesId[0]
		? subCategoriesId[0].category_ids
			? subCategoriesId[0].category_ids
			: []
		: [];
	let result = [...new Set(subCategoriesId)]; // subCategoriesId.filter((item, pos)=> subCategoriesId.indexOf(item) === pos)
	return result;
};

function getImagesPath(product) {
	const csk = "https://xn--j1ano.com";
	const path = product.path;
	let urls = "";
	if (product.images.length === 1) {
		let url = `${product.images[0]}`;
		return url;
	}
	for (let i = 0; i < product.images.length; i++) {
		if (i === product.images.length - 1) {
			let url = `${product.images[i]}`;
			urls += url;
		} else {
			let url = `${product.images[i]}, `;
			urls += url + "\n";
		}
	}
	return urls;
}

function getImagesURL(product) {
	const csk = "https://xn--j1ano.com";
	const path = product.path;
	let urls = "";
	if (product.images.length === 1) {
		let url = `${csk}${path}${product.images[0]}`;
		return url;
	}
	for (let i = 0; i < product.images.length; i++) {
		if (i === product.images.length - 1) {
			let url = `${csk}${path}${product.images[i]}`;
			urls += url + "\n";
		} else {
			let url = `${csk}${path}${product.images[i]}, `;
			urls += url + "\n";
		}
	}

	return urls;
}

exports.exportImagesProducts = async (req, res, next) => {
	try {
		let { region, categoryId, categoryName } = req.body;
		const regionInfo = await Regions.findById(region);
		const regionTitle = regionInfo.title;
		const regionValue = regionInfo.value;
		categoryId = categoryId.map((id) => {
			return mongoose.Types.ObjectId(id);
		});
		let catsIds = [...categoryId];
		for (i = 0; i < 4; i++) {
			catsIds = await getSubCategoriesIds(region, catsIds);
			categoryId.push(...catsIds);
		}

		let productsFromRegion = await Products.aggregate()
			.match({
				"regions.region": mongoose.Types.ObjectId(region),
				"regions.product.category_id": { $in: categoryId },
			})
			.project({
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
									$eq: ["$$el.product.deleted", false],
								},
								{
									$eq: ["$$el.product.visible", true],
								},
								{
									$gte: ["$$el.product.cost", 0],
								},
							],
						},
					},
				},
				lastModified: "$updatedAt",
			})
			.project({
				results: "$results",
				lastModified: "$lastModified",
			})
			.unwind("$results")
			.group({
				_id: "$_id",
				product: {
					$push: "$results.product",
				},
				lastModified: {
					$push: "$lastModified",
				},
			})
			.unwind("$product")
			.unwind("$lastModified")
			.sort({ "product.article": 1 })
			.project({
				_id: 0,
				article: "$product.article",
				title: "$product.title",
				cost: "$product.cost",
				club_cost: "$product.club_cost",
				images: "$product.images",
				path: "$product.path",
				unit: "$product.unit",
				coef: "$product.coef",
				description: "$product.description",
			});

		let workbook = new Excel.Workbook();
		let worksheet = workbook.addWorksheet(`Товары ${categoryName}`);

		productsFromRegion.forEach((product) => {
			// product.id = product.id.toString()
			if (product.images && product.images.length) {
				product.images = getImagesURL(product);
			} else {
				product.images = "";
			}
		});
		worksheet.columns = [
			{ header: "Артикул", key: "article" },
			{ header: "Наименование", key: "title" },
			{ header: "Цена", key: "cost" },
			{ header: "Клубная цена", key: "club_cost" },
			{ header: "Ед. измерения", key: "unit" },
			{ header: "Коэффициент", key: "coef" },
			{ header: "Описание", key: "description" },
			{ header: "Изображения", key: "images" },
		];

		worksheet.columns.forEach((column, i) => {
			if (i === 0) column.width = 20;
			if (i === 1) column.width = 80;
			if (i === 2) column.width = 15;
			if (i === 3) column.width = 15;
			if (i === 4) column.width = 15;
			if (i === 5) column.width = 15;
			if (i === 6) column.width = 120;
			if (i === 7) column.width = 160;
		});
		worksheet.getRow(1).font = { bold: true };

		productsFromRegion.forEach((value) => {
			worksheet.addRow({
				...value,
			});
		});

		worksheet.views = [
			{ state: "frozen", xSplit: 0, ySplit: 1, activeCell: "B2" },
		];
		let filePath = path.join(SEO_PATH, `/Изображения_по_${categoryName}.xlsx`);
		await workbook.xlsx.writeFile(filePath).then(() => {
			console.log(filePath);
			res.status(200).download(filePath, `Изображения_по_${categoryName}.xlsx`);
		});
		// // let findUser = false
		// for (let i = 0; i < global.users.length; i++) {
		//     const user = global.users[i];
		//     console.log(req.userId)
		//     if (user.userId === req.userId) {
		//         console.log('find user')
		//         // findUser = true
		//         setTimeout(() => {
		//             global.io.to(req.userId).emit("DownloadExcel", {
		//                 link: `/uploads/seo/Товары_${categoryName}.xlsx`,
		//                 filename: `Товары_${categoryName}.xlsx`
		//             })
		//         }, 3000)
		//     }
		// }

		// if (!findUser) {
		//     res.status(404).json({message: 'Обновите страницу!'})
		// }

		// console.log("finish excel")
		// res.status(200).send({message: 'OK', data: productsFromRegion})
	} catch (error) {
		next(error);
	}
};

exports.exportCategoryProducts = async (req, res, next) => {
	try {
		let { region, categoryId, categoryName } = req.body;
		const regionInfo = await Regions.findById(region);
		const regionTitle = regionInfo.title;
		const regionValue = regionInfo.value;
		categoryId = categoryId.map((id) => {
			return mongoose.Types.ObjectId(id);
		});
		let catsIds = [...categoryId];
		for (i = 0; i < 4; i++) {
			catsIds = await getSubCategoriesIds(region, catsIds);
			categoryId.push(...catsIds);
		}

		let productsFromRegion = await Products.aggregate()
			.match({
				"regions.region": mongoose.Types.ObjectId(region),
				"regions.product.category_id": { $in: categoryId },
			})
			.project({
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
									$eq: ["$$el.product.deleted", false],
								},
								{
									$gte: ["$$el.product.cost", 0],
								},
							],
						},
					},
				},
				lastModified: "$updatedAt",
			})
			.project({
				results: "$results",
				lastModified: "$lastModified",
			})
			.unwind("$results")
			.group({
				_id: "$_id",
				product: {
					$push: "$results.product",
				},
				lastModified: {
					$push: "$lastModified",
				},
			})
			.unwind("$product")
			.unwind("$lastModified")
			.sort({ "product.article": 1 })
			.lookup({
				from: "categories",
				localField: "product.category_id",
				foreignField: "regions.category._id",
				as: "product.category",
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
				options: "$product.options",
				images: "$product.images",
				path: "$product.path",
				unit: "$product.unit",
				coef: "$product.coef",
				description: "$product.description",
				lastModified: "$lastModified",
				category: {
					$filter: {
						input: "$product.category.regions",
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
			});

		let workbook = new Excel.Workbook();
		let worksheet = workbook.addWorksheet(`Товары ${categoryName}`);
		productsFromRegion.forEach((product) => {
			if (product.options.length) {
				let keys = [];
				let values = [];
				product.options.forEach((option) => {
					keys.push(...Object.keys(option));
					values.push(...Object.values(option));
				});
				product.keys = keys.join(", ");
				product.values = values.join(", ");
			}
			product.visible = product.visible ? "видимый" : "скрытый";
			product.categoryName = product.category[0].category.categoryName;
			product.id = product.id.toString();
			if (product.images && product.images.length) {
				product.images = getImagesPath(product);
				console.log(product.images);
			} else {
				product.images = "";
			}
			product.path;
			product.categoryId = product.category[0].category._id.toString();
			product.lastModified = moment(product.lastModified).format(
				"DD.MM.YYYY hh:mm:ss"
			);
		});
		worksheet.columns = [
			{ header: "Артикул (Не менять!)", key: "article" },
			{ header: "Видимость", key: "visible" },
			{ header: "Наименование", key: "title" },
			{ header: "Цена", key: "cost" },
			{ header: "Клубная цена", key: "club_cost" },
			{ header: "Ед. измерения", key: "unit" },
			{ header: "Коэффициент", key: "coef" },
			{ header: "Описание", key: "description" },
			{ header: "Свойства (ключи)", key: "keys" },
			{ header: "Свойства (значения)", key: "values" },
			{ header: "Путь", key: "path" },
			{ header: "Изображения", key: "images" },
			{ header: "Наименование категории", key: "categoryName" },
			{ header: "Последнее изменение", key: "lastModified" },
			{ header: "Код товара (Не менять!)", key: "id" },
			{ header: "Код категории (Не менять!)", key: "categoryId" },
		];

		worksheet.columns.forEach((column, i) => {
			if (i === 0) column.width = 20;
			if (i === 1) column.width = 20;
			if (i === 2) column.width = 80;
			if (i === 3) column.width = 15;
			if (i === 4) column.width = 15;
			if (i === 5) column.width = 20;
			if (i === 6) column.width = 20;
			if (i === 7) column.width = 120;
			if (i === 8) column.width = 80;
			if (i === 9) column.width = 80;
			if (i === 10) column.width = 160;
			if (i === 11) column.width = 40;
			if (i === 12) column.width = 40;
			if (i === 13) column.width = 40;
			if (i === 14) column.width = 40;
			if (i === 15) column.width = 40;
		});
		worksheet.getRow(1).font = { bold: true };

		productsFromRegion.forEach((value) => {
			worksheet.addRow({
				...value,
			});
		});

		worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
			worksheet.getCell(`A${rowNumber}`).font = {
				color: { argb: "FF0000" },
			};
			let visible = worksheet.getCell(`B${rowNumber}`).value;
			switch (visible) {
				case "видимый":
					worksheet.getCell(`B${rowNumber}`).font = {
						color: { argb: "00FF00" },
					};
					break;
				case "скрытый":
					worksheet.getCell(`B${rowNumber}`).font = {
						color: { argb: "FF0000" },
					};
					break;
			}
			worksheet.getCell(`O${rowNumber}`).font = {
				color: { argb: "FF0000" },
			};
			worksheet.getCell(`P${rowNumber}`).font = {
				color: { argb: "FF0000" },
			};
		});

		worksheet.getCell(`A${worksheet.rowCount}`).border = {
			top: { style: "thin" },
			left: { style: "none" },
			bottom: { style: "none" },
			right: { style: "thin" },
		};

		worksheet.views = [
			{ state: "frozen", xSplit: 0, ySplit: 1, activeCell: "B2" },
		];
		// res.setHeader("Content-Disposition","attachment; filename=" + `a.xlsx`);
		await workbook.xlsx
			.writeFile(path.join(SEO_PATH, `Товары_по_${categoryName}.xlsx`))
			.then(() => {
				let filePath = path.join(SEO_PATH, `Товары_по_${categoryName}.xlsx`);
				res.status(200).download(filePath, `Товары_по_${categoryName}.xlsx`);
			});

		// let findUser = false
		// for (let i = 0; i < global.users.length; i++) {
		//     const user = global.users[i];
		//     console.log(req.userId)
		//     if (user.userId === req.userId) {
		//         console.log('find user')
		//         // findUser = true
		//         setTimeout(() => {
		//             global.io.to(req.userId).emit("DownloadExcel", {
		//                 link: `/uploads/seo/Товары_по_${categoryName}.xlsx`,
		//                 filename: `Товары_по_${categoryName}.xlsx`
		//             })
		//         }, 3000)
		//     }
		// }

		// if (!findUser) {
		//     res.status(404).json({message: 'Обновите страницу!'})
		// }

		console.log("finish excel");
		// res.status(200).send({message: 'OK'})
	} catch (error) {
		next(error);
	}
};

exports.exportOrders = async (req, res, next) => {
	try {
		const { region, client, status, executor, dates, startDate, endDate } =
			req.body;
		const myMatch = {};
		if (region && region !== "all") {
			let regionObj = await Regions.findOne({ value: region });
			myMatch["region"] = {
				$eq: mongoose.Types.ObjectId(regionObj._id),
			};
		}
		if (status !== "all" && status !== null) {
			const statusId = await Conditions.findOne({ value: status });
			myMatch["status"] = {
				$in: [mongoose.Types.ObjectId(statusId._id)],
			};
		}
		if (startDate && endDate) {
			let start = new Date(startDate);
			let end = new Date(endDate);
			myMatch["createdAt"] = {
				$gt: start,
				$lt: end,
			};
		}

		if (client && client !== "all") {
			myMatch["client"] = {
				$eq: mongoose.Types.ObjectId(client),
			};
		}
		if (executor) {
			myMatch["manager"] = mongoose.Types.ObjectId(executor);
		}
		let ordersFromRegion = await Orders.aggregate([
			{
				$match: myMatch,
			},
			{
				$lookup: {
					from: "users",
					localField: "manager",
					foreignField: "_id",
					as: "manager",
				},
			},
			{
				$lookup: {
					from: "conditions",
					localField: "status",
					foreignField: "_id",
					as: "status",
				},
			},
			{
				$lookup: {
					from: "regions",
					localField: "region",
					foreignField: "_id",
					as: "region",
				},
			},
			{
				$lookup: {
					from: "clients",
					localField: "client",
					foreignField: "_id",
					as: "client",
				},
			},
			{
				$project: {
					// buyed: "$buyed",
					manager: "$manager",
					// manager_comment: "$manager_comment",
					client: "$client",
					// comment: "$comment",
					created: "$created",
					// deliver: "$deliver",
					// delivery: "$delivery",
					// typeDelivery: "$typeDelivery",
					// deliverySum: "$deliverySum",
					// deliveryRequest: "$deliveryRequest",
					// oneC: "$oneC",
					// payment: "$payment",
					// paymentStatus: "$paymentStatus",
					declainReason: "$declainReason",
					products: "$products",
					profit: "$profit",
					region: "$region.title",
					status: "$status",
					sum: "$sum",
					shippedSum: "$shippedSum",
					number: "$number",
				},
			},
		]);
		let queryPromises = [];
		for (let o of ordersFromRegion) {
			let ids = [];
			for (i of o.products) {
				ids.push(mongoose.Types.ObjectId(i.product_id));
			}

			let queryPromise = Products.aggregate()
				.match({ "regions.product._id": { $in: ids } })
				.project({
					product: { $first: "$regions.product" },
				})
				.project({
					title: "$product.title",
					category_id: "$product.category_id",
				})
				.lookup({
					from: "categories",
					localField: "category_id",
					foreignField: "regions.category._id",
					as: "category",
				})
				.unwind({ path: "$category" })
				.project({
					title: "$title",
					category: { $first: "$category.regions.category.categoryName" },
				})
				.then((products) => {
					for (let i = 0; i < products.length; i++) {
						o.products[i] = products[i];
					}
				});
			queryPromises.push(queryPromise);
		}
		await Promise.all(queryPromises);

		// res.status(200).send({message: 'OK', data: ordersFromRegion[1]})

		let workbook = new Excel.Workbook();
		let worksheet = workbook.addWorksheet(`Заказы`);

		worksheet.columns = [
			{ header: "№ заказа", key: "number" },
			// {header: 'Комментарий менеджера', key: 'manager_comment'},
			{ header: "Клиент", key: "client" },
			{ header: "Регион", key: "region" },
			{ header: "Менеджер", key: "manager" },
			{ header: "Статус", key: "status" },
			{ header: "Дата", key: "created" },
			{ header: "Категории заказа", key: "categories" },
			{ header: "Содержимое заказа", key: "products" },
			// {header: 'Тип доставки', key: 'typeDelivery'},
			// {header: 'Доставлен', key: 'deliver'},
			// {header: 'Адрес', key: 'delivery'},
			// {header: 'Сумма доставки', key: 'deliverySum'},
			{ header: "Сумма заказа", key: "sum" },
			{ header: "Прибыль", key: "profit" },
			{ header: "Причина отказа", key: "declainReason" },
			//{header: 'Товары', key: 'products'},
		];

		worksheet.columns.forEach((column, i) => {
			if (i === 0) column.width = 10;
			if (i === 1) column.width = 25;
			if (i === 2) column.width = 25;
			if (i === 3) column.width = 30;
			if (i === 4) column.width = 25;
			if (i === 5) column.width = 15;
			if (i === 6) column.width = 50;
			if (i === 7) column.width = 50;
			if (i === 8) column.width = 15;
			if (i === 9) column.width = 15;
			if (i === 10) column.width = 40;
		});

		worksheet.getRow(1).font = { bold: true };

		ordersFromRegion.forEach((value) => {
			let categories = "";
			let products = "";
			// value.products.forEach( p => {

			// })
			let productsArr = value.products.filter(
				(p) => p.title != undefined && p.category != undefined
			);
			for (let [i, p] of productsArr.entries()) {
				if (i != productsArr.length - 1) {
					if (!categories.includes(p.category)) {
						categories += p.category + ", ";
					}
					products += p.title + ", ";
				} else {
					if (!categories.includes(p.category)) {
						categories += p.category;
					}
					products += p.title;
				}
			}

			let manager = value.manager.length
				? `${value.manager[0].name} ${value.manager[0].surname} ${value.manager[0].lastname}`
				: "";
			let client = value.client.length
				? `${value.client[0].name} ${value.client[0].lastname}`
				: "";
			worksheet.addRow({
				number: value.number,
				client: client,
				region: value.region[0],
				manager: manager,
				status: value.status[0].title,
				created: value.created,
				categories: categories,
				products: products,
				sum: value.sum,
				profit: value.profit || 0,
				declainReason: value.declainReason || "",
			});
		});
		let conditions = await Conditions.find({}).lean();
		worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
			if (rowNumber != 1) {
				let status = worksheet.getCell(`E${rowNumber}`).value;
				let color = conditions.find((c) => c.title == status).color || "000000";
				worksheet.getCell(`E${rowNumber}`).font = {
					color: { argb: color },
				};
			}
		});
		worksheet.views = [
			{ state: "frozen", xSplit: 0, ySplit: 1, activeCell: "B2" },
		];
		const filePath = path.join(SEO_PATH, `/Заказы.xlsx`);
		await workbook.xlsx.writeFile(filePath).then(() => {
			console.log(filePath);
			res.status(200).download(filePath, `Заказы.xlsx`);
		});
	} catch (error) {
		next(error);
	}
};

function getUpdatedProduct(params, region) {
	let set = {
		"regions.$[regionEl].product.title": params.title,
		"regions.$[regionEl].product.unit": params.unit,
		"regions.$[regionEl].product.visible": params.visible,
		"regions.$[regionEl].product.coef": params.coef,
		"regions.$[regionEl].product.cost": params.cost,
		"regions.$[regionEl].product.club_cost": params.club_cost || null,
		"regions.$[regionEl].product.full_cost": params.cost * params.coef,
		"regions.$[regionEl].product.full_club_cost":
			params.club_cost * params.coef || null,
		"regions.$[regionEl].product.description": params.description,
	};
	if (params.prodOptions.length) {
		set["regions.$[regionEl].product.options"] = params.prodOptions;
	}
	return {
		updateOne: {
			filter: {
				"regions.product._id": mongoose.Types.ObjectId(params.id),
				"regions.region": mongoose.Types.ObjectId(region),
			},
			update: {
				$set: set,
			},
			arrayFilters: [{ "regionEl.region": mongoose.Types.ObjectId(region) }],
		},
	};
}

exports.importCategoryProducts = async (req, res, next) => {
	const { region, category_id } = req.body;
	const file = req.files.document[0];

	let workbook = new Excel.Workbook();
	let book = await workbook.xlsx.readFile(file.path);
	let worksheet = await book.getWorksheet();
	let bulk = [];
	let toCreate = [];
	await worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		if (rowNumber != 1) {
			let product = {};
			let options = {};
			product.article = worksheet.getCell(`A${rowNumber}`).value;
			product.visible = worksheet.getCell(`B${rowNumber}`).value;
			if (typeof product.visible == "string") {
				product.visible = product.visible.toLowerCase();
			}
			switch (product.visible) {
				case "видимый":
					product.visible = true;
					break;
				case "скрытый":
					product.visible = false;
					break;
				default:
					product.visible = false;
			}

			product.title = worksheet.getCell(`C${rowNumber}`).value;
			product.cost = worksheet.getCell(`D${rowNumber}`).value;
			product.club_cost = worksheet.getCell(`E${rowNumber}`).value || null;
			product.unit = worksheet.getCell(`F${rowNumber}`).value;
			product.coef = worksheet.getCell(`G${rowNumber}`).value;
			product.description = worksheet.getCell(`H${rowNumber}`).value || "";

			keys = worksheet.getCell(`I${rowNumber}`).value || "";
			values = worksheet.getCell(`J${rowNumber}`).value || "";
			keys.length ? (options.keys = keys.split(", ")) : (options.keys = []);
			values.length
				? (options.values = values.split(", "))
				: (options.values = []);
			product.prodOptions = [];

			// product.path = path.join(__dirname, '..', worksheet.getCell((`K${rowNumber}`)).value)
			product.path = path.join(
				"/var/content",
				worksheet.getCell(`K${rowNumber}`).value || ""
			);
			product.imagesStr = worksheet.getCell(`L${rowNumber}`).value || "";

			product.imagesStr.length
				? (options.images = product.imagesStr.split(", "))
				: (options.images = []);
			product.images = [];
			if (options.images.length) {
				for (let i = 0; i < options.images.length; i++) {
					let image = {
						filename: options.images[i],
					};
					product.images.push(image);
				}
			}

			product.id = worksheet.getCell(`O${rowNumber}`).value || null;
			product.category_id = worksheet.getCell(`P${rowNumber}`).value || null;

			if (
				options.keys.length &&
				options.values.length &&
				options.keys.length == options.values.length
			) {
				for (let i = 0; i < options.keys.length; i++) {
					let key = options.keys[i];
					let value = options.values[i];
					let obj = {
						[key]: value,
					};
					product.prodOptions.push(obj);
				}
			}

			if (product.article && product.id) {
				let doc = getUpdatedProduct(product, region);
				bulk.push(doc);
			} else if (!product.article) {
				let optionsFormat = [];
				for (const [key, value] of Object.entries(product.prodOptions)) {
					optionsFormat.push({ key: key, value: value });
				}
				let params = {
					region: region,
					title: product.title,
					options: product.prodOptions,
					cost: product.cost,
					club_cost: product.club_cost,
					unit: product.unit,
					description: product.description,
					parent_value: category_id ? category_id : product.category_id,
					discount: false,
					wholesale: false,
					coef: product.coef,
					path: product.path,
					images: product.images,
				};
				toCreate.push(params);
			}
		}
	});
	let bulkUpdate;
	if (bulk.length && (!category_id || category_id == "undefined")) {
		bulkUpdate = await Products.bulkWrite(bulk);
	}
	if (toCreate.length) {
		console.log("creating");
		for (params of toCreate) {
			await createProduct(params, params.images, params.path);
		}
	}

	res.status(200).send({
		message: "Ok",
		result: bulkUpdate || false,
	});
};

exports.exportOneC = async (req, res, next) => {
	try {
		const regionName = req.query.region;
		if (!regionName) {
			return res.status(404).send({ message: "Region not provided" });
		}
		const regionInfo = await Regions.findOne({ value: regionName });
		const regionId = regionInfo._id;

		let productsFromRegion = await Products.aggregate()
			.match({
				"regions.region": mongoose.Types.ObjectId(regionId),
			})
			.project({
				results: {
					$filter: {
						input: "$regions",
						as: "el",
						cond: {
							$and: [
								{
									$eq: ["$$el.region", mongoose.Types.ObjectId(regionId)],
								},
								{
									$eq: ["$$el.product.deleted", false],
								},
								{
									$eq: ["$$el.product.visible", true],
								},
								{
									$gte: ["$$el.product.cost", 0],
								},
							],
						},
					},
				},
			})
			.unwind({
				path: "$results",
			})
			.group({
				_id: "$_id",
				product: {
					$push: "$results.product",
				},
			})
			.unwind({
				path: "$product",
			})
			.project({
				_id: 0,
				// product: "$product.title",
				article: "$product.article",
				cost: "$product.cost",
				club_cost: "$product.club_cost",
			});

		let workbook = new Excel.Workbook();
		let worksheet = workbook.addWorksheet(`${regionName}`);

		worksheet.columns = [
			{ header: "Article", key: "article" },
			{ header: "Cost", key: "cost" },
			{ header: "Club cost", key: "club_cost" },
		];
		productsFromRegion.forEach((value) => {
			worksheet.addRow({
				...value,
			});
		});

		await workbook.xlsx
			.writeFile(path.join(ONEC_PATH, `/${regionName}.xlsx`))
			.then(() => {
				res.status(200).download(path.join(ONEC_PATH, `/${regionName}.xlsx`));
			});
		console.log("finish excel");
	} catch (error) {
		next(error);
	}
};

exports.getGoodsFromRegion = async (req, res, next) => {
	try {
		const region = req.body.region;
		const regionInfo = await Regions.findById(region);
		const regionTitle = regionInfo.title;
		const regionValue = regionInfo.value;

		let productsFromRegion = await Products.aggregate()
			.match({
				"regions.region": mongoose.Types.ObjectId(region),
			})
			.project({
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
									$eq: ["$$el.product.deleted", false],
								},
								{
									$eq: ["$$el.product.visible", true],
								},
								{
									$gte: ["$$el.product.cost", 0],
								},
							],
						},
					},
				},
			})
			.unwind({
				path: "$results",
			})
			.group({
				_id: "$_id",
				product: {
					$push: "$results.product",
				},
			})
			.unwind({
				path: "$product",
			})
			.project({
				_id: 0,
				product: "$product.title",
				cost: "$product.cost",
				images: "$product.images",
				path: "$product.path",
				slug: "$product.slug",
				article: "$product.article",
			});

		//res.status(200).send({ message: "OK", data: productsFromRegion });

		let workbook = new Excel.Workbook();
		let worksheet = workbook.addWorksheet(`Товары по региону ${regionTitle}`);

		worksheet.columns = [
			{ header: "Имя товара", key: "product" },
			{ header: "Стоимость", key: "cost" },
			{ header: "Артикуль", key: "article" },
			{ header: "Ссылка на картинку", key: "images" },
			{ header: "Ссылка на товар", key: "path" },
		];

		worksheet.columns.forEach((column, i) => {
			if (i === 0) column.width = 80;
			if (i === 1) column.width = 15;
			if (i === 2) column.width = 15;
			if (i === 3) column.width = 80;
			if (i === 4) column.width = 80;
		});

		worksheet.getRow(1).font = { bold: true };

		productsFromRegion.forEach((value) => {
			worksheet.addRow({
				...value,
				images: `https://xn--j1ano.com${value.path}${value.images[0]}`,
				path: `https://tdcsk.com/products/region/${regionValue}/${value.slug}`,
			});
		});

		worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
			worksheet.getCell(`A${rowNumber}`).border = {
				top: { style: "thin" },
				left: { style: "thin" },
				bottom: { style: "thin" },
				right: { style: "none" },
			};
		});

		worksheet.getCell(`A${worksheet.rowCount}`).border = {
			top: { style: "thin" },
			left: { style: "none" },
			bottom: { style: "none" },
			right: { style: "thin" },
		};

		worksheet.views = [
			{ state: "frozen", xSplit: 0, ySplit: 1, activeCell: "B2" },
		];

		await workbook.xlsx.writeFile(
			path.join(SEO_PATH, `/Товары_по_${regionTitle}.xlsx`)
		);
		return res
			.status(200)
			.download(path.join(SEO_PATH, `/Товары_по_${regionTitle}.xlsx`));

		// let findUser = false
		for (let i = 0; i < global.users.length; i++) {
			const user = global.users[i];
			if (user.userId === req.userId) {
				console.log("find user");
				// findUser = true
				setTimeout(() => {
					global.io.to(req.userId).emit("DownloadExcel", {
						link: `/uploads/seo/Товары_по_${regionTitle}.xlsx`,
						filename: `Товары_по_${regionTitle}.xlsx`,
					});
				}, 3000);
			}
		}

		// if (!findUser) {
		//     res.status(404).json({message: 'Обновите страницу!'})
		// }

		console.log("finish excel");
		res.status(200);
	} catch (error) {
		next(error);
	}
};

async function generateExcel(req, res, region, categories) {
	try {
		let wb = new xl.Workbook();

		for (let i = 0; i < categories.length; i++) {
			const id = categories[i];
			let category = await Categories.aggregate([
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
					$project: {
						category: {
							title: "$results.category.categoryName",
							_id: "$results.category._id",
						},
					},
				},
			]);

			if (Array.isArray(category) && !category.length) {
				continue;
			}

			category = category[0].category;

			let products = await Products.aggregate([
				{
					$match: {
						"regions.product.category_id": mongoose.Types.ObjectId(
							category._id
						),
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
											$eq: ["$$el.region", mongoose.Types.ObjectId(region)],
										},
										{
											$eq: ["$$el.product.deleted", false],
										},
										{
											$eq: [
												"$$el.product.category_id",
												mongoose.Types.ObjectId(category._id),
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
						products: {
							$push: "$results.product",
						},
					},
				},
				{
					$replaceRoot: {
						newRoot: {
							products: "$products",
						},
					},
				},
			]);
			products =
				products[0] && products[0].products ? products[0].products : "";
			if (products && products.length) {
				let globalStyle = {
					alignment: {
						wrapText: true,
						horizontal: "center",
						vertical: "center",
					},
				};
				let ws = wb.addWorksheet(i + ") " + category.title);
				ws.cell(1, 1).string("Заголовок").style(globalStyle);
				ws.cell(1, 2).string("Артикул").style(globalStyle);
				ws.cell(1, 3).string("Цена").style(globalStyle);
				ws.cell(1, 4).string("Клубная цена").style(globalStyle);
				ws.cell(1, 5).string("Характеристики").style(globalStyle);
				ws.cell(1, 6).string("Ед.из").style(globalStyle);
				ws.cell(1, 7).string("Кол-во в упаковке").style(globalStyle);
				ws.cell(1, 8).string("Уникальный идентификатор").style(globalStyle);
				for (let i = 0; i < products.length; i++) {
					const product = products[i];
					if (
						product.title !== null &&
						product.title !== "null" &&
						product.title !== undefined
					) {
						ws.cell(i + 2, 1) // Заголовок
							.string(product.title)
							.style(globalStyle);
					} else {
						ws.cell(i + 2, 1) // Заголовок
							.string("Неопознаная категория")
							.style(globalStyle);
					}
					if (
						product.article !== null &&
						product.article !== "null" &&
						product.article !== undefined
					) {
						ws.cell(i + 2, 2) // Артикул
							.number(product.article)
							.style(globalStyle);
					} else {
						ws.cell(i + 2, 2) // Артикул
							.string("-")
							.style(globalStyle);
					}
					if (
						product.cost !== null &&
						product.cost !== "null" &&
						product.cost !== undefined
					) {
						ws.cell(i + 2, 3) // Цена
							.number(product.cost)
							.style(globalStyle);
					} else {
						ws.cell(i + 2, 3) // Цена
							.string("-")
							.style(globalStyle);
					}
					if (
						product.club_cost !== null &&
						product.club_cost !== "null" &&
						product.club_cost !== undefined
					) {
						ws.cell(i + 2, 4) // Клубная цена
							.number(product.club_cost)
							.style(globalStyle);
					} else {
						ws.cell(i + 2, 4) // Клубная цена
							.string("-")
							.style(globalStyle);
					}
					let options = "";
					for (let i = 0; i < product.options.length; i++) {
						for (let key in product.options[i]) {
							if (key !== "Артикул")
								options += `${[key]}: ${product.options[i][key]};\r\n`;
						}
					}
					console.log(options);
					ws.cell(i + 2, 5) // Характеристики
						.string(options)
						.style(globalStyle);

					ws.cell(i + 2, 6) // Ед.из
						.string(product.unit)
						.style(globalStyle);
					ws.cell(i + 2, 7) // Кол-во в упаковке
						.number(product.coef)
						.style(globalStyle);
					if (
						product.UUID !== null &&
						product.UUID !== "null" &&
						product.UUID !== undefined
					) {
						ws.cell(i + 2, 8) // UUID
							.string(product.UUID)
							.style(globalStyle);
					} else {
						ws.cell(i + 2, 8) // UUID
							.string("-")
							.style(globalStyle);
					}
				}
				ws.column(1).setWidth(50);
				ws.column(4).setWidth(20);
				ws.column(5).setWidth(60);
				ws.column(7).setWidth(30);
				ws.column(8).setWidth(70);
			}
		}

		const filePath = path.join(REGIONS_PATH, `/${region}.xlsx`);
		await wb.write(filePath);
		return res.status(200).download(filePath);
		for (let i = 0; i < global.users.length; i++) {
			const user = global.users[i];
			console.log(req.userId);
			if (user.userId === req.userId) {
				console.log("find user");
				setTimeout(() => {
					global.io.to(req.userId).emit("DownloadExcel", {
						link: `/uploads/documents/regions/${region}.xlsx`,
						filename: `${region}.xlsx`,
					});
				}, 3000);
			}
		}
		console.log("finish excel");
	} catch (error) {
		console.log(error);
	}
}

exports.getOrdersFromRegion = async (req, res, next) => {
	try {
		const region = req.body.region;
		const status = req.body.status;
		const regionInfo = await Regions.findById(region);
		const regionTitle = regionInfo.title;
		const regionValue = regionInfo.value;
		const myMatch = {};
		if (region && region !== "all") {
			myMatch["region"] = {
				$eq: mongoose.Types.ObjectId(region),
			};
		}
		if (status !== "all" && status !== null) {
			const statusId = await Conditions.findOne({ value: status });
			myMatch["status"] = {
				$in: [mongoose.Types.ObjectId(statusId._id)],
			};
		}

		let ordersFromRegion = await Orders.aggregate([
			{
				$match: myMatch,
			},
			{
				$lookup: {
					from: "users",
					localField: "manager",
					foreignField: "_id",
					as: "manager",
				},
			},
			{
				$lookup: {
					from: "regions",
					localField: "region",
					foreignField: "_id",
					as: "region",
				},
			},
			{
				$unwind: {
					path: "$region",
				},
			},
			{
				$lookup: {
					from: "conditions",
					localField: "status",
					foreignField: "_id",
					as: "status",
				},
			},
			{
				$unwind: {
					path: "$status",
				},
			},
			{
				$lookup: {
					from: "clients",
					localField: "client",
					foreignField: "_id",
					as: "client",
				},
			},
			{
				$unwind: {
					path: "$client",
				},
			},
			{
				$project: {
					buyed: "$buyed",
					manager: "$manager",
					manager_comment: "$manager_comment",
					client: "$client",
					comment: "$comment",
					created: "$created",
					deliver: "$deliver",
					delivery: "$delivery",
					typeDelivery: "$typeDelivery",
					deliverySum: "$deliverySum",
					deliveryRequest: "$deliveryRequest",
					oneC: "$oneC",
					payment: "$payment",
					paymentStatus: "$paymentStatus",
					products: "$products",
					profit: "$profit",
					region: "$region",
					status: "$status",
					sum: "$sum",
					shippedSum: "$shippedSum",
					number: "$number",
					declainReason: "$declainReason",
				},
			},
		]);

		res.status(200).send({ message: "OK", data: ordersFromRegion });

		let workbook = new Excel.Workbook();
		let worksheet = workbook.addWorksheet(`Заказы по региону ${regionTitle}`);

		worksheet.columns = [
			{ header: "№ заказа", key: "number" },
			{ header: "Комментарий менеджера", key: "manager_comment" },
			{ header: "Комментарий", key: "comment" },
			{ header: "Статус", key: "status" },
			{ header: "Оплачен", key: "buyed" },
			{ header: "Тип оплаты", key: "payment" },
			{ header: "Тип доставки", key: "typeDelivery" },
			{ header: "Доставлен", key: "deliver" },
			{ header: "Адрес", key: "delivery" },
			{ header: "Сумма доставки", key: "deliverySum" },
			{ header: "Сумма заказа", key: "sum" },
			{ header: "Покупатель", key: "client" },
			{ header: "Телефон покупателя", key: "clientPhone" },
			{ header: "Менеджер", key: "manager" },
			//{header: 'Товары', key: 'products'},
		];

		worksheet.columns.forEach((column, i) => {
			if (i === 0) column.width = 15;
			if (i === 1) column.width = 18;
			if (i === 2) column.width = 15;
			if (i === 3) column.width = 25;
			if (i === 4) column.width = 12;
			if (i === 5) column.width = 25;
			if (i === 6) column.width = 20;
			if (i === 7) column.width = 12;
			if (i === 8) column.width = 20;
			if (i === 9) column.width = 15;
			if (i === 10) column.width = 15;
			if (i === 11) column.width = 20;
			if (i === 12) column.width = 20;
			if (i === 13) column.width = 20;
		});

		worksheet.getRow(1).font = { bold: true };

		ordersFromRegion.forEach((value) => {
			worksheet.addRow({
				...value,
				delivery:
					value.delivery && typeof value.delivery.city !== "undefined"
						? `${value.delivery.city}, ул. ${value.delivery.street}, д. ${value.delivery.house}, ${value.delivery.building}, кв. ${value.delivery.appt}`
						: value.delivery,
				status: value.status.title,
				typeDelivery:
					value.typeDelivery === "transport"
						? "Доставка транспортом"
						: value.typeDelivery === "courier"
							? "Доставка курьером"
							: value.typeDelivery === "pickup"
								? "Самовывоз"
								: "",
				payment:
					value.payment === "cash"
						? "Наличными"
						: value.payment === "bankTransfer"
							? "Банковский перевод"
							: value.payment === "cartSite"
								? "Картой онлайн"
								: value.payment === "cartReceiving"
									? "Картой при получении"
									: "",
				client: `${value.client.name} ${value.client.lastname}`,
				clientPhone: value.client.phone,
				manager: `${value.manager[0].name} ${value.manager[0].surname} ${value.manager[0].lastname}`,
			});
		});

		worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
			worksheet.getCell(`A${rowNumber}`).border = {
				top: { style: "thin" },
				left: { style: "thin" },
				bottom: { style: "thin" },
				right: { style: "none" },
			};
		});

		worksheet.getCell(`A${worksheet.rowCount}`).border = {
			top: { style: "thin" },
			left: { style: "none" },
			bottom: { style: "none" },
			right: { style: "thin" },
		};

		worksheet.views = [
			{ state: "frozen", xSplit: 0, ySplit: 1, activeCell: "B2" },
		];

		await workbook.xlsx.writeFile(
			path.join(SEO_PATH, `/Заказы_${regionTitle.split(" ").join("_")}.xlsx`)
		);

		// let findUser = false
		for (let i = 0; i < global.users.length; i++) {
			const user = global.users[i];
			if (user.userId === req.userId) {
				console.log("find user");
				// findUser = true
				setTimeout(() => {
					global.io.to(req.userId).emit("DownloadExcel", {
						link: `/uploads/seo/Заказы_${regionTitle
							.split(" ")
							.join("_")}.xlsx`,
						filename: `Заказы_${regionTitle.split(" ").join("_")}.xlsx`,
					});
				}, 3000);
			}
		}

		// if (!findUser) {
		//     res.status(404).json({message: 'Обновите страницу!'})
		// }

		console.log("finish excel");
		res.status(200);
	} catch (error) {
		next(error);
	}
};

exports.getCategoryFeed = async (req, res, next) => {
	try {
		let { region, categoryId, categoryName } = req.body;
		const regionInfo = await Regions.findById(region);
		let currencyId = null;
		switch (regionInfo.valute.code) {
			case "643":
				currencyId = "RUR";
				break;
			case "933":
				currencyId = "BYN";
				break;
			case "398":
				currencyId = "KZT";
				break;
			case "417":
				currencyId = "KGS";
				break;
		}
		console.log(currencyId);
		categoryId = categoryId.map((id) => {
			return mongoose.Types.ObjectId(id);
		});
		let catsIds = [...categoryId];
		for (i = 0; i < 4; i++) {
			catsIds = await getSubCategoriesIds(region, catsIds);
			categoryId.push(...catsIds);
		}
		url = "https://tdcsk.com/products/region/moscow/";
		let productsFromRegion = await Products.aggregate()
			.match({
				"regions.region": mongoose.Types.ObjectId(region),
				"regions.product.category_id": { $in: categoryId },
			})
			.project({
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
				results: "$results",
			})
			.unwind("$results")
			.group({
				_id: "$_id",
				product: {
					$push: "$results.product",
				},
			})
			.unwind("$product")
			.sort({ "product.article": 1 })
			.project({
				_id: 0,
				article: "$product.article",
				title: "$product.title",
				cost: "$product.cost",
				options: "$product.options",
				slug: { $concat: [url, "$product.slug"] },
				images: "$product.images",
				path: "$product.path",
				unit: "$product.unit",
				description: "$product.description",
			});

		const filename = `${regionInfo.title} - ${categoryName}.csv`;
		const options = {
			filename: path.join(FEEDS_PATH, `/${filename}`),
			filePath: path.join(FEEDS_PATH, `/${filename}`),
			name: filename,
			useStyles: true,
			useSharedStrings: true,
			formatterOptions: {
				delimiter: ";",
				quote: false,
			},
		};

		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet("my sheet");
		worksheet.columns = [
			{ header: "id", key: "id" },
			{ header: "name", key: "model" },
			{ header: "vendor", key: "vendor" },
			{ header: "url", key: "url" },
			{ header: "price", key: "price" },
			{ header: "currencyId", key: "currencyId" },
			{ header: "picture", key: "picture" },
		];

		for (let p of productsFromRegion) {
			let vendor = "noname";
			if (p.options.find((opt) => "Производитель" in opt)) {
				let vendorObj = p.options.find((opt) => "Производитель" in opt);
				vendor = vendorObj["Производитель"];
			}
			let image = null;
			if (p.images.length) {
				image = `https://xn--j1ano.com${p.path}${p.images[0]}`;
			}
			let data = {
				id: p.article,
				model: p.title,
				vendor: vendor,
				url: p.slug,
				price: p.cost,
				currencyId: currencyId,
				picture: image,
			};
			worksheet.addRow(data).commit();
		}
		workbook.csv.writeFile(options.filename, options).then(() => {
			setTimeout(() => {
				global.io.to(req.userId).emit("DownloadExcel", {
					link: `/uploads/feeds/${filename}`,
					filename: filename,
				});
			}, 1000);
		});
		res.status(200).send({ message: "ok" });
	} catch (error) {
		next(error);
	}
};

exports.getCategoryFeedYML = async (req, res, next) => {
	try {
		let { region, categoryId, categoryName } = req.body;
		const regionInfo = await Regions.findById(region);
		let currencyId = null;
		switch (regionInfo.valute.code) {
			case "643":
				currencyId = "RUR";
				break;
			case "933":
				currencyId = "BYN";
				break;
			case "398":
				currencyId = "KZT";
				break;
			case "417":
				currencyId = "KGS";
				break;
		}
		categoryId = categoryId.map((id) => {
			return mongoose.Types.ObjectId(id);
		});
		let catsIds = [...categoryId];
		for (i = 0; i < 4; i++) {
			catsIds = await getSubCategoriesIds(region, catsIds);
			categoryId.push(...catsIds);
		}
		url = "https://tdcsk.com/products/region/moscow/";

		const categories = await Categories.aggregate()
			.match({
				"regions.region": mongoose.Types.ObjectId(region),
				"regions.category._id": { $in: categoryId },
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
				_id: "$categories.category._id",
				name: "$categories.category.categoryName",
			});

		let productsFromRegion = await Products.aggregate()
			.match({
				"regions.region": mongoose.Types.ObjectId(region),
				"regions.product.category_id": { $in: categoryId },
			})
			.project({
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
				results: "$results",
			})
			.unwind("$results")
			.group({
				_id: "$_id",
				product: {
					$push: "$results.product",
				},
			})
			.unwind("$product")
			.sort({ "product.article": 1 })
			.project({
				_id: 0,
				article: "$product.article",
				title: "$product.title",
				cost: "$product.cost",
				options: "$product.options",
				slug: { $concat: [url, "$product.slug"] },
				images: "$product.images",
				path: "$product.path",
				unit: "$product.unit",
				description: "$product.description",
				category_id: "$product.category_id",
			});

		let date = moment(Date.now()).format();
		let xmlData = {
			yml_catalog: {
				"@date": date,
				shop: {
					name: "ТД ЦСК",
					url: "https://tdcsk.com",
					categories: {
						category: [],
					},
					currencies: {
						currency: {
							"@id": "RUR",
							"@rate": 1,
						},
					},
					offers: {
						offer: [],
					},
				},
			},
		};
		for (const [i, c] of categories.entries()) {
			c.id = i + 1;
		}
		for (let p of productsFromRegion) {
			let vendor = "noname";
			if (p.options.find((opt) => "Производитель" in opt)) {
				let vendorObj = p.options.find((opt) => "Производитель" in opt);
				vendor = vendorObj["Производитель"];
			}
			let image = null;
			if (p.images.length) {
				image = `https://xn--j1ano.com${p.path}${p.images[0]}`;
			}
			let category_id = p.category_id.toString();
			let ya_category_id = categories.find(
				(c) => c._id.toString() === category_id
			).id;
			let data = {
				"@id": p.article,
				name: p.title,
				vendor: vendor,
				url: p.slug,
				price: p.cost,
				currencyId: currencyId,
				categoryId: ya_category_id,
				picture: image,
			};

			xmlData.yml_catalog.shop.offers.offer.push(data);
		}

		for (let i = 0; i < categories.length; i++) {
			xmlData.yml_catalog.shop.categories.category.push({
				"@id": i + 1,
				"#": categories[i].name,
			});
		}
		console.log(xmlData.yml_catalog.shop.categories.category);

		const filename = `${regionInfo.title} - ${categoryName}.xml`;
		const filePath = path.join(FEEDS_PATH, `/${filename}`);
		const doc = create(xmlData, { separateArrayItems: false });
		const xml = doc.end({ prettyPrint: true });
		fs.writeFile(filePath, xml, (err) => {
			if (err) {
				console.log(err);
			}
		});
		// const options = {
		//     filename: path.join(FEEDS_PATH, `/${filename}`),
		//     filePath: path.join(FEEDS_PATH, `/${filename}`),
		//     name: filename,
		//     useStyles: true,
		//     useSharedStrings: true,
		//     formatterOptions: {
		//         delimiter: ';',
		//         quote: false,
		//       },
		//   };

		// const workbook = new Excel.Workbook()
		// const worksheet = workbook.addWorksheet('my sheet');
		// worksheet.columns = [
		//    { header: 'id', key: 'id' },
		//    { header: 'name', key: 'model' },
		//    { header: 'vendor', key: 'vendor' },
		//    { header: 'url', key: 'url' },
		//    { header: 'price', key: 'price' },
		//    { header: 'currencyId', key: 'currencyId' },
		//    { header: 'picture', key: 'picture' },
		//   ]

		// for (let p of productsFromRegion){
		//     let vendor = 'noname'
		//     if (p.options.find( opt => ('Производитель' in opt)) ){
		//         let vendorObj = p.options.find( opt => ('Производитель' in opt))
		//         vendor = vendorObj['Производитель']
		//     }
		//     let image = null
		//     if (p.images.length){
		//         image = `https://xn--j1ano.com${p.path}${p.images[0]}`
		//     }
		//     let data = {
		//         id: p.article,
		//         model: p.title,
		//         vendor: vendor,
		//         url: p.slug,
		//         price: p.cost,
		//         currencyId: currencyId,
		//         picture: image
		//     }
		//     worksheet.addRow(data).commit();
		//   }
		//   workbook.csv.writeFile(options.filename, options)
		//   .then( ()=>{
		//     setTimeout(() => {
		//         global.io.to(req.userId).emit("DownloadExcel", {link: `/uploads/feeds/${filename}`, filename: filename})
		//     }, 1000)
		//   })
		res.status(200).send({ message: "ok" });
	} catch (error) {
		next(error);
	}
};

exports.getExcelFromClients = async (req, res, next) => {
	const page = +req.query.page - 1;
	let myMatch = {};

	const mySort = { createdAt: -1 };

	myMatch = {
		...myMatch,
		$or: [
			{
				deleted: {
					$exists: false,
				},
			},
			{
				deleted: false,
			},
		],
	};

	let clients = await Clients.aggregate([
		{
			$lookup: {
				from: "orders",
				let: { oid: "$orders" },
				pipeline: [
					{
						$match: { $expr: { $in: ["$_id", "$$oid"] } },
					},
					{
						$lookup: {
							from: "regions",
							localField: "region",
							foreignField: "_id",
							as: "region",
						},
					},
					{
						$unwind: {
							path: "$region",
						},
					},
					{
						$lookup: {
							from: "orders",
							localField: "orders",
							foreignField: "_id",
							as: "orders",
						},
					},
					{
						$lookup: {
							from: "users",
							localField: "manager",
							foreignField: "_id",
							as: "manager",
						},
					},
					{
						$lookup: {
							from: "conditions",
							localField: "status",
							foreignField: "_id",
							as: "status",
						},
					},
					{
						$unwind: {
							path: "$status",
						},
					},
					{
						$sort: { created: -1 },
					},
					{
						$limit: 5,
					},
				],
				as: "orders",
			},
		},
		{
			$facet: {
				clients: [
					{
						$match: myMatch,
					},
					{
						$sort: mySort,
					},
					{
						$lookup: {
							from: "regions",
							localField: "region",
							foreignField: "_id",
							as: "region",
						},
					},
					{
						$unwind: {
							path: "$region",
						},
					},
					{
						$group: {
							_id: "$_id",
							client: {
								$mergeObjects: "$$ROOT",
							},
							total: {
								$sum: {
									$sum: "$$ROOT.orders.sum",
								},
							},
						},
					},
					{
						$project: {
							_id: "$_id",
							surname: "$client.surname",
							name: "$client.name",
							lastname: "$client.lastname",
							phone: "$client.phone",
							email: "$client.email",
							region: "$client.region",
							orders: "$client.orders",
							createdAt: "$client.createdAt",
							total: "$total",
							clubCard: "$client.clubCard",
						},
					},
					{
						$sort: {
							createdAt: -1,
						},
					},
				],
				totalCost: [
					{
						$match: myMatch,
					},
					{
						$group: {
							_id: null,
							cost: {
								$sum: {
									$sum: "$$ROOT.orders.sum",
								},
							},
						},
					},
				],
				count: [
					{
						$match: myMatch,
					},
					{
						$group: {
							_id: 0,
							count: { $sum: 1 },
						},
					},
				],
			},
		},
	]);
	const filename = `clients.xlsx`;
	const options = {
		filename: path.join(SEO_PATH, `/${filename}`),
		filePath: path.join(SEO_PATH, `/${filename}`),
		name: filename,
		useStyles: true,
		useSharedStrings: true,
	};

	const workbook = new Excel.Workbook();
	const worksheet = workbook.addWorksheet("my sheet");
	worksheet.columns = [
		{ header: "Клиент", key: "fullname" },
		{ header: "Почта", key: "email" },
		{ header: "Телефон", key: "phone" },
		{ header: "Регион", key: "region" },
		{ header: "Дата", key: "date" },
		{ header: "Сумма", key: "total" },
	];
	worksheet.columns.forEach((column, i) => {
		if (i === 0) column.width = 50;
		if (i === 1) column.width = 40;
		if (i === 2) column.width = 20;
		if (i === 3) column.width = 20;
		if (i === 4) column.width = 20;
		if (i === 5) column.width = 20;
	});
	let result = clients[0].clients;
	for (c of result) {
		let fullname =
			(c.name ? c.name + " " : "") + (c.lastname ? c.lastname : "");
		let data = {
			fullname: fullname,
			email: c.email,
			phone: c.phone,
			region: c.region.title,
			date: c.createdAt,
			total: c.total,
		};
		worksheet.addRow(data).commit();
	}

	const filePath = path.join(SEO_PATH, `/${options.filename}`);
	console.log(filePath);
	//   await workbook.xlsx.writeFile(options.filename, options)
	await workbook.xlsx.writeFile(path.join(SEO_PATH, filename)).then(() => {
		res.status(200).download(path.join(SEO_PATH, filename));
	});
	// res.send({message: "ok"})
};

exports.getExcelFromTasks = async (req, res, next) => {
	const page = +req.query.page - 1;
	let myMatch = {};

	const mySort = { createdAt: -1 };

	myMatch = {
		...myMatch,
		$or: [
			{
				deleted: {
					$exists: false,
				},
			},
			{
				deleted: false,
			},
		],
	};
	const user = await Users.findOne({
		_id: mongoose.Types.ObjectId("5fb7ae283a8ca00699551693"),
	});
	const tasks = await Tasks.aggregate()
		.match({
			initiator: mongoose.Types.ObjectId("5fb7ae283a8ca00699551693"),
			parent_id: { $exists: false },
			status: {
				$in: [
					mongoose.Types.ObjectId("601bad4735e4052ee544d788"),
					mongoose.Types.ObjectId("601bad7c35e4052ee544d78a"),
					mongoose.Types.ObjectId("5f7f30d450523015fc320056"),
					mongoose.Types.ObjectId("5f7f30d450523015fc320056"),
					mongoose.Types.ObjectId("5f7afdbb701805712f1a8e2b"),
				],
			},
		})
		// .lookup({
		//     from: 'users',
		//     localField: 'initiator',
		//     foreignField: '_id',
		//     as: 'initiator'
		// })
		.lookup({
			from: "users",
			localField: "executors",
			foreignField: "_id",
			as: "executor",
		})
		.lookup({
			from: "status",
			localField: "status",
			foreignField: "_id",
			as: "status",
		})
		.project({
			_id: "$_id",
			// initiator: { $first: "$initiator" },
			title: "$title",
			executor: { $first: "$executor" },
			description: "$description",
			deadline_date: "$deadline_date",
			creation_date: "$creation_date",
			status: { $first: "$status" },
			comment: "$comment",
		});
	console.log(tasks);
	const filename = `Задачи.xlsx`;
	const options = {
		filename: path.join(SEO_PATH, `/${filename}`),
		filePath: path.join(SEO_PATH, `/${filename}`),
		name: filename,
		useStyles: true,
		useSharedStrings: true,
	};

	const workbook = new Excel.Workbook();
	const worksheet = workbook.addWorksheet("my sheet");
	let initiator = user.name + " " + user.surname;
	worksheet.columns = [
		{ header: "Автор", key: "initiator" },
		{ header: "Исполнитель", key: "executor" },
		{ header: "Название", key: "title" },
		{ header: "Описание", key: "description" },
		{ header: "Комментарий", key: "comment" },
		{ header: "Дата создания", key: "creation_date" },
		{ header: "Дедлайн", key: "deadline_date" },
		{ header: "Статус", key: "status" },
	];
	worksheet.columns.forEach((column, i) => {
		if (i === 0) column.width = 25;
		if (i === 1) column.width = 25;
		if (i === 2) column.width = 50;
		if (i === 3) column.width = 70;
		if (i === 4) column.width = 40;
		if (i === 5) column.width = 20;
		if (i === 6) column.width = 20;
		if (i === 7) column.width = 20;
	});
	for (t of tasks) {
		let executor =
			(t.executor.name ? t.executor.name + " " : "") +
			(t.executor.surname ? t.executor.surname : "");
		let data = {
			initiator: initiator,
			executor: executor,
			title: t.title,
			description: t.description,
			comment: t.comment,
			creation_date: t.creation_date,
			deadline_date: t.deadline_date,
			status: t.status.title,
		};
		worksheet.addRow(data).commit();
	}

	workbook.xlsx.writeFile(options.filename, options);

	res.send(tasks);
};

exports.getExcelManagerCodes = async (req, res, next) => {
	const users = await Users.aggregate().match({
		deleted: false,
		role: "manager",
		number: { $exists: true },
	});

	const filename = `Коды.xlsx`;
	const options = {
		filename: path.join(SEO_PATH, `/${filename}`),
		filePath: path.join(SEO_PATH, `/${filename}`),
		name: filename,
		useStyles: true,
		useSharedStrings: true,
	};

	const workbook = new Excel.Workbook();
	const worksheet = workbook.addWorksheet("my sheet");
	worksheet.columns = [
		{ header: "ФИО", key: "fio" },
		{ header: "Код", key: "code" },
	];
	worksheet.columns.forEach((column, i) => {
		if (i === 0) column.width = 70;
		if (i === 1) column.width = 20;
	});
	for (t of users) {
		let fio =
			(t.name ? t.name + " " : "") +
			(t.lastname ? t.lastname + " " : "") +
			(t.surname ? t.surname : "");
		let data = {
			fio: fio,
			code: t.number,
		};
		worksheet.addRow(data).commit();
	}

	workbook.xlsx.writeFile(options.filename, options);

	res.send(users);
};
