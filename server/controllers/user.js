const mongoose = require("mongoose");
const path = require("path");
const User = require("../models/user");
const Tasks = require("../models/tasks");
const Reports = require("../models/reports");
const Department = require("../models/departments");
const Region = require("../models/regions");
const { generatePassword, comparePasswords } = require("../utils/bcrypt");
const {
  uploadFilesFromTempToFolder,
  makeUserDir,
  removeUserDir,
  deleteUserUploadedFile,
} = require("../utils/fs");
const { generateToken, generateRefreshToken } = require("../utils/jwt");
const { TEMP_PATH, AVATARS_PATH, PASSPORTS_PATH } = require("../utils/path");
const generator = require("generate-password");
const { SMSRu } = require("node-sms-ru");
const smsRu = new SMSRu(process.env.SMSRUKEY);

exports.getUsers = async (req, res, next) => {
  try {
    const page = +req.query.page - 1;
    const options = req.body.options;
    const myMatch = {};
    const mySort = {};
    if (options.updatedAt !== null) {
      mySort.updatedAt = options.updatedAt;
    } else {
      mySort._id = -1;
    }
    console.log(req.body);
    myMatch["deleted"] = false;
    if (options.department !== "all" && options.department !== null) {
      myMatch["department.value"] = {
        $in: [options.department],
      };
    }
    if (options.region !== "all" && options.region !== null) {
      myMatch["region.value"] = {
        $in: [options.region],
      };
    }
    const users = await User.aggregate([
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
        $facet: {
          result: [
            {
              $match: myMatch,
            },
            {
              $sort: mySort,
            },
            {
              $skip: 15 * page,
            },
            {
              $limit: 15,
            },
            {
              $project: {
                _id: "$_id",
                avatar: "$avatar",
                passport_photo: "$passport_photo",
                name: "$name",
                surname: "$surname",
                lastname: "$lastname",
                passport: "$passport",
                inn: "$inn",
                position: "$position",
                department: "$department",
                region: {
                  _id: "$region._id",
                  value: "$region.value",
                  title: "$region.title",
                },
                role: "$role",
                rating: "$rating",
                tasks: "$tasks",
                salary: "$salary",
                award: "$award",
                graphic: "$graphic",
                login: "$login",
                phone: "$phone",
                additional_phone: "$additional_phone",
                email: "$email",
                employment_date: "$employment_date",
                date_of_birth: "$date_of_birth",
                city: "$city",
                street: "$street",
                house: "$house",
                appartment: "$appartment",
                number: "$number",
                education: "$education",
                zodiac_sign: "$zodiac_sign",
                element: "$element",
                chinese_year: "$chinese_year",
                specialty: "$specialty",
                presonal_number: "$presonal_number",
                children: "$children",
                options: {
                  userEditor: "$options.userEditor",
                },
                updatedAt: "$updatedAt",
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
          path: "$count",
        },
      },
    ]);
    let result = {
      users: users[0] ? users[0].result : [],
      count: users[0] ? users[0].count.count : 0,
    };
    console.log("///////////////////////");
    console.log("Users");
    // console.log(result);
    console.log("///////////////////////");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getUsersDepartment = async (req, res, next) => {
  try {
    console.log("departments");
    const departments = await User.aggregate([
      {
        $match: {
          deleted: false,
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
        $facet: {
          departments: [
            {
              $group: {
                _id: "$department._id",
                value: {
                  $first: "$department.value",
                },
                title: {
                  $first: "$department.title",
                },
                count: {
                  $sum: 1,
                },
              },
            },
            {
              $sort: {
                count: -1,
              },
            },
          ],
          total: [
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
          path: "$total",
        },
      },
    ]);
    console.log("///////////////////////");
    console.log("Users department");
    console.log("///////////////////////");
    res.status(200).json(departments[0]);
  } catch (error) {
    next(error);
  }
};

exports.getUsersBySearchWithoutDirector = async (req, res, next) => {
  try {
    console.log("FIOOOO");
    let myMatch = {};
    let searchStr = req.params.fio.split(" ");
    myMatch["deleted"] = false;
    if (searchStr) {
      if (searchStr.length > 3 || req.params.fio.includes("+")) {
        myMatch["login"] = {
          $in: [`+` + searchStr.join(" ").replace(/[^0-9]/g, "")],
        };
      }
      if (searchStr.length <= 3 && !req.params.fio.includes("+")) {
        searchStr = searchStr[0].toLowerCase().split("");
        searchStr[0] = searchStr[0].toUpperCase();
        console.log(searchStr);
        searchStr = searchStr.join("");

        console.log(searchStr);

        myMatch = {
          ...myMatch,
          surname: {
            $regex: searchStr,
          },
        };
      }
    }

    console.log(myMatch);

    const usersBySearch = await User.find(myMatch)
      .populate("region")
      .populate("department")
      .lean();
    console.log("///////////////////////");
    console.log("Users By search");
    console.log(usersBySearch);
    console.log("///////////////////////");
    res.status(200).json({ users: usersBySearch });
  } catch (error) {
    next(error);
  }
};

exports.getUsersBySearch = async (req, res, next) => {
  try {
    let fio = req.params.fio.split(" ");
    let surname = fio[0] || "";
    let name = fio[1] || "";
    let lastname = fio[2] || "";
    surname = surname.toLowerCase().split("");
    surname[0] = surname[0].toUpperCase();
    surname = surname.join("");
    console.log(surname);
    if (name) {
      name = name.toLowerCase().split("");
      name[0] = name[0].toUpperCase();
      name = name.join("");
      console.log(name);
    }
    if (lastname) {
      lastname = surname.toLowerCase().split("");
      lastname[0] = lastname[0].toUpperCase();
      lastname = lastname.join("");
      console.log(lastname);
    }

    const usersBySearch = await User.find({
      deleted: false,
      surname: {
        $regex: surname,
      },
      name: {
        $regex: name,
      },
    })
      .select([
        "_id",
        "surname",
        "name",
        "lastname",
        "phone",
        "position",
        "avatar",
      ])
      .limit(4)
      .lean();
    console.log("///////////////////////");
    console.log("Users By search");
    console.log(usersBySearch);
    console.log("///////////////////////");
    res.status(200).json(usersBySearch);
  } catch (error) {
    next(error);
  }
};

exports.getManagersBySearch = async (req, res, next) => {
  try {
    let region = req.params.region;
    let fio = req.params.fio.split(" ");
    let surname = fio[0] || "";
    let name = fio[1] || "";
    let lastname = fio[2] || "";

    // console.log(region)
    surname = surname.toLowerCase().split("");
    surname[0] = surname[0].toUpperCase();
    surname = surname.join("");

    // console.log(surname)

    // console.log(name)
    if (name) {
      name = name.toLowerCase().split("");
      name[0] = name[0].toUpperCase();
      name = name.join("");
    }
    if (lastname) {
      lastname = surname.toLowerCase().split("");
      lastname[0] = lastname[0].toUpperCase();
      lastname = lastname.join("");
    }

    let cond = {
      role: "manager",
      deleted: false,
      surname: {
        $regex: surname,
      },
      name: {
        $regex: name,
      },
    };

    // if (region && region !== 'undefined')
    //     cond.region = mongoose.Types.ObjectId(region)

    const usersBySearch = await User.find(cond)
      .select(["_id", "surname", "name", "lastname", "phone"])
      .limit(4)
      .lean();

    console.log("///////////////////////");
    console.log("Users By search");
    // console.log(usersBySearch);
    console.log("///////////////////////");

    res.status(200).json(usersBySearch);
  } catch (error) {
    next(error);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const dataUser = req.body;
    const avatar = req.files[0];
    let usersRegistered = await User.find({
      phone: dataUser.phone,
    }).countDocuments();
    console.log(usersRegistered);
    if (usersRegistered) {
      res.status(400).json({
        message: "Номер уже зарегистрирован!",
      });
      return;
    }
    const passports = req.files.slice(1, req.files.length);
    console.log(passports);
    console.log(dataUser);
    const region = await Region.findOne({
      value: dataUser.region,
    }).lean();
    dataUser.region = mongoose.Types.ObjectId(region._id);
    const department = await Department.findOne({
      value: dataUser.department,
    }).lean();
    dataUser.department = mongoose.Types.ObjectId(department._id);
    const newUser = await new User(dataUser);
    req.userId = newUser._id;
    if (avatar) {
      await makeUserDir(AVATARS_PATH, newUser._id);
      await uploadFilesFromTempToFolder(
        TEMP_PATH,
        AVATARS_PATH,
        avatar.filename,
        newUser._id
      );
      newUser.avatar = `/avatars/${newUser._id}/${avatar.filename}`;
    }
    if (passports.length) {
      await makeUserDir(PASSPORTS_PATH, newUser._id);
      newUser.passport_photo = [];
      for (let i = 0; i < passports.length; i++) {
        await uploadFilesFromTempToFolder(
          TEMP_PATH,
          PASSPORTS_PATH,
          passports[i].filename,
          newUser._id
        );
        newUser.passport_photo.push(
          `/passports/${newUser._id}/${passports[i].filename}`
        );
      }
    }
    if (dataUser.children) {
      dataUser.children = JSON.parse(dataUser.children);
    }
    const password = generator.generate({
      length: 8,
      numbers: true,
    });
    console.log(password);
    newUser.login = dataUser.phone.replace(/\s/g, "");
    newUser.password = await generatePassword(password);
    console.log(password);
    if (newUser.role === "manager") {
      let lastNumber = await User.find()
        .select("number")
        .sort({ number: -1 })
        .limit(1);
      if (parseInt(lastNumber).toString().length === 1) {
        newUser.number = ("00" + parseInt(lastNumber + 1)).toString();
      } else if (parseInt(lastNumber).toString().length === 2) {
        newUser.number = ("0" + parseInt(lastNumber + 1)).toString();
      } else {
        newUser.number = (+lastNumber + 1).toString();
      }
    }
    console.log("///////////////////////");
    console.log("New User");
    // console.log(newUser)
    console.log("///////////////////////");
    await newUser.save();

    let addedUser = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(newUser._id),
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
        $unwind: {
          path: "$region",
        },
      },
      {
        $project: {
          _id: "$_id",
          avatar: "$avatar",
          passport_photo: "$passport_photo",
          name: "$name",
          surname: "$surname",
          lastname: "$lastname",
          passport: "$passport",
          inn: "$inn",
          position: "$position",
          department: "$department",
          region: {
            _id: "$region._id",
            value: "$region.value",
            title: "$region.title",
          },
          role: "$role",
          rating: "$rating",
          tasks: "$tasks",
          salary: "$salary",
          award: "$award",
          graphic: "$graphic",
          login: "$login",
          phone: "$phone",
          additional_phone: "$additional_phone",
          email: "$email",
          employment_date: "$employment_date",
          date_of_birth: "$date_of_birth",
          city: "$city",
          street: "$street",
          house: "$house",
          appartment: "$appartment",
          education: "$education",
          specialty: "$specialty",
          zodiac_sign: "$zodiac_sign",
          element: "$element",
          chinese_year: "$chinese_year",
          presonal_number: "$presonal_number",
        },
      },
    ]);

    const sendResult = await smsRu.sendSms({
      to: newUser.phone,
      from: "TD-CSK-SHOP",
      msg: `Логин: ${newUser.phone}\r\nПароль для входа: ${password}\r\nЦРМ система цск.com`,
    });

    console.log(addedUser);
    res.status(201).json({
      message: "ADDED",
      user: addedUser[0],
    });
  } catch (error) {
    await removeUserDir(AVATARS_PATH, req.userId);
    await removeUserDir(PASSPORTS_PATH, req.userId);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    let login = [req.body.login, req.body.login.replace(/ /g, "")];
    let user = await User.findOne({
      $and: [
        { deleted: false },
        { $or: [{ phone: { $in: login } }, { login: { $in: login } }] },
      ],
    }).lean();

    if (!user) {
      res.status(404).json({
        message: "Пользователь не найден",
      });
      return;
    }

    const password = generator.generate({
      length: 8,
      numbers: true,
    });

    user.password = await generatePassword(password);
    console.log(user);
    await User.updateOne(
      {
        _id: mongoose.Types.ObjectId(user._id),
      },
      {
        password: user.password,
      }
    );

    const sendResult = await smsRu.sendSms({
      to: user.phone,
      from: "TD-CSK-SHOP",
      msg: `Новый пароль для входа: ${password}`,
    });
    console.log(password);
    res.status(201).json({
      message: "EDITED",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const avatar =
      req.files["avatar"] && req.files["avatar"][0]
        ? req.files["avatar"][0]
        : req.files["avatar"];
    const passports = req.files["passport_photo"];

    const currentUser = await User.findById(mongoose.Types.ObjectId(userId));
    const dataUser = req.body;
    if (avatar) {
      await makeUserDir(AVATARS_PATH, userId);
      await deleteUserUploadedFile(currentUser.avatar);
      await uploadFilesFromTempToFolder(
        TEMP_PATH,
        AVATARS_PATH,
        avatar.filename,
        currentUser._id
      );
      dataUser.avatar = `/avatars/${currentUser._id}/${avatar.filename}`;
    } else {
      delete dataUser.avatar;
    }
    if (passports) {
      for (let j = 0; j < passports.length; j++) {
        await deleteUserUploadedFile(currentUser.passport_path[j]);
      }
      for (let i = 0; i < passports.length; i++) {
        await uploadFilesFromTempToFolder(
          TEMP_PATH,
          PASSPORTS_PATH,
          passports[i].filename,
          newUser._id
        );
      }
      dataUser.passport_photo = `/passports/${dataUser._id}/${passport_photo[0].filename}`;
    } else {
      delete dataUser.passport_photo;
    }
    if (dataUser.region) {
      const region = await Region.findOne({
        value: dataUser.region,
      });
      console.log(region);
      dataUser.region = mongoose.Types.ObjectId(region._id);
    }
    if (dataUser.department) {
      const department = await Department.findOne({
        value: dataUser.department,
      });
      dataUser.department = mongoose.Types.ObjectId(department._id);
    }

    if (dataUser.number && dataUser.number > 0) {
      const user = await User.findOne({
        _id: {
          $ne: mongoose.Types.ObjectId(userId),
        },
        number: dataUser.number,
      });

      if (user) {
        return res.status(422).json({
          message: "Сотрудник с таким номером уже есть!",
        });
      }
    }

    const newUser = await new User(dataUser);
    if (dataUser.options) {
      dataUser.options = JSON.parse(dataUser.options);
    }
    if (dataUser.children) {
      dataUser.children = JSON.parse(dataUser.children);
    }
    if (dataUser.phone) {
      dataUser.phone.replace(/\s/g, "");
    }
    await currentUser.updateOne(dataUser);
    res.status(201).json({
      message: "EDITED",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = Array.isArray(req.body.userId)
      ? req.body.userId
      : [req.body.userId];
    for (id of userId) {
      await Tasks.deleteMany({ executor: id });
      await Reports.deleteMany({ executor: id });
      const deletedUser = await User.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            deleted: true,
            phone: null,
          },
        }
      );
      for (let i = 0; i < deletedUser.passport_photo.length; i++) {
        await deleteUserUploadedFile(
          path.join(__dirname, "static", deletedUser.passport_photo[i])
        );
      }
      await deleteUserUploadedFile(
        path.join(__dirname, "static", deletedUser.avatar)
      );
    }

    console.log("///////////////////////");
    console.log("Deleted User");
    console.log("///////////////////////");
    res.status(201).json({
      message: "DELETED",
    });
  } catch (error) {
    next(error);
  }
};

exports.authLogin = async (req, res, next) => {
  try {
    console.log("authLigin", req.body);
    const login = req.body.login.replace(/\s/g, "");
    const password = req.body.password.trim();
    const user = await User.findOne({
      deleted: false,
      $or: [
        {
          phone: req.body.login,
        },
        {
          login: login,
        },
      ],
    }).populate("department");

    console.log("authLogin", user);

    console.log("authLigin", user);

    if (!user || user.deleted) {
      res.status(404).json({
        message: "Пользователь не найден",
      });
      return;
    }

    const compare = await comparePasswords(password, user.password);

    if (!compare) {
      res.status(401).json({
        message: "Пароль неверный",
      });
      return;
    }

    let token = generateToken({
      _id: user._id,
      login: user.login,
      name: user.name,
      surname: user.surname,
      lastname: user.lastname,
      role: user.role,
      department: user.department.value,
      options: user.options,
      number: user.number ? user.number : null,
      inner_number: user.inner_number ? user.inner_number : null,
    });

    let refresh = generateRefreshToken({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      lastname: user.lastname,
      options: user.options,
      role: user.role,
      number: user.number ? user.number : null,
      inner_number: user.inner_number ? user.inner_number : null,
    });

    await user.updateOne({
      token: token,
      refresh: refresh,
    });
    console.log(token);
    res.status(200).json({
      message: "OK",
      token,
      refresh,
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const id = req.body.userId;
    const refresh = req.body.refresh;
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(id),
    });

    if (!user) {
      res.status(404).json({
        message: "Пользователь не найден",
      });
      return;
    }
    console.log(refresh);
    console.log(user.refresh);

    if (refresh !== user.refresh) {
      res.status(401).json({
        message: "Пройдите авторизацию",
      });
      return;
    }

    console.log("Обновление токена");

    let newToken = generateToken({
      _id: user._id,
      login: user.login,
      name: user.name,
      role: user.role,
    });
    let newRefresh = generateRefreshToken({
      _id: user._id,
      name: user.name,
      role: user.role,
    });
    await user.updateOne({
      token: newToken,
      refresh: newRefresh,
    });
    res.status(200).json({
      message: "OK",
      token: newToken,
      refresh: newRefresh,
    });
  } catch (error) {
    next(error);
  }
};

exports.remindPassword = async (req, res, next) => {
  try {
    let userId = req.body.userId;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let user = await User.findById(userId).lean();

    if (!user) {
      res.status(404).json({
        message: "Пользователь не найден",
      });
      return;
    }

    const compare = await comparePasswords(oldPassword, user.password);

    if (!compare) {
      res.status(401).json({
        message: "Пароль неверный",
      });
      return;
    }

    user.password = await generatePassword(newPassword);

    console.log(user);
    await User.updateOne(
      {
        _id: mongoose.Types.ObjectId(userId),
      },
      {
        password: user.password,
      }
    );

    res.status(201).json({
      message: "EDITED",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.resetInnerNumber = async (req, res, next) => {
  try {
    let userId = req.body.userId;
    let inner_number = req.body.inner_number;

    let user = await User.findById(userId).lean();

    if (!user) {
      res.status(404).json({
        message: "Пользователь не найден",
      });
      return;
    }

    if (inner_number) user.inner_number = inner_number;

    console.log(user);
    await User.updateOne(
      {
        _id: mongoose.Types.ObjectId(userId),
      },
      {
        inner_number: user.inner_number,
      }
    );

    res.status(201).json({
      message: "EDITED",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.generatePassword = async (req, res, next) => {
  try {
    let password = req.body.password;
    let passwordNew = await generatePassword(password);
    res.status(201).json({ passwordNew });
  } catch (err) {
    console.log(err);
  }
};

exports.getBuyersBySearch = async (req, res, next) => {
  try {
    let region = req.params.region;
    let fio = req.params.fio.split(" ");
    let surname = fio[0] || "";
    let name = fio[1] || "";
    let lastname = fio[2] || "";

    surname = surname.toLowerCase().split("");
    surname[0] = surname[0].toUpperCase();
    surname = surname.join("");

    if (name) {
      name = name.toLowerCase().split("");
      name[0] = name[0].toUpperCase();
      name = name.join("");
    }
    if (lastname) {
      lastname = surname.toLowerCase().split("");
      lastname[0] = lastname[0].toUpperCase();
      lastname = lastname.join("");
    }

    let cond = {
      role: "buyer",
      deleted: false,
      surname: {
        $regex: surname,
      },
      name: {
        $regex: name,
      },
    };

    // if (region && region !== 'undefined')
    //     cond.region = mongoose.Types.ObjectId(region)

    const usersBySearch = await User.find(cond)
      .select(["_id", "surname", "name", "lastname", "phone"])
      .limit(4)
      .lean();

    res.status(200).json(usersBySearch);
  } catch (error) {
    next(error);
  }
};

exports.getCallManagersBySearch = async (req, res, next) => {
  try {
    let region = req.params.region;
    let fio = req.params.fio.split(" ");
    let surname = fio[0] || "";
    let name = fio[1] || "";
    let lastname = fio[2] || "";

    surname = surname.toLowerCase().split("");
    surname[0] = surname[0].toUpperCase();
    surname = surname.join("");

    if (name) {
      name = name.toLowerCase().split("");
      name[0] = name[0].toUpperCase();
      name = name.join("");
    }
    if (lastname) {
      lastname = surname.toLowerCase().split("");
      lastname[0] = lastname[0].toUpperCase();
      lastname = lastname.join("");
    }

    let cond = {
      role: "call",
      deleted: false,
      surname: {
        $regex: surname,
      },
      name: {
        $regex: name,
      },
    };

    // if (region && region !== 'undefined')
    //     cond.region = mongoose.Types.ObjectId(region)

    const usersBySearch = await User.find(cond)
      .select(["_id", "surname", "name", "lastname", "phone"])
      .limit(4)
      .lean();

    res.status(200).json(usersBySearch);
  } catch (error) {
    next(error);
  }
};

exports.getUsersTreeList = async (req, res, next) => {
  try {
    const options = req.body.options;
    const myMatch = {};
    myMatch["deleted"] = false;

    if (
      options &&
      options.department !== "all" &&
      options.department !== null
    ) {
      myMatch["department.value"] = {
        $in: [options.department],
      };
    }
    if (options && options.region !== "all" && options.region !== null) {
      myMatch["region.value"] = {
        $in: [options.region],
      };
    }
    if (req.body.usersList && req.body.usersList !== null) {
      let userIds = req.body.usersList.map((item) =>
        mongoose.Types.ObjectId(item._id)
      );
      myMatch["_id"] = {
        $nin: userIds,
      };
    }
    const users = await User.aggregate([
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
      { $sort: { surname: 1 } },
      {
        $facet: {
          result: [
            {
              $match: myMatch,
            },
            {
              $sort: {
                region: 1,
              },
            },
            {
              $project: {
                _id: "$_id",
                avatar: "$avatar",
                passport_photo: "$passport_photo",
                name: "$name",
                surname: "$surname",
                lastname: "$lastname",
                passport: "$passport",
                position: "$position",
                department: "$department",
                region: {
                  _id: "$region._id",
                  value: "$region.value",
                  title: "$region.title",
                },
                role: "$role",
                graphic: "$graphic",
                phone: "$phone",
                additional_phone: "$additional_phone",
                email: "$email",
                employment_date: "$employment_date",
                date_of_birth: "$date_of_birth",
                city: "$city",
                number: "$number",
                education: "$education",
                specialty: "$specialty",
                presonal_number: "$presonal_number",
                options: {
                  userEditor: "$options.userEditor",
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
          path: "$count",
        },
      },
    ]);

    let result = {
      users: users[0] ? users[0].result : [],
      count: users[0] ? users[0].count.count : 0,
    };

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getUsersByRole = async (req, res, next) => {
  try {
    const options = req.query;
    const myMatch = {};
    myMatch["deleted"] = false;
    if (options && options.region) {
      myMatch["region.value"] = {
        $in: [options.region],
      };
    }
    if (options && options.role) {
      myMatch["role"] = options.role;
    }

    const users = await User.aggregate([
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
        $facet: {
          result: [
            {
              $match: myMatch,
            },
            {
              $sort: {
                surname: 1,
              },
            },
            {
              $project: {
                _id: "$_id",
                avatar: "$avatar",
                passport_photo: "$passport_photo",
                name: "$name",
                surname: "$surname",
                lastname: "$lastname",
                passport: "$passport",
                inn: "$inn",
                position: "$position",
                department: "$department",
                region: {
                  _id: "$region._id",
                  value: "$region.value",
                  title: "$region.title",
                },
                role: "$role",
                rating: "$rating",
                tasks: "$tasks",
                salary: "$salary",
                award: "$award",
                graphic: "$graphic",
                login: "$login",
                phone: "$phone",
                additional_phone: "$additional_phone",
                email: "$email",
                employment_date: "$employment_date",
                date_of_birth: "$date_of_birth",
                city: "$city",
                street: "$street",
                house: "$house",
                appartment: "$appartment",
                number: "$number",
                education: "$education",
                zodiac_sign: "$zodiac_sign",
                element: "$element",
                chinese_year: "$chinese_year",
                specialty: "$specialty",
                presonal_number: "$presonal_number",
                options: {
                  userEditor: "$options.userEditor",
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
          path: "$count",
        },
      },
    ]);
    let result = {
      users: users[0] ? users[0].result : [],
      count: users[0] ? users[0].count.count : 0,
    };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    let user = await User.findById(req.userId);

    if (!user) {
      return res.sendStatus(404);
    }

    let token = generateToken({
      _id: user._id,
      login: user.login,
      name: user.name,
      surname: user.surname,
      lastname: user.lastname,
      role,
      department: user.department.value,
      options: user.options,
      number: user.number ? user.number : null,
      inner_number: user.inner_number ? user.inner_number : null,
    });

    let refresh = generateRefreshToken({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      lastname: user.lastname,
      options: user.options,
      role,
      number: user.number ? user.number : null,
      inner_number: user.inner_number ? user.inner_number : null,
    });

    await user.updateOne({
      token: token,
      refresh: refresh,
    });

    return res.status(200).json({
      token,
      refresh,
    });
  } catch (err) {
    next(err);
  }
};
