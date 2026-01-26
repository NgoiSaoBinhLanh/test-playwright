const User = require('../models/User');

// GET: Trang đăng nhập
exports.getLoginPage = (req, res) => {
    res.render('login');
};

// POST: Xử lý đăng nhập
// SỬA HÀM LOGIN:
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username, password });

        if (user) {
            // --- TẠO PHIÊN ĐĂNG NHẬP TẠI ĐÂY ---
            // Lưu thông tin user vào session
            req.session.user = {
                id: user._id,
                username: user.username,
                email: user.email
            };

            // Lưu session xong mới phản hồi
            req.session.save(() => {
                return res.json({ status: 'success', message: 'Đăng nhập thành công!' });
            });
        } else {
            return res.status(400).json({ status: 'fail', message: 'Sai thông tin đăng nhập' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

// THÊM HÀM LOGOUT:
exports.logout = (req, res) => {
    // Xóa session
    req.session.destroy((err) => {
        if (err) console.log(err);
        // Quay về trang chủ
        res.redirect('/');
    });
};

// GET: Trang đăng ký
exports.getSignupPage = (req, res) => {
    res.render('signup');
};

// POST: Xử lý đăng ký
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation cơ bản
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
        }

        // Kiểm tra tồn tại
        const existingUser = await User.findOne({ 
            $or: [{ email: email }, { username: username }] 
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User hoặc Email đã tồn tại!' });
        }

        // Tạo user mới bằng Mongoose (gọn hơn insertOne thủ công)
        await User.create({
            username: username.trim(),
            email: email.trim(),
            password: password
        });

        res.json({ success: true, message: 'Đăng ký thành công!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};