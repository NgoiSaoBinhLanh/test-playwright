const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

exports.getHomePage = (req,res) =>{
    res.render('index')
}
// Xem chi tiết sản phẩm
exports.getProductDetail = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) return res.status(400).send("ID sản phẩm lỗi");

        const db = getDb();
        const product = await db.collection('item_product').findOne({ _id: new ObjectId(productId) });

        if (!product) return res.status(404).send("Sản phẩm không tồn tại");

        res.render('detail', { // Đã sửa thành tên file view chuẩn
            product: product 
        });
    } catch (error) {
        console.error("Lỗi xem SP:", error);
        res.status(500).send("Lỗi Server");
    }
};

// Tìm kiếm & Sắp xếp
exports.getSearch = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const sort = req.query.sort || 'relevance';
        const db = getDb();

        // 1. Filter
        let filter = {};
        if (keyword) {
            filter = { name: { $regex: keyword, $options: 'i' } };
        }

        // 2. Sort
        let sortOption = {};
        switch (sort) {
            case 'price_asc': sortOption = { price: 1 }; break;
            case 'price_desc': sortOption = { price: -1 }; break;
            case 'newest': sortOption = { _id: -1 }; break;
            case 'sales': sortOption = { sold: -1 }; break;
            default: sortOption = {}; 
        }

        // 3. Query
        const products = await db.collection('item_product')
            .find(filter)
            .sort(sortOption)
            .toArray();

        res.render('result-search', { 
            products: products,
            keyword: keyword,
            sort: sort 
        });
    } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        res.status(500).send("Lỗi Server");
    }
};