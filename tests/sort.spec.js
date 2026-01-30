const { test, expect } = require('@playwright/test');

test.describe('Kiểm thử chức năng Sắp xếp sản phẩm (Sorting)', () => {

  // Chuẩn bị: Vào trang tìm kiếm trước mỗi bài test
  test.beforeEach(async ({ page }) => {
    // Tìm từ khóa "áo" để có nhiều kết quả
    await page.goto('/timkiem?keyword=áo');
  });

  // --- TEST CASE 1: GIÁ THẤP ĐẾN CAO ---
  test('Sắp xếp Giá tăng dần (Thấp -> Cao)', async ({ page }) => {
    console.log('🔹 Testing: Sort Price Ascending...');

    // 1. Hover vào menu "Giá"
    const priceMenu = page.locator('button:has-text("Giá")');
    await priceMenu.hover();

    // 2. Click chọn "Giá: Thấp đến Cao"
    // (Selector dựa trên href chứa sort=price_asc)
    const sortAscBtn = page.locator('a[href*="sort=price_asc"]');
    await sortAscBtn.click();

    // 3. Chờ URL thay đổi để chắc chắn trang đã load lại
    await page.waitForURL(/sort=price_asc/);
    
    // Chờ một chút để danh sách sản phẩm render xong (cho chắc ăn)
    await page.waitForSelector('.grid'); 

    // 4. Lấy danh sách giá tiền từ giao diện
    // (Selector này dựa trên class màu cam bạn dùng trong Pug: text-[#ee4d2d])
    const priceElements = page.locator('.grid span.text-\\[\\#ee4d2d\\]');
    
    // Lấy text của tất cả các phần tử giá (VD: ['100.000 đ', '200.000 đ'])
    const priceTexts = await priceElements.allInnerTexts();
    
    console.log(`   Tìm thấy ${priceTexts.length} sản phẩm.`);

    // 5. Chuyển đổi Text sang Number
    const prices = priceTexts.map(text => {
        // Loại bỏ mọi ký tự không phải số (dấu chấm, chữ đ, khoảng trắng...)
        const cleanText = text.replace(/\D/g, ''); 
        return parseInt(cleanText, 10);
    });

    console.log('   Giá sau khi xử lý:', prices);

    // 6. Kiểm tra Logic Tăng Dần
    // Duyệt qua mảng, đảm bảo số trước <= số sau
    for (let i = 0; i < prices.length - 1; i++) {
        const current = prices[i];
        const next = prices[i + 1];
        
        if (current > next) {
            console.error(`❌ Lỗi tại vị trí ${i}: ${current} lớn hơn ${next}`);
        }
        expect(current).toBeLessThanOrEqual(next);
    }
    
    console.log('✅ Kết quả: Giá đã được sắp xếp tăng dần chính xác!');
  });

  // --- TEST CASE 2: GIÁ CAO ĐẾN THẤP ---
  test('Sắp xếp Giá giảm dần (Cao -> Thấp)', async ({ page }) => {
    console.log('🔹 Testing: Sort Price Descending...');

    // 1. Hover và Click
    const priceMenu = page.locator('button:has-text("Giá")');
    await priceMenu.hover();

    const sortDescBtn = page.locator('a[href*="sort=price_desc"]');
    await sortDescBtn.click();

    // 2. Chờ load
    await page.waitForURL(/sort=price_desc/);
    await page.waitForSelector('.grid');

    // 3. Lấy giá và chuyển đổi
    const priceElements = page.locator('.grid span.text-\\[\\#ee4d2d\\]');
    const priceTexts = await priceElements.allInnerTexts();
    
    const prices = priceTexts.map(text => {
        return parseInt(text.replace(/\D/g, ''), 10);
    });

    console.log('   Giá sau khi xử lý:', prices);

    // 4. Kiểm tra Logic Giảm Dần
    // Đảm bảo số trước >= số sau
    for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }

    console.log('✅ Kết quả: Giá đã được sắp xếp giảm dần chính xác!');
  });

});