const express = require('express');
const adminController = require('../controllers/admin');


const router = express.Router();


router.post('/add-product',adminController.postAddProducts);

router.get('/add-product', adminController.getAddProducts);

router.get('/products', adminController.getProducts);

module.exports = router;