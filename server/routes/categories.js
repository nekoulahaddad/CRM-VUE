const express = require('express')
const router = express.Router()

const upload = require('../middleware/multer')

const CategoriesController = require('../controllers/categories')
const isAuth = require('../middleware/isAuth')
const clearCache = require('../middleware/clearCacheCategories')

router.post('/get', isAuth, CategoriesController.getCategories)
router.post('/getbyid', isAuth, CategoriesController.getCategoryById)
router.post('/getviews', isAuth, CategoriesController.getCategoriesViews)
router.post('/getcategoriesbysearch', isAuth, CategoriesController.getCategoriesBySearch)
router.post('/getcategoriesandbrandsbysearch', isAuth, CategoriesController.getCategoriesAndBrandsBySearch)
router.post('/getfromsearch', isAuth, CategoriesController.getDataFromSearchQuery)
router.post('/post', isAuth, upload.fields([{ name: 'categoryImage' }, { name: 'categoryIcon' }, { name: 'categorySlide' }, { name: 'categoryBanner' }, { name: 'categoryBannerMob' }]), CategoriesController.addCategory, clearCache)
router.post('/delete', isAuth, CategoriesController.deleteCategory, clearCache)
router.post('/update', isAuth, upload.fields([{ name: 'categoryImage' }, { name: 'categoryIcon' }, { name: 'categorySlide' }, { name: 'categoryBanner' }, { name: 'categoryBannerMob' }]), CategoriesController.editCategory, clearCache)
router.post('/setmanager', isAuth, CategoriesController.setManagerCategory)
router.post('/changeorder', isAuth, CategoriesController.editCategoryOrder, clearCache)
router.post('/copy', isAuth, CategoriesController.copyCategory)
router.post('/updatevisibility', isAuth, CategoriesController.editCategoryVisibility, clearCache)
module.exports = router