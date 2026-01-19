import { defineConfig, devices } from '@playwright/test';

/**
 * Cấu hình Playwright
 * Xem chi tiết: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Thư mục chứa các file test
  testDir: './tests',
  
  // Chạy test song song
  fullyParallel: true,
  
  // Báo cáo kết quả dạng HTML
  reporter: 'html',
  
  // Các cài đặt chung cho trình duyệt
  use: {
    /* 1. Quan trọng: Đường dẫn gốc của server bạn */
    baseURL: 'http://localhost:3000',

    /* 2. Quan trọng: headless: false để hiện trình duyệt lên cho bạn xem */
    headless: false,

    /* Thu thập dấu vết khi test thất bại */
    trace: 'on-first-retry',
  },

  /* Cấu hình các trình duyệt sẽ chạy test */
  projects: [
    {
      name: 'chromium', // Google Chrome
      use: { ...devices['Desktop Chrome'] },
    },
    // Bạn có thể bỏ comment dưới nếu muốn test thêm trên Firefox
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],

  /* (Tùy chọn) Tự động bật server nếu bạn quên bật 
     Nếu bạn muốn dùng thì bỏ comment dòng dưới đi */
  // webServer: {
  //   command: 'node server.js',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: true,
  // },
});