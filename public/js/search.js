document.addEventListener('DOMContentLoaded', () => {
    // 1. Xác định các phần tử trong giao diện (Header/Layout)
    // Lưu ý: Đảm bảo trong file layout.pug hoặc header của bạn có input với id="search-input"
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('btnSearch'); // Nếu có nút kính lúp

    // 2. Hàm xử lý chuyển hướng chung
    function performSearch() {
        if (!searchInput) return;

        const keyword = searchInput.value.trim();
        
        // Chỉ tìm kiếm khi có từ khóa
        if (keyword) {
            // Chuyển hướng sang trang kết quả
            // Server sẽ bắt lấy param 'keyword' này để query database
            // Sau đó server sẽ render file Pug kết quả mà bạn đã viết
            window.location.href = `/timkiem?keyword=${encodeURIComponent(keyword)}`;
        }
    }

    // 3. Bắt sự kiện cho ô Input
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            // Nếu nhấn phím Enter
            if (event.key === 'Enter') {
                event.preventDefault(); // Chặn việc submit form mặc định (nếu có)
                performSearch();
            }
        });
    }

    // 4. Bắt sự kiện cho nút Tìm kiếm (Nếu có)
    if (searchButton) {
        searchButton.addEventListener('click', (event) => {
            event.preventDefault();
            performSearch();
        });
    }
});