document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnDangNhap');

    if (btn) {
        // --- SỬA LỖI QUAN TRỌNG: Dùng 'click' thay vì 'submit' ---
        btn.addEventListener('click', async (event) => {
            event.preventDefault(); // Chặn reload trang
            
            console.log("Đã click nút, đang gửi dữ liệu...");

            // Lấy dữ liệu từ ô input (Đảm bảo ID bên Pug là usernameId và passwordId)
            const usernameInput = document.getElementById('usernameId');
            const passwordInput = document.getElementById('passwordId');
            
            if (validateLoginForm(user, pass) === false) {
                return; 
    }
            if (!usernameInput || !passwordInput) {
                alert('Lỗi: Không tìm thấy ô nhập liệu trong HTML');
                return;
            }

            const username = usernameInput.value;
            const password = passwordInput.value;

            // Gửi dữ liệu về Server
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Thành công -> Chuyển trang
                    alert('Đăng nhập thành công! Nhấn OK để chuyển trang.');
                    window.location.href = '/';
                } else {
                    // Thất bại -> Hiện lỗi server trả về
                    alert('Lỗi: ' + data.message);
                }
            } catch (e) {
                console.error(e);
                alert('Không thể kết nối tới Server');
            }
        });
    } else {
        console.error("Lỗi: Không tìm thấy nút có id='btnDangNhap'");
    }
});
/**
 * Hàm kiểm tra dữ liệu đầu vào phía Client
 * Trả về: true (nếu hợp lệ), false (nếu có lỗi)
 */
function validateLoginForm(username, password) {
    // 1. Kiểm tra Username
    if (!username || username.trim() === '') {
        alert("Vui lòng nhập Tên đăng nhập!");
        document.getElementById('usernameId').focus(); // Trỏ chuột vào ô lỗi
        return false; // Dừng lại, báo lỗi
    }

    // 2. Kiểm tra Password
    if (!password || password.trim() === '') {
        alert("Vui lòng nhập Mật khẩu!");
        document.getElementById('passwordId').focus(); // Trỏ chuột vào ô lỗi
        return false; // Dừng lại, báo lỗi
    }

    // 3. (Mở rộng) Ví dụ: Kiểm tra mật khẩu quá ngắn (nếu cần)
    // if (password.length < 6) {
    //    alert("Mật khẩu phải từ 6 ký tự trở lên!");
    //    return false;
    // }

    return true; // Dữ liệu OK
}