const express = require('express');
const router = express.Router();

// 1. Import Controller (Đảm bảo đường dẫn đúng)
const authController = require('../controllers/authController');
const productController = require('../controllers/productController'); 
// (Nếu chưa có productController thì tạm thời comment dòng trên và các route liên quan lại)

// --- ROUTES CHO AUTH (Khớp với code bạn gửi) ---

// GET: Trang đăng nhập
// authController.getLoginPage -> Phải trùng tên với exports.getLoginPage bên controller
router.get('/dangnhap', authController.getLoginPage);

// POST: Xử lý đăng nhập
router.post('/login', authController.login);

// GET: Trang đăng ký
router.get('/dangky', authController.getSignupPage);

// POST: Xử lý đăng ký
router.post('/dangky', authController.signup);
router.get('/logout', authController.logout);


// --- ROUTES CHO PRODUCT (Ví dụ mẫu) ---
// Đảm bảo bên productController.js cũng export đúng tên hàm getHomePage, searchProduct
if (productController) {
    router.get('/', productController.getHomePage);
    router.get('/timkiem', productController.searchProduct);
}

module.exports = router;