const express = require('express');
const mongoose = require('mongoose');
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
app.get('/timkiem', (req, res) => {
    // 1. Lấy từ khóa từ URL (ví dụ: ?keyword=áo)
    const keyword = req.query.keyword || "";

    // 2. Lọc dữ liệu
    const results = products.filter(item => 
        item.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // 3. Trả về giao diện kèm dữ liệu đã lọc
    res.render('result-search', { 
        title: 'Kết quả tìm kiếm',
        keyword: keyword,
        products: results 
    });
});

app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
});