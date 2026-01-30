const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

// API: Mua Ngay
exports.postBuyNow = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập!', requireLogin: true });
        }

        const { productId } = req.body;
        const db = getDb();

        const newOrder = {
            status: "Chờ xác nhận",
            createdAt: new Date(),
            customerName: req.session.user.username || "Khách hàng",
            userId: new ObjectId(req.session.user._id),
            products: [{ productId: productId, quantity: 1 }]
        };

        const result = await db.collection('orders').insertOne(newOrder);
        res.json({ success: true, orderId: result.insertedId });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server: ' + error.message });
    }
};

// Xem chi tiết đơn hàng
exports.getOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!ObjectId.isValid(orderId)) return res.status(400).send("ID đơn hàng lỗi");

        const db = getDb();
        const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });

        if (!order) return res.status(404).send("Không tìm thấy đơn hàng");

        // Join sản phẩm
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

        res.render('order-detail', { 
            order: order,
            calculatedTotal: finalTotal
        });
    } catch (error) {
        console.error("Lỗi xem đơn:", error);
        res.status(500).send("Lỗi Server");
    }
};