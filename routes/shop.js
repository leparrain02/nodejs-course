const express = require('express');
const shopController = require('../controllers/shop')

const router = express.Router();

router.get('/',shopController.getIndex);
router.get('/cart',shopController.getCart);
router.post('/cart',shopController.postCart);
router.post('/cart-delete-item',shopController.postCartDeleteItem);
router.get('/Orders',shopController.getOrders);
router.post('/create-order',shopController.postCreateOrder);
router.get('/products',shopController.getListProducts);
router.get('/products/:productId',shopController.getProduct);


module.exports = router;