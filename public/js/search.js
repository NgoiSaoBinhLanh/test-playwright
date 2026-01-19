document.addEventListener('DOMContentLoaded', () => {
    // ... (Giữ nguyên phần gợi ý cũ nếu có) ...

    const input = document.getElementById('search-input');
    const searchForm = input.closest('form'); // Tìm cái form bao quanh ô input

    // HÀM CHUYỂN HƯỚNG SANG TRANG TÌM KIẾM
    function handleSearch() {
        const keyword = input.value.trim();
        if (keyword) {
            // Chuyển hướng sang trang /timkiem kèm theo từ khóa
            // encodeURIComponent giúp xử lý các ký tự đặc biệt hoặc tiếng Việt
            window.location.href = `/timkiem?keyword=${encodeURIComponent(keyword)}`;
        }
    }

    // 1. Bắt sự kiện khi nhấn Enter trong ô input
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Chặn form submit mặc định
            handleSearch();
        }
    });

    // 2. Bắt sự kiện khi click vào nút Kính lúp
    // (Giả sử nút kính lúp là thẻ button bên trong form)
    const searchBtn = searchForm.querySelector('button');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSearch();
        });
    }
});

// Cập nhật hàm chọn gợi ý (nếu bạn đang dùng phần gợi ý ở bài trước)
function selectItem(text) {
    // Khi chọn gợi ý -> Chuyển trang luôn
    window.location.href = `/timkiem?keyword=${encodeURIComponent(text)}`;
}