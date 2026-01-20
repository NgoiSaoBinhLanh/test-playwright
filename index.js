const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

// --- CẤU HÌNH ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// --- 1. KẾT NỐI DATABASE ---
// Tên database của bạn là 'demo' (theo hình ảnh Compass)
mongoose.connect('mongodb://localhost:27017/demo')
    .then(() => console.log('✅ Đã kết nối MongoDB'))
    .catch(err => console.log('❌ Lỗi kết nối:', err));
// 2. Kết nối MongoDB
let db; // Khai báo biến toàn cục để dùng ở mọi nơi
const url = 'mongodb://127.0.0.1:27017'; // Hoặc url của bạn
const client = new MongoClient(url);
async function connectDB() {
    try {
        await client.connect();
        console.log("Đã kết nối MongoDB thành công!");
        db = client.db('demo'); // Gán kết nối vào biến db
    } catch (err) {
        console.error("Lỗi kết nối DB:", err);
    }
}
connectDB();
// --- 2. KHAI BÁO SCHEMA (QUAN TRỌNG NHẤT) ---
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
}, { 
    // 👇 DÒNG NÀY ĐỂ TRỎ ĐÚNG VÀO COLLECTION 'infouser' CỦA BẠN 👇
    collection: 'infouser' 
});

const User = mongoose.model('User', UserSchema);

// --- ROUTES ---
app.get('/', (req, res) => res.render('index'));

//app.get('/timkiem', (req, res) => res.render('result-search'));
app.get('/dangnhap',(req,res) =>{
  res.render('login')
})
// --- API ĐĂNG NHẬP ---
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Đang kiểm tra: ${username} - ${password}`);

    try {
        // Tìm user trong collection 'infouser'
        const user = await User.findOne({ username, password });

        if (user) {
            console.log("--> OK: Tìm thấy user!");
            res.json({ status: 'success', message: 'Đăng nhập thành công!' });
        } else {
            console.log("--> Lỗi: Không tìm thấy user này.");
            res.status(400).json({ status: 'fail', message: 'Sai tên đăng nhập hoặc mật khẩu' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
});
// chức năng tìm kiếm
const products = [
    { name: "Áo thun nam", price: "150.000đ", image: "https://placehold.co/200x200?text=Ao" },
    { name: "Áo khoác gió", price: "300.000đ", image: "https://placehold.co/200x200?text=Khoac" },
    { name: "Quần Jean", price: "450.000đ", image: "https://placehold.co/200x200?text=Jean" },
    { name: "Điện thoại iPhone", price: "20.000.000đ", image: "https://placehold.co/200x200?text=iPhone" },
    { name: "Máy tính Dell", price: "15.000.000đ", image: "https://placehold.co/200x200?text=Dell" }
];

// ROUTE TRANG TÌM KIẾM
// Route Tìm kiếm sản phẩm
app.get('/timkiem', async (req, res) => {
    try {
        // 1. Lấy từ khóa từ URL (ví dụ: ?keyword=iphone)
        const keyword = req.query.keyword || '';

        let products = [];

        if (keyword.length > 0) {
            // 2. Kết nối bảng 'item_product'
            // Đảm bảo biến 'db' đã được kết nối global như các bước trước
            const collection = db.collection('item_product');

            // 3. Tìm kiếm bằng Regex (Tìm gần đúng, không phân biệt hoa thường)
            // $regex: keyword -> Tìm các tên có chứa từ khóa
            // $options: 'i' -> Case-insensitive (Chữ hoa thường như nhau)
            products = await collection.find({
                name: { $regex: keyword, $options: 'i' } 
            }).toArray();
        }

        // 4. Trả về giao diện kèm kết quả
        res.render('result-search', { 
            products: products,
            keyword: keyword 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi Server khi tìm kiếm");
    }
});

app.get('/dangky', (req, res) => {
    res.render('signup'); // Hoặc 'register' tùy tên file pug bạn đặt
});

app.post('/dangky', async (req, res) => {
    try {
        // Kiểm tra xem DB đã kết nối chưa
        if (!db) {
            return res.status(500).json({ message: 'Chưa kết nối được Database' });
        }

        const { username, email, password } = req.body;

        // 1. Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
        }

        const collection = db.collection('infouser');

        // 2. Kiểm tra tồn tại
        const existingUser = await collection.findOne({ 
            $or: [{ email: email }, { username: username }] 
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc Email đã tồn tại!' });
        }

        // 3. Lưu vào DB
        await collection.insertOne({
            username: username.trim(),
            email: email.trim(),
            password: password, 
            createdAt: new Date()
        });

        res.json({ success: true, message: 'Đăng ký thành công!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});
app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
});