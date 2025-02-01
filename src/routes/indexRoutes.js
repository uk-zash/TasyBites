// src/routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const menuController = require('../controllers/menuController');
const cartController = require('../controllers/cartController')
const productController = require('../controllers/productController')
const searchController = require('../controllers/searchController');
const filterController = require('../controllers/filterController');

// Home page route
router.get('/', mainController.getHomePage);
router.get('/menu' , menuController.getMenuPage)
router.post('/add-to-cart' , cartController.addToCart)
router.get('/get-cart', cartController.getCart);
router.get('/cart' , cartController.getCartPage)
router.post('/cart/update' , cartController.updateCart)
router.post('/checkout' , cartController.checkout)

router.get('/product/:id', productController.getProductPage);
router.post('/product/:id/review', productController.submitReview);

router.get('/search', searchController.searchItems);
router.get('/filter', filterController.filterByCategory);

module.exports = router;