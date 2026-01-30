const express = require('express');
const router = express.Router();

// Import các Controller
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController');

// --- ĐỊNH NGHĨA ROUTE ---

// Sản phẩm & Tìm kiếm
router.get('/sanpham/:id', productController.getProductDetail);
router.get('/timkiem', productController.getSearch);

// Đơn hàng (Mua ngay & Xem đơn)
router.post('/muangay', orderController.postBuyNow);
router.get('/donhang/:id', orderController.getOrderDetail);

// Giỏ hàng
router.post('/themgiohang', cartController.postAddToCart);

module.exports = router;