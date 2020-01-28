const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');


const router = express.Router();


router.post('/add-product', isAuth, adminController.postAddProducts);

router.get('/add-product', isAuth, adminController.getAddProducts);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProducts);

router.post('/edit-product', isAuth, adminController.postEditProducts);

router.get('/delete-product/:productId', isAuth, adminController.getDeleteProducts);

module.exports = router;