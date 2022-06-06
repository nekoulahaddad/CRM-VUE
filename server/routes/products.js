const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");

const ProductsController = require("../controllers/products");
const isAuth = require("../middleware/isAuth");
const clearCache = require("../middleware/clearCacheProducts");

router.post(
  "/getproductbyarticle",
  isAuth,
  ProductsController.getProductsByArticle
);
router.post(
  "/getproductbysearch",
  isAuth,
  ProductsController.getProductsBySearch
);
router.post("/provider/update", isAuth, ProductsController.editProductProvider);
router.post(
  "/post",
  isAuth,
  upload.fields([{ name: "images" }, { name: "certificates" }]),
  ProductsController.addProduct,
  clearCache
);
router.post("/delete", isAuth, ProductsController.deleteProduct, clearCache);
router.post(
  "/update",
  isAuth,
  upload.fields([{ name: "images" }, { name: "certificates" }]),
  ProductsController.editProduct,
  clearCache
);
router.post(
  "/transfer",
  isAuth,
  ProductsController.transferProduct,
  clearCache
);
router.post(
  "/updatevisibility",
  isAuth,
  ProductsController.editProductVisibility,
  clearCache
);
router.post(
	"/updateRecommended",
	isAuth,
	ProductsController.editProductRecommended,
	clearCache
)
router.post(
	"/updateBuyed",
	isAuth,
	ProductsController.editProductBuyed,
	clearCache
)

module.exports = router;
