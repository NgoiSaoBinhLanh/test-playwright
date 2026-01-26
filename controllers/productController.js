// controllers/productController.js
const Product = require('../models/Product');

// 👇 Đây là hàm mà Routes đang tìm kiếm (dòng 28)
exports.getHomePage = (req, res) => {
    res.render('index');
};

// 👇 Đây là hàm tìm kiếm
exports.searchProduct = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        let products = [];

        if (keyword.length > 0) {
            // Nếu bạn chưa có data Product thì tạm log ra console
            console.log("Tìm kiếm từ khóa:", keyword);
            
            // Nếu đã có DB Product thì mở dòng này ra:
             products = await Product.find({ name: { $regex: keyword, $options: 'i' } });
        }

        res.render('result-search', { 
            products: products,
            keyword: keyword 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi Server");
    }
};