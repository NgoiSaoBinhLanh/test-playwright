const { test, expect } = require('@playwright/test');

test.describe('Kiểm thử hệ thống Authentication', () => {

  // Chạy trước mỗi test case: Vào trang đăng nhập
  test.beforeEach(async ({ page }) => {
    await page.goto('/dangnhap');
  });

  // --- CASE 1: ĐĂNG NHẬP THÀNH CÔNG ---
  test('Đăng nhập thành công với tài khoản đúng', async ({ page }) => {
    console.log('Testing: Login Success...');
    
    await page.fill('#usernameId', 'nguyenngocvuong'); 
    await page.fill('#passwordId', '123456');

    // Xử lý dialog alert nếu có
    page.once('dialog', async dialog => {
        await dialog.accept(); 
    });

    await page.click('#btnDangNhap');

    // Kiểm tra chuyển hướng về trang chủ
    await expect(page).toHaveURL(/http:\/\/localhost:3000\/?/);
    
    // Kiểm tra UI: Phải hiện Avatar user (class .user-item)
    await expect(page.locator('.user-item')).toBeVisible();
  });

  // --- CASE 2: BỎ TRỐNG USERNAME ---
  test('Báo lỗi khi bỏ trống Username', async ({ page }) => {
    console.log('Testing: Empty Username...');

    await page.click('#btnDangNhap');

    const errorBox = page.locator('.messerr'); 
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText('Vui lòng điền đầy đủ thông tin'); 
  });

  // --- CASE 3: BỎ TRỐNG PASSWORD ---
  test('Báo lỗi khi bỏ trống Password', async ({ page }) => {
    console.log('Testing: Empty Password...');

    await page.fill('#usernameId', 'nguyenngocvuong');
    await page.click('#btnDangNhap');

    const errorBox = page.locator('.messerr'); 
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText('Vui lòng điền đầy đủ thông tin');
  });

  // --- CASE 4: ĐĂNG XUẤT (MỚI THÊM) ---
  test('Đăng xuất hệ thống thành công', async ({ page }) => {
    console.log('Testing: Logout flow...');

    // BƯỚC 1: ĐĂNG NHẬP TRƯỚC (Pre-condition)
    // (Vì beforeEach đã vào trang login rồi, giờ chỉ cần điền info)
    await page.fill('#usernameId', 'nguyenngocvuong');
    await page.fill('#passwordId', '123456');
    
    // Xử lý alert đăng nhập
    page.once('dialog', async dialog => await dialog.accept());
    
    await page.click('#btnDangNhap');
    
    // Chờ chuyển trang về Home thành công
    await page.waitForURL('http://localhost:3000/');

    // BƯỚC 2: THỰC HIỆN ĐĂNG XUẤT
    // Tìm Avatar user (class .user-item trong file layout pug)
    const userAvatar = page.locator('.user-item');
    await expect(userAvatar).toBeVisible();

    // Hover vào avatar để hiện menu dropdown (quan trọng vì menu đang ẩn)
    await userAvatar.hover();

    // Click nút Đăng xuất (tìm theo href="/logout")
    const logoutBtn = page.locator('a[href="/logout"]');
    await expect(logoutBtn).toBeVisible(); // Đảm bảo menu đã hiện
    await logoutBtn.click();

    // BƯỚC 3: KIỂM TRA KẾT QUẢ SAU KHI LOGOUT
    console.log('Verifying Logout state...');

    // 1. Avatar user phải biến mất
    await expect(userAvatar).not.toBeVisible();

    // 2. Nút "Đăng Nhập" trên header phải hiện lại
    const loginLink = page.locator('a[href="/dangnhap"]');
    await expect(loginLink).toBeVisible();

    // 3. (Tùy chọn) Kiểm tra URL nếu server redirect về trang login
    // await expect(page).toHaveURL(/.*dangnhap/);
  });

});