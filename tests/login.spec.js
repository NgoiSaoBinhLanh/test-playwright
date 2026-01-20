const { test, expect } = require('@playwright/test');

// Dùng test.describe để gom nhóm các test case
test.describe('Kiểm thử chức năng Đăng Nhập', () => {

  // Chạy trước mỗi test case: Vào trang đăng nhập
  test.beforeEach(async ({ page }) => {
    await page.goto('/dangnhap');
  });

  // --- CASE 1: ĐĂNG NHẬP THÀNH CÔNG ---
  test('Đăng nhập thành công với tài khoản đúng', async ({ page }) => {
    console.log('Testing: Login Success...');
    
    // 1. Điền thông tin đúng
    await page.fill('#usernameId', 'nguyenngocvuong'); 
    await page.fill('#passwordId', '123456');

    // 2. Lắng nghe Alert (Vì JS login thành công có alert)
    page.once('dialog', async dialog => {
        console.log(`Alert hiện lên: ${dialog.message()}`);
        await dialog.accept(); 
    });

    // 3. Click nút đăng nhập
    await page.click('#btnDangNhap');

    // 4. Kiểm tra chuyển hướng về trang chủ
    // Lưu ý: Dùng Regex hoặc URL đầy đủ
    await expect(page).toHaveURL(/http:\/\/localhost:3000\/?/);
  });

  // --- CASE 2: BỎ TRỐNG USERNAME ---
  test('Báo lỗi khi bỏ trống Username', async ({ page }) => {
    console.log('Testing: Empty Username...');

    // 1. Không điền gì cả, bấm nút luôn
    await page.click('#btnDangNhap');

    // 2. Kiểm tra UI (Vì JS lỗi không có alert, chỉ hiện div lỗi)
    const errorBox = page.locator('.messerr'); 
    
    // Kiểm tra thẻ lỗi phải hiện lên (Visible)
    await expect(errorBox).toBeVisible();
    
    // Kiểm tra nội dung (Dựa vào text trong file Pug của bạn)
    await expect(errorBox).toContainText('Vui lòng điền đầy đủ thông tin'); 
  });

  // --- CASE 3: BỎ TRỐNG PASSWORD ---
  test('Báo lỗi khi bỏ trống Password', async ({ page }) => {
    console.log('Testing: Empty Password...');

    // 1. Chỉ điền User
    await page.fill('#usernameId', 'nguyenngocvuong');
    // 2. Click nút
    await page.click('#btnDangNhap');

    // 3. Kiểm tra UI
    const errorBox = page.locator('.messerr'); 
    
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText('Vui lòng điền đầy đủ thông tin');
  });

});