const express = require("express");
const router = express.Router();
const staticSitesController = require("../controllers/staticSite");
const isAuth = require("../middleware/isAuth");
const uploadDocument = require("../middleware/multer");
router.post("/get/", isAuth, staticSitesController.getSites);
router.post("/update/", isAuth, staticSitesController.updateSite);
router.post(
  "/importexcel/",
  uploadDocument.fields([{ name: "document" }]),
  staticSitesController.importPriceExcel
);
router.post("/exportexcel/", isAuth, staticSitesController.exportPriceExcel);
router.post("/create/", isAuth, staticSitesController.createSite);
router.post("/addmanager/", isAuth, staticSitesController.addManager);
// router.post('/updatecontent/', isAuth, staticSitesController.updateStaticSitesContent)
module.exports = router;
