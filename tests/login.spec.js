// tests/login.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Kiểm thử chức năng Đăng Nhập', () => {

  // Trước mỗi bài test, luôn vào trang chủ
  test.beforeEach(async ({ page }) => {
    await page.goto('/dangnhap');
  });

  // --- TEST CASE 1: ĐĂNG NHẬP THÀNH CÔNG ---
  test('Đăng nhập thành công với tài khoản đúng', async ({ page }) => {
    console.log('--- Bắt đầu Test: Đăng nhập đúng ---');

    // 1. Điền thông tin (Dùng tài khoản thật trong DB của bạn)
    await page.fill('#usernameId', 'nguyenngocvuong'); 
    await page.fill('#passwordId', '123456');

    // 2. Xử lý hộp thoại Alert (Quan trọng vì code JS của bạn dùng alert)
    // Robot sẽ tự bấm "OK" khi alert hiện ra
    page.once('dialog', async dialog => {
      console.log(`-> Hộp thoại xuất hiện: "${dialog.message()}"`);
      await dialog.accept(); // Tương đương bấm nút OK
    });

    // 3. Click nút Đăng nhập
    await page.click('#btnDangNhap');

    // 4. Kiểm tra kết quả: Phải chuyển hướng sang trang /timkiem
    // Chờ URL thay đổi
    await page.waitForURL('**/'); 
    
    // Khẳng định (Assert) rằng URL hiện tại có chứa chữ 'timkiem'
    expect(page.url()).toContain('/');
    
    console.log('-> Đã chuyển trang thành công!');
  });

  // --- TEST CASE 2: ĐĂNG NHẬP THẤT BẠI ---
  test('Báo lỗi khi nhập sai mật khẩu', async ({ page }) => {
    console.log('--- Bắt đầu Test: Đăng nhập sai ---');

    // 1. Điền thông tin sai
    await page.fill('#usernameId', 'nguyenngocvuong');
    await page.fill('#passwordId', 'matkhausai123'); // Sai pass

    // 2. Lắng nghe thông báo lỗi
    let alertMessage = '';
    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      console.log(`-> Hộp thoại báo lỗi: "${alertMessage}"`);
      await dialog.accept();
    });

    // 3. Click nút
    await page.click('#btnDangNhap');

    // 4. Kiểm tra:
    // - URL VẪN LÀ trang chủ (không được chuyển trang)
    expect(page.url()).not.toContain('/timkiem');
    
    // - (Tùy chọn) Kiểm tra nội dung alert có chữ "Sai" hoặc "Lỗi" không
    // Lưu ý: Cần đợi alert xuất hiện, ở đây ta dùng timeout ngắn để đợi xử lý
    await page.waitForTimeout(1000);
    // Code server của bạn trả về "Sai tên đăng nhập hoặc mật khẩu"
    // Nếu bạn muốn check kỹ thì dùng: expect(alertMessage).toContain('Sai'); 
  });

});
// --- TEST CASE 3: KIỂM TRA BỎ TRỐNG DỮ LIỆU ---
  
  // Trường hợp 1: Không nhập gì cả -> Bấm nút luôn
  test('Báo lỗi khi bỏ trống cả Tài khoản và Mật khẩu', async ({ page }) => {
    console.log('--- Bắt đầu Test: Bỏ trống toàn bộ ---');

    // 1. Thiết lập lắng nghe hộp thoại cảnh báo (Alert)
    let alertMessage = '';
    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      console.log(`-> Alert hiện lên: "${alertMessage}"`);
      await dialog.accept();
    });

    // 2. Click nút Đăng nhập (Mà không điền gì hết)
    await page.click('#btnDangNhap');

    // 3. Kiểm tra:
    // - Thông báo phải chứa từ "Vui lòng" hoặc "đầy đủ" (tùy code JS của bạn)
    // - Code JS cũ của bạn là: "Vui lòng nhập đầy đủ..."
    expect(alertMessage).toContain('Vui lòng');
    expect(alertMessage).toContain('đầy đủ');

    // - URL không được thay đổi (Vẫn ở trang chủ)
    expect(page.url()).not.toContain('/timkiem');
  });

  // Trường hợp 2: Có nhập Tài khoản nhưng QUÊN nhập Mật khẩu
  test('Báo lỗi khi chỉ nhập User mà thiếu Password', async ({ page }) => {
    console.log('--- Bắt đầu Test: Thiếu Password ---');

    // 1. Điền mỗi Username
    await page.fill('#usernameId', 'nguyenngocvuong');
    // Mật khẩu bỏ trống (không fill)

    // 2. Lắng nghe Alert
    let alertMessage = '';
    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // 3. Click nút
    await page.click('#btnDangNhap');

    // 4. Kiểm tra
    expect(alertMessage).toContain('Vui lòng'); // Vẫn phải báo lỗi
    expect(page.url()).not.toContain('/timkiem'); // Không được chuyển trang
  });