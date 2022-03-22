// .Env variables
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const port = process.env.PORT;
const logger = require("./middleware/logger");
const server = require("http").createServer(app);
const cors = require("cors");
const jwt = require("jsonwebtoken");
const isAuth = require("./middleware/isAuth");
const rateLimit = require("express-rate-limit");
const VPBX = require("mango-vpbx");
const vpbx = new VPBX(process.env.MANGO_TOKEN, process.env.MANGO_KEY);
const events = vpbx.events(process.env.HOST);
const helmet = require("helmet");
const Orders = require("./models/orders");
const Callbacks = require("./models/callbacks");
const Calls = require("./models/calls");
const User = require("./models/user");
const Clients = require("./models/clients");

const allowedOrigins = [
  "http://localhost:8080",
  "https://test.xn--j1ano.com",
  "https://v2.xn--j1ano.com",
  "https://test.tdcsk.com",
  "https://xn--j1ano.com",
  "http://xn--j1ano.com",
  "https://tdcsk.com/api",
  // Corp sites
  "https://csptamak.ru",
  "https://fanera.site",
  "https://belplit24.ru",
  "https://plitaosb-3.ru",
  "https://shinglas-rus.ru",
  "https://plitaosb-3.kz",
  "https://beltermo-russia.ru",
  "https://xn--90aiaxgmmo.com",
  // Mango
  "81.88.80.132",
  "81.88.80.133",
  "81.88.82.36",
  "81.88.82.44",
  "81.88.82.45",
  "81.88.85.67",
  // BOT
  "5.35.94.185",
];

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 100 requests per windowMs
  message: "Попробуйте позже!",
});

let corsOptionsDeligate = {
  origin: allowedOrigins,
  methods: ["GET", "PUT", "POST", "DELETE"],
  optionsSucccessStatus: 200,
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
    "Connection",
    "Sec-WebSocket-Accept",
    "X_BOT",
  ],
  exposedHeaders: ["Content-Disposition"],
};

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://tdcsk.com/"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Origin", "https://v2.xn--j1ano.com"); // update to match the domain you will make the request from
//     res.header("Origin", "https://xn--j1ano.com/"); // update to match the domain you will make the request from
//     res.header("Origin", "https://v2.xn--j1ano.com"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors(corsOptionsDeligate));
app.use(logger.requestLog);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(express.json());
app.use(limiter);
app.disable("view cache");
app.set("etag", false);
// app.use(helmet());
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});
// app.disable('x-powered-by');

const io = require("socket.io")(server, {
  path: "/socket.io",
  cors: {
    ...corsOptionsDeligate,
  },
});

let users = [];
global.io = io;
global.users = users;

const routerUser = require("./routes/user");
const routerTasks = require("./routes/tasks");
const routerRegions = require("./routes/regions");
const routerStatus = require("./routes/status");
const routerClients = require("./routes/clients");
const routerOrders = require("./routes/orders");
const routerReports = require("./routes/reports");
const routerEvents = require("./routes/events");
const routerCategories = require("./routes/categories");
const routerProducts = require("./routes/products");
const routerBrands = require("./routes/brands");
const routerDepartments = require("./routes/departments");
const routerDocuments = require("./routes/documents");
const routerSeo = require("./routes/seo");
const routerMango = require("./routes/mango");
const routerProviders = require("./routes/providers");
const routerCallbaks = require("./routes/callbacks");
const routerCalls = require("./routes/calls");
const routerStats = require("./routes/stats");
const routerEducation = require("./routes/education");
const routerExcel = require("./routes/excel");
const routerGroups = require("./routes/groups");
const routerCorporates = require("./routes/corporates");
const routerCallCenterIssues = require("./routes/callCenterIssues");
const routerPurchase = require("./routes/purchase");
const routerOrgTree = require("./routes/orgTree");
const routerVacancies = require("./routes/vacancies");
const routerGoogleSheets = require("./routes/googlesheets");
const routerStaticSites = require("./routes/staticSites");
const routerSendMail = require("./routes/sendMail");

app.use("/", express.static(path.join(__dirname, "build")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/avatars", express.static(path.join(__dirname + "/static/avatars")));
app.use(
  "/passports",
  isAuth,
  express.static(path.join(__dirname + "/static/passports"))
);

app.get("/uploads/*", function (req, res, next) {
  if (req.userId) {
    next();
  } else {
    res.redirect("/");
  }
});

app.use(methodOverride());

app.use(events.call);
app.use(events.summary);
app.use(events.recording);
app.use(events.dtmf);
app.use(events.sms);
app.use(events.ping);

app.use("/user", routerUser);
app.use("/tasks", routerTasks);
app.use("/regions", routerRegions);
app.use("/status", routerStatus);
app.use("/clients", routerClients);
app.use("/orders", routerOrders);
app.use("/reports", routerReports);
app.use("/events", routerEvents);
app.use("/categories", routerCategories);
app.use("/products", routerProducts);
app.use("/brands", routerBrands);
app.use("/departments", routerDepartments);
app.use("/documents", routerDocuments);
app.use("/seo", routerSeo);
app.use("/mango", routerMango);
app.use("/providers", routerProviders);
app.use("/callbacks", routerCallbaks);
app.use("/calls", routerCalls);
app.use("/stats", routerStats);
app.use("/educations", routerEducation);
app.use("/excel", routerExcel);
app.use("/groups", routerGroups);
app.use("/corporates", routerCorporates);
app.use("/callcenterissues", routerCallCenterIssues);
app.use("/purchase", routerPurchase);
app.use("/orgtree", routerOrgTree);
app.use("/vacancies", routerVacancies);
app.use("/googlesheets", routerGoogleSheets);
app.use("/sites", routerStaticSites);
app.use("/sendmail", routerSendMail);

events.on("call", async (e) => {
  try {
    if (e.call_state === "Connected") {
      let number = "";
      let s = e.to.number.split("");
      console.log(s);
      if (s.length === 12) {
        // +### ### ## ## ##
        number = `+${s[0]}${s[1]}${s[2]} ${s[3]}${s[4]}${s[5]} ${s[6]}${s[7]} ${s[8]}${s[9]} ${s[10]}${s[11]}`;
      } else if (s.length === 11) {
        // +# ### ### ## ##
        number = `+${s[0]} ${s[1]}${s[2]}${s[3]} ${s[4]}${s[5]}${s[6]} ${s[7]}${s[8]} ${s[9]}${s[10]}`;
      }
      let client = await Clients.findOne({ phone: number }).lean();
      let call = await Calls.create(e);
      let user = await User.findOne({ inner_number: e.from.extension }).select(
        "_id"
      );
      if (user && user._id) {
        call.user = user._id;
      } else {
        call.user = e.from.number;
      }
      if (client && client._id) {
        call.client = client._id;
      }
      call.save();
      const json = {
        call_id: e.call_id,
        call_party_number: e.from.extension,
      };
      const { success } = await vpbx.recordingStart(json);
      console.log(success);
      console.log(e.call_id);
    }
  } catch (error) {
    console.log(error);
  }
});

events.on("summary", (e) => console.log("on events/summary", e));
events.on("recording", async (e) => {
  const json = {
    recording_id: e.recording_id,
    expires: "MAX",
  };

  const { success, recording } = await vpbx.recording(json);
  if (success) {
    let call = await Calls.findOneAndUpdate(
      { call_id: e.call_id },
      {
        recording_id: e.recording_id,
        recording_state: e.recording_state,
        recording_url: recording,
      }
    );
  }
});

// StartApp
const startApp = async () => {
  try {
    console.log("NODE_ENV: " + process.env.NODE_ENV);

    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      poolSize: 8,
    });

    console.log("MongoDB started at: " + process.env.MONGODB_URI);

    users = [];

    io.use(function (socket, next) {
      if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(
          socket.handshake.query.token,
          process.env.SECRET_KEY,
          function (err, decoded) {
            if (err) return next(new Error("Authentication error"));
            socket.decoded = decoded;
            next();
          }
        );
      } else {
        next(new Error("Authentication error"));
      }
    }).on("connection", function (socket) {
      socket.on("joinRoomOrders", (data) => {
        console.log(data);
        let exist = false;
        global.users.forEach((user) => {
          if (user.userId === data.userId) {
            exist = true;
            return;
          }
        });
        if (!exist) {
          console.log(`${data.userId} joined orders room`);
          global.users.push(data);
          socket.join(data.userId);
        }
      });
      socket.on("joinRoomCallbacks", (data) => {
        console.log(data);
        let exist = false;
        global.users.forEach((user) => {
          if (user.userId === data.userId) {
            exist = true;
            return;
          }
        });
        if (!exist) {
          console.log(`${data.userId} joined callbacks room`);
          global.users.push(data);
          socket.join(data.userId);
        }
      });
      socket.on("leftRoomOrders", (data) => {
        console.log(`${data.userId} left orders room`);
        let index = global.users.findIndex((el) => el.userId === data.userId);
        if (index > -1) {
          global.users.splice(index, 1);
        }
        socket.leave(data.userId);
      });
      socket.on("leftRoomCallbacks", (data) => {
        console.log(`${data.userId} left callbacks room`);
        let index = global.users.findIndex((el) => el.userId === data.userId);
        if (index > -1) {
          global.users.splice(index, 1);
        }
        socket.leave(data.userId);
      });
    });

    server.listen(port);

    console.log("Successfully started at port:" + port);
  } catch (error) {
    console.log("[Error]", error);
    process.exit(404);
  }
};

// init
startApp();

const Status = require("./models/status");
const Tasks = require("./models/tasks");

Status.find().then((e) => {
  console.log(e);
});

const Excel = require("exceljs");

const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet("my sheet");

Tasks.find({
  status: {
    $in: [
      mongoose.Types.ObjectId("601bad4735e4052ee544d788"),
      mongoose.Types.ObjectId("601bad9e35e4052ee544d78b"),
      mongoose.Types.ObjectId("601bad6935e4052ee544d789"),
    ],
  },
})
  .populate("status")
  .populate("initiator")
  .populate("executors")
  .then((e) => {
    worksheet.columns = [
      { header: "id", key: "id" },
      { header: "initiator", key: "initiator" },
      { header: "executors", key: "executors" },
      { header: "title", key: "title" },
      { header: "creation_date", key: "creation_date" },
      { header: "deadline_date", key: "deadline_date" },
      { header: "status", key: "status" },
    ];

    for (let p of e) {
      let data = {
        executors: `${p.executors[0].lastname} ${p.executors[0].name}`,
        initiator: `${p.initiator.lastname} ${p.initiator.name}`,
        title: p.title,
        creation_date: p.creation_date,
        deadline_date: p.deadline_date,
        status: p.status.title,
      };
      worksheet.addRow(data).commit();
    }

    const options = {
      filename: path.join(".", `/12.xls`),
      filePath: path.join(".", `/12.xls`),
      name: "tasks.xls",
      useStyles: true,
      useSharedStrings: true,
      formatterOptions: {
        delimiter: ";",
        quote: false,
      },
    };

    workbook.csv.writeFile(options.filename, options).then(() => {});
  });
