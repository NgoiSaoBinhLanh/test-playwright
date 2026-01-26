// File: config/db.js
const mongoose = require('mongoose');

let _db;

const mongoConnect = callback => {
  // Dùng Mongoose để kết nối (Thay vì MongoClient)
  // Lưu ý: Thêm tên database 'demo' vào cuối đường dẫn
  mongoose.connect('mongodb://127.0.0.1:27017/demo')
    .then(client => {
      console.log('✅ Đã kết nối MongoDB (Mongoose) thành công!');
      // Lưu lại đối tượng native db để dùng cho hàm getDb()
      _db = mongoose.connection.db; 
      callback();
    })
    .catch(err => {
      console.log('❌ Lỗi kết nối DB:', err);
      throw err;
    });
};

const getDb = () => {
  // Nếu đã kết nối, trả về đối tượng database
  if (_db) {
    return _db;
  }
  // Fallback: Lấy trực tiếp từ mongoose nếu biến _db chưa kịp gán
  if (mongoose.connection.db) {
      return mongoose.connection.db;
  }
  throw 'Chưa tìm thấy Database! Hãy chắc chắn server đã kết nối.';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;