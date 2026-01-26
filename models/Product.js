const mongoose = require('mongoose');

// Định nghĩa các trường dữ liệu cho sản phẩm
const ProductSchema = new mongoose.Schema({
    name: String,
    price: String, // Hoặc Number tùy dữ liệu của bạn
    image: String
}, { 
    collection: 'item_product' // Trỏ đúng vào collection chứa sản phẩm
});

module.exports = mongoose.model('Product', ProductSchema);