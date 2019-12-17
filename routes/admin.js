const express = require('express');
const productsController = require('../controllers/products');


const router = express.Router();


router.post('/add-product',productsController.postAddProducts);

router.get('/add-product', productsController.getAddProducts);

module.exports = router;