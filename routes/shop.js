const express = require('express');
const shopController = require('../controllers/shop')

const router = express.Router();

router.get('/',shopController.getIndex);
router.get('/cart',shopController.getCart);
router.get('/Orders',shopController.getOrders);
router.get('/checkout',shopController.getCheckout);
router.get('/products',shopController.getListProducts);
router.get('/products/:productId',shopController.getProduct);

module.exports = router;