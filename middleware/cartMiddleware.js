const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

exports.cartCounter = async (req, res, next) => {
    // Truyền user xuống View
    res.locals.user = req.session.user; 
    res.locals.cartCount = 0;

    // Nếu user đã đăng nhập -> Đếm số lượng trong bảng 'carts'
    if (req.session.user) {
        try {
            const db = getDb();
            // Đảm bảo user._id có tồn tại
            if(req.session.user._id) {
                const count = await db.collection('carts').countDocuments({ 
                    userId: new ObjectId(req.session.user._id) 
                });
                res.locals.cartCount = count;
            }
        } catch (e) {
            console.error("⚠️ Lỗi đếm giỏ hàng middleware:", e);
        }
    }
    next();
};