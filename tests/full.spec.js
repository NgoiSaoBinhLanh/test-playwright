const { test, expect } = require('@playwright/test');

test.describe('Kiểm thử chức năng Đăng Ký và Tìm Kiếm', () => {

  // ==========================================
  // PHẦN 1: KIỂM THỬ ĐĂNG KÝ (REGISTER)
  // ==========================================

  // --- CASE 1: Đăng ký thất bại (Điền thiếu thông tin) ---
  test('Đăng ký: Báo lỗi khi không điền thông tin', async ({ page }) => {
    // 1. Vào trang đăng ký
    await page.goto('/dangky');

    // 2. Không điền gì cả, bấm nút Đăng Ký luôn
    await page.click('#btnDangKy');

    // 3. Kiểm tra UI: Phải hiện khung báo lỗi
    // (Dựa trên class .messerr trong file Pug và JS register.js của bạn)
    const errorBox = page.locator('.messerr');
    
    // Kiểm tra thẻ lỗi phải hiện lên (Visible)
    await expect(errorBox).toBeVisible();
    
    // Kiểm tra nội dung báo lỗi (có thể là "Vui lòng nhập..." hoặc "Thiếu...")
    // Dùng toContainText để chỉ cần đúng một phần nội dung là được
    await expect(errorBox).toContainText('Vui lòng'); 
  });

  // --- CASE 2: Đăng ký thành công (Thông tin hợp lệ) ---
  test('Đăng ký: Thành công với tài khoản mới', async ({ page }) => {
    // 1. Tạo dữ liệu ngẫu nhiên (Để tránh lỗi trùng Username/Email khi chạy test nhiều lần)
    const randomId = Math.floor(Math.random() * 90000) + 10000;
    const newUser = `testuser_${randomId}`;
    const newEmail = `test_${randomId}@email.com`;
    const password = 'password123';

    console.log(`Đang test đăng ký với: ${newUser} | ${newEmail}`);

    await page.goto('/dangky');

    // 2. Điền đầy đủ thông tin
    await page.fill('#usernameId', newUser);
    await page.fill('#emailId', newEmail);
    await page.fill('#passwordId', password);

    // 3. Bấm nút
    await page.click('#btnDangKy');

    // 4. Kiểm tra kết quả: Phải chuyển hướng sang trang Đăng nhập
    // Regex \/dangnhap đảm bảo URL kết thúc bằng /dangnhap
    await expect(page).toHaveURL(/\/dangnhap/);
  });


  // ==========================================
  // PHẦN 2: KIỂM THỬ TÌM KIẾM (SEARCH)
  // ==========================================

  // --- CASE 3: Tìm kiếm "áo" ---
  test('Tìm kiếm: Sản phẩm "áo"', async ({ page }) => {
    // 1. Vào trang chủ
    await page.goto('/');

    // 2. Nhập từ khóa
    await page.fill('#search-input', 'áo');
    
    // 3. Nhấn Enter để tìm
    await page.press('#search-input', 'Enter');

    // 4. Kiểm tra URL: Phải chứa tham số keyword (chấp nhận cả tiếng Việt có dấu mã hóa)
    // Regex này linh hoạt: tìm thấy chữ "áo" hoặc mã hóa "%C3%A1o"
    await expect(page).toHaveURL(/keyword=.*(áo|%C3%A1o)/i);

    // 5. Kiểm tra Giao diện: Trang kết quả phải hiện tiêu đề H1
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Kết quả tìm kiếm cho');
  });

  // --- CASE 4: Tìm kiếm "quần" ---
  test('Tìm kiếm: Sản phẩm "quần"', async ({ page }) => {
    await page.goto('/');

    await page.fill('#search-input', 'quần');
    await page.press('#search-input', 'Enter');

    // Kiểm tra URL có chữ "quần" (hoặc mã hóa của nó)
    // Regex "qu.*n" sẽ bắt được cả "quần" và "qu%E1%BA%A7n"
    await expect(page).toHaveURL(/keyword=.*qu.*n/i);

    // Kiểm tra có hiện sản phẩm hoặc thông báo không tìm thấy
    const title = page.locator('h1');
    await expect(title).toContainText('Kết quả tìm kiếm cho');
  });

});