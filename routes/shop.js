const express = require('express');
const shopController = require('../controllers/shop')
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get('/',shopController.getIndex);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem);
router.get('/Orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postCreateOrder);
router.get('/products', shopController.getListProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/order/:orderId', isAuth, shopController.getInvoice);


module.exports = router;