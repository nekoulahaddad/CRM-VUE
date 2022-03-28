const mongoose = require("mongoose");
const Clients = require("../models/clients");
const Orders = require("../models/orders");
const Regions = require("../models/regions");
const { generatePassword, comparePasswords } = require("../utils/bcrypt");
const {
  generateTokenForClient,
  generateRefreshTokenForClient,
} = require("../utils/jwt");
const generator = require("generate-password");
const { SMSRu } = require("node-sms-ru");
const smsRu = new SMSRu(process.env.SMSRUKEY);
const moment = require("moment");
const _ = require("lodash");

exports.getClients = async (req, res, next) => {
  try {
    const page = +req.query.page - 1;
    const options = req.body.options;
    let phone = options.search
      ? options.search
          .replace(/ /g, "")
          .replace("+", "")
          .replace("-", "")
          .replace("(", "")
          .replace(")", "")
      : "";
    const searchStr = options.search ? options.search.split(" ") : null;
    if (searchStr && searchStr.length) {
      for (let i = 0; i < searchStr.length; i++) {
        searchStr[i] = new RegExp(
          "(w|s){0,}" + _.escapeRegExp(searchStr[i].trim()) + "(w|s){0,}",
          "ui"
        );
      }
    }
    let myMatch = {};

    if (options.region !== "all" && options.region !== null) {
      const region = await Regions.findOne({ value: options.region })
        .select("_id")
        .lean();

      myMatch["region"] = {
        $in: [mongoose.Types.ObjectId(region._id)],
      };
    }

    if (options.dates !== null || options.dates !== "all") {
      let now = moment().startOf("day").format();
      let today, week, weekAgo, month, monthAgo, year, yearAgo, startOfMonth;
      now = new Date(now);

      switch (options.dates) {
        case "today":
          today = moment().startOf("day").format();
          today = new Date(today);

          myMatch["createdAt"] = {
            $lt: now,
            $gt: today,
          };
          break;
        case "week":
          week = moment().endOf("day").add(8, "day").format();
          weekAgo = moment().subtract(7, "day").add(1, "day").format();
          week = new Date(week);
          weekAgo = new Date(weekAgo);

          myMatch["createdAt"] = {
            $lt: week,
            $gt: weekAgo,
          };
          break;
        case "month":
          month = moment().endOf("day").format();
          monthAgo = moment().subtract(1, "month").add(1, "day").format();
          month = new Date(month);
          monthAgo = new Date(monthAgo);

          myMatch["createdAt"] = {
            $lt: month,
            $gt: monthAgo,
          };
          break;
        case "year":
          year = moment().endOf("year").format();
          yearAgo = moment()
            .startOf("year")
            .startOf("day")
            .subtract(1, "year")
            .format();
          year = new Date(year);
          yearAgo = new Date(yearAgo);

          myMatch["createdAt"] = {
            $lt: year,
            $gt: yearAgo,
          };
          break;
        default:
          break;
      }
    }
    const mySort = { createdAt: -1 };

    if (options.clubcard !== null) {
      if (options.clubcard === -1) {
        mySort["clubCard"] = -1;
        delete mySort["createdAt"];
      }
      if (options.clubcard === 1) {
        mySort["clubCard"] = 1;
        delete mySort["createdAt"];
      }
    }
    // console.log('mySort', mySort)

    if (options.startDate && new Date(options.startDate) instanceof Date) {
      let startDate = new Date(moment(options.startDate));
      let endDate = new Date(moment(options.endDate));

      myMatch["createdAt"] = {
        $lt: endDate,
        $gt: startDate,
      };
    }

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

    if (options.search) {
      let or = [
        {
          $or: [
            {
              $and: [
                {
                  lastname: searchStr[0],
                },
              ],
            },
            {
              $and: [
                {
                  name: searchStr[0],
                },
              ],
            },
            {
              $and: [
                {
                  surname: searchStr[0],
                },
              ],
            },
            {
              phone: phone,
            },
          ],
        },
        {
          phone: Number.parseInt(options.search),
        },
      ];

      if (searchStr.length > 1) {
        or[0].$or[0].$and.push({
          surname: searchStr[1],
        });
        or[0].$or[1].$and.push({
          name: searchStr[1],
        });
        or[0].$or[2].$and.push({
          lastname: searchStr[1],
        });
      }

      myMatch = {
        ...myMatch,
        $or: or,
      };
    }

    let clients = await Clients.aggregate([
      {
        $match: myMatch,
      },
      {
        $sort: mySort,
      },
      {
        $skip: page * 15,
      },
      {
        $limit: 15,
      },
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
                preserveNullAndEmptyArrays: true,
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

    const orders = await Orders.aggregate([
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
        $facet: {
          results: [
            {
              $match: myMatch,
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $skip: page * 15,
            },
            {
              $limit: 15,
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
                  $sum: "$sum",
                },
              },
            },
          ],
          totalProfit: [
            {
              $match: myMatch,
            },
            {
              $group: {
                _id: null,
                profit: {
                  $sum: "$profit",
                },
              },
            },
          ],
          totalShippedSum: [
            {
              $match: myMatch,
            },
            {
              $group: {
                _id: null,
                shippedSum: {
                  $sum: "$shippedSum",
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

    let countClients = (await Clients.find(myMatch).countDocuments()) - 1;

    let result = {
      clients: clients ? clients[0].clients : [],
      count: clients
        ? clients[0].count[0]
          ? clients[0].count[0].count
          : 0
        : 0,
      countClients: countClients,
      //totalCost: clients ? clients[0].totalCost[0] ? clients[0].totalCost[0].cost : 0 : 0,
      totalCost: orders
        ? orders[0].totalCost[0]
          ? orders[0].totalCost[0].cost
          : 0
        : 0,
      profit: orders
        ? orders[0].totalProfit[0]
          ? orders[0].totalProfit[0].profit
          : 0
        : 0,
      shippedSum: orders
        ? orders[0].totalShippedSum[0]
          ? orders[0].totalShippedSum[0].shippedSum
          : 0
        : 0,
    };

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.addClient = async (req, res, next) => {
  try {
    const phone = req.body.phone;
    const clients = await Clients.find({ phone: phone });
    if (clients.length) {
      res.status(409).json({
        message: "Клиент с таким номером телефона уже существует!",
      });
      return;
    }
    const newClient = await new Clients(req.body);

    const password = generator.generate({
      length: 8,
      numbers: true,
    });

    newClient.password = await generatePassword(password);

    let token = generateTokenForClient({
      phone: newClient.phone,
    });

    let refresh = generateRefreshTokenForClient({
      phone: newClient.phone,
    });

    newClient.token = token;
    newClient.refresh = refresh;

    const sendResult = await smsRu.sendSms({
      to: newClient.phone,
      from: "TD-CSK-SHOP",
      msg: `Логин: ${newClient.phone}\r\nПароль для входа: ${password}`,
    });

    await newClient.save();
    res.status(201).json({
      message: "ADDED",
      id: newClient._id,
      token: token,
      refresh: refresh,
    });
  } catch (error) {
    next(error);
  }
};

exports.authLogin = async (req, res, next) => {
  try {
    const phone = req.body.phone;
    const password = req.body.password;
    const client = await Clients.findOne({ phone: phone });

    if (!client) {
      res.status(404).json({ message: "NOT FOUND" });
      return;
    }

    const compare = await comparePasswords(password, client.password);

    if (!compare) {
      res.status(401).json({ message: "UNAUTHORIZED" });
      return;
    }

    let token = generateTokenForClient({
      _id: client._id,
      email: client.email,
    });
    let refresh = generateRefreshTokenForClient({
      _id: client._id,
      email: client.email,
    });

    await client.updateOne({ token: token, refresh: refresh });
    res.status(200).json({ message: "OK", id: client._id, token, refresh });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const id = req.body.clientId;
    const refresh = req.body.refresh;
    const client = await Clients.findOne({ _id: id }).lean();

    if (!client) {
      res.status(404).json({ message: "NOT FOUND" });
    }

    if (refresh !== client.refresh) {
      res.status(401).json({
        message: "UNAUTHORIZED",
      });
    }

    let newToken = generateToken({ _id: client._id, email: client.email });
    let newRefresh = generateRefreshToken({
      _id: client._id,
      email: client.email,
    });
    await client.updateOne({ token: newToken, refresh: newRefresh });
    res.status(200).json({ message: "OK", token, refresh });
  } catch (error) {
    next(error);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    const clientId = req.body.clientId;
    const deletedOrder = await Orders.updateOne(
      {
        client: mongoose.Types.ObjectId(clientId),
      },
      {
        $set: {
          deleted: true,
        },
      }
    );
    const deletedClient = await Clients.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(clientId),
      },
      {
        $set: {
          deleted: true,
        },
      }
    );

    res.status(200).json({
      message: "DELETED",
      client: {
        _id: clientId,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getClientByPhone = async (req, res, next) => {
  try {
    let phoneNumber = req.params.phone;
    let phoneMatch = {};
    //phoneMatch['deleted'] = false
    phoneMatch["phone"] = phoneNumber;
    const clientBySearch = await Clients.find(phoneMatch)
      .select([
        "_id",
        "surname",
        "name",
        "lastname",
        "phone",
        "email",
        "birthday",
        "region",
        "club_cart",
        "bik",
        "ur_corScore",
        "ur_actualAddress",
        "ownership",
        "account_number",
        "ur_address",
        "director",
        "okpo",
        "kpp",
        "inn",
        "checking_account",
        "organisation",
        "bank",
        "deleted",
      ])
      .limit(4)
      .lean();

    if (clientBySearch.length && clientBySearch[0].deleted === true) {
      res.status(200).json([]);
    } else {
      res.status(200).json(clientBySearch);
    }
  } catch (error) {
    next(error);
  }
};
