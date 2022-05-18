const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
// const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "temp");
  },
  filename: (req, file, cb) =>
    cb(null, uuidv4() + "." + file.originalname.split(".").pop()),
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const docFilter = (req, file, cb) => {
  if (
    file.mimetype !== "application/vnd.microsoft.portable-executable" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.ms-excel.sheet.macroenabled.12" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype === "text/plain" ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/vnd.ms-excel.sheet.binary.macroenabled.12" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
const uploadDocument = multer({
  storage: storage,
  filter: docFilter,
  limits: { fileSize: 10000000 },
});
module.exports = upload;
module.exports = uploadDocument;
