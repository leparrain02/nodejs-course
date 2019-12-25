const express = require('express');
const adminController = require('../controllers/admin');


const router = express.Router();


router.post('/add-product',adminController.postAddProducts);

router.get('/add-product', adminController.getAddProducts);

router.get('/products', adminController.getProducts);

router.get('/edit-product/:productId',adminController.getEditProducts);

router.post('/edit-product',adminController.postEditProducts);

router.get('/delete-product/:productId',adminController.getDeleteProducts);

module.exports = router;