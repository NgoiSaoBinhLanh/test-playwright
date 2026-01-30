const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

exports.postAddToCart = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập!', requireLogin: true });
        }

        const { productId } = req.body;
        const userId = new ObjectId(req.session.user._id);
        const pId = new ObjectId(productId);
        
        const db = getDb();
        const dbCarts = db.collection('carts');

        // Kiểm tra tồn tại
        const existingItem = await dbCarts.findOne({ userId: userId, productId: pId });

        if (existingItem) {
            await dbCarts.updateOne({ _id: existingItem._id }, { $inc: { quantity: 1 } });
        } else {
            await dbCarts.insertOne({
                userId: userId,
                productId: pId,
                quantity: 1,
                createdAt: new Date()
            });
        }

        // Đếm lại tổng số
        const totalItemsCount = await dbCarts.countDocuments({ userId: userId });

        res.json({ 
            success: true, 
            message: 'Đã thêm vào giỏ!',
            totalItems: totalItemsCount 
        });

    } catch (error) {
        console.error("❌ Lỗi Thêm Giỏ:", error);
        res.status(500).json({ message: 'Lỗi Server' });
    }
};