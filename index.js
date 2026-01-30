const express = require('express');
const path = require('path');
const session = require('express-session');

// 1. IMPORT CẤU HÌNH & DB
const { mongoConnect } = require('./config/db'); 
const cartMiddleware = require('./middleware/cartMiddleware'); // Import Middleware

// Import các file Route
const mainRoutes = require('./Routes/index'); // Route cũ của bạn (Trang chủ, Auth...)
const shopRoutes = require('./Routes/shop');  // Route mới vừa tạo (Sản phẩm, Đơn hàng...)

const app = express();
const port = 3000;

// 2. CẤU HÌNH APP
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 3. CẤU HÌNH SESSION
app.use(session({
    secret: 'mySecretKey123', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // false: chạy localhost
}));

// 4. SỬ DỤNG MIDDLEWARE (Đếm giỏ hàng cho TOÀN BỘ route)
app.use(cartMiddleware.cartCounter);

// 5. ĐĂNG KÝ ROUTE
app.use(shopRoutes); // Các route mua hàng, tìm kiếm, sản phẩm...
app.use('/', mainRoutes); // Các route trang chủ, login (giữ nguyên của bạn)

// 6. KHỞI ĐỘNG SERVER
mongoConnect(() => {
    app.listen(port, () => {
        console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
    });
});