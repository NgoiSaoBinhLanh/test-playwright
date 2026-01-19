const { test, expect } = require('@playwright/test');

test('Kiểm tra trang chủ Localhost', async ({ page }) => {
  // 1. Vào trang chủ (nó tự nối với baseURL đã cài ở Bước 2)
  await page.goto('/');

  // 2. In ra console để biết mình đang test cái gì
  console.log('Đang kiểm tra trang web của bạn...');

  // 3. Kiểm tra Tiêu đề tab (Title)
  // Bạn hãy sửa chữ 'React App' thành tiêu đề thật của web bạn
  await expect(page).toHaveTitle(/React App|Trang chủ/);

  // 4. Kiểm tra xem có một dòng chữ nào đó hiện ra không
  // Ví dụ: tìm chữ "Welcome" hoặc "Xin chào"
  await expect(page.getByText('Xin chào', { exact: false })).toBeVisible();

  // 5. Chụp ảnh màn hình làm kỷ niệm
  await page.screenshot({ path: 'trang-chu.png' });
});
