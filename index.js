const express = require('express');
const path = require('path');
const session = require('express-session');

// 1. IMPORT CÁC THƯ VIỆN
const { ObjectId } = require('mongodb'); 
const { mongoConnect, getDb } = require('./config/db'); 
const routes = require('./Routes/index');

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

// =========================================================
// 4. MIDDLEWARE (Chạy mỗi khi tải trang để đếm giỏ hàng)
// =========================================================
app.use(async (req, res, next) => {
    // Truyền user xuống View
    res.locals.user = req.session.user; 
    
    // Mặc định số lượng = 0
    res.locals.cartCount = 0;

    // Nếu user đã đăng nhập -> Đếm số lượng trong bảng 'carts'
    if (req.session.user) {
        try {
            const db = getDb();
            // Đếm xem user này có bao nhiêu dòng trong collection carts
            const count = await db.collection('carts').countDocuments({ 
                userId: new ObjectId(req.session.user._id) 
            });
            res.locals.cartCount = count; // Biến này sẽ hiển thị lên Icon Header
        } catch (e) {
            console.error("⚠️ Lỗi đếm giỏ hàng:", e);
        }
    }
    
    next();
});

// =========================================================
// 5. CÁC API XỬ LÝ (MUA HÀNG & GIỎ HÀNG)
// =========================================================

// --- API: MUA NGAY ---
app.post('/muangay', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Bạn cần đăng nhập để mua hàng!',
                requireLogin: true 
            });
        }

        const { productId } = req.body;
        const db = getDb();

        const newOrder = {
            status: "Chờ xác nhận",
            createdAt: new Date(),
            customerName: req.session.user.username || "Khách hàng",
            userId: new ObjectId(req.session.user._id),
            products: [
                {
                    productId: productId, 
                    quantity: 1 
                }
            ]
        };

        const result = await db.collection('orders').insertOne(newOrder);

        res.json({ success: true, orderId: result.insertedId });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server: ' + error.message });
    }
});

app.post('/themgiohang', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập!', requireLogin: true });
        }

        const { productId } = req.body;
        // Ép kiểu ID sang ObjectId để đảm bảo MongoDB hiểu
        const userId = new ObjectId(req.session.user._id);
        const pId = new ObjectId(productId);
        
        const db = getDb();
        const dbCarts = db.collection('carts');

        console.log(`➡️ Đang thêm SP ${pId} cho User ${userId}`);

        // 1. Kiểm tra tồn tại
        const existingItem = await dbCarts.findOne({ userId: userId, productId: pId });

        if (existingItem) {
            await dbCarts.updateOne({ _id: existingItem._id }, { $inc: { quantity: 1 } });
            console.log("   -> Đã cập nhật số lượng (+1)");
        } else {
            await dbCarts.insertOne({
                userId: userId,
                productId: pId,
                quantity: 1,
                createdAt: new Date()
            });
            console.log("   -> Đã tạo dòng mới");
        }

        // 2. ĐẾM LẠI (Quan trọng)
        const totalItemsCount = await dbCarts.countDocuments({ userId: userId });
        console.log("✅ Tổng số lượng trong giỏ hiện tại:", totalItemsCount);

        // 3. Trả về
        res.json({ 
            success: true, 
            message: 'Đã thêm vào giỏ!',
            totalItems: totalItemsCount 
        });

    } catch (error) {
        console.error("❌ Lỗi Server Thêm Giỏ:", error);
        res.status(500).json({ message: 'Lỗi Server' });
    }
});
// =========================================================
// 6. CÁC ROUTE HIỂN THỊ GIAO DIỆN (VIEW)
// =========================================================

// --- Trang: CHI TIẾT ĐƠN HÀNG (Hóa đơn) ---
app.get('/donhang/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const db = getDb();

        if (!ObjectId.isValid(orderId)) return res.status(400).send("ID đơn hàng lỗi");

        const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });

        if (!order) return res.status(404).send("Không tìm thấy đơn hàng");

        // Join lấy thông tin sản phẩm
        const productIds = order.products.map(p => new ObjectId(p.productId));
        const productsInfo = await db.collection('item_product').find({ _id: { $in: productIds } }).toArray();

        const mergedProducts = order.products.map(orderItem => {
            const details = productsInfo.find(p => p._id.toString() === orderItem.productId.toString());
            return {
                ...orderItem,
                name: details ? details.name : 'Sản phẩm lỗi',
                price: details ? details.price : 0,
                image: details ? details.image : ''
            };
        });

        order.productsList = mergedProducts;
        let finalTotal = mergedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // SỬA TÊN FILE VIEW: order-detail.pug
        res.render('order-detail', { 
            order: order,
            calculatedTotal: finalTotal
        });

    } catch (error) {
        console.error("Lỗi xem đơn:", error);
        res.status(500).send("Lỗi Server");
    }
});

// --- Trang: CHI TIẾT SẢN PHẨM (Để mua) ---
app.get('/sanpham/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const db = getDb();

        if (!ObjectId.isValid(productId)) return res.status(400).send("ID sản phẩm lỗi");

        const product = await db.collection('item_product').findOne({ _id: new ObjectId(productId) });

        if (!product) return res.status(404).send("Sản phẩm không tồn tại");

        // SỬA TÊN FILE VIEW: product-detail.pug
        // (Đây là file chứa script addToCart và buyNow mà bạn đã tạo)
        res.render('detail', { 
            product: product 
        });

    } catch (error) {
        console.error("Lỗi xem SP:", error);
        res.status(500).send("Lỗi Server");
    }
});

// Các Route khác (Trang chủ, Auth...)
app.use('/', routes);

// =========================================================
// 7. KHỞI ĐỘNG SERVER
// =========================================================
mongoConnect(() => {
    app.listen(port, () => {
        console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
    });
});