document.addEventListener('DOMContentLoaded', () => {
    const btnDangKy = document.getElementById('btnDangKy');

    if (btnDangKy) {
        btnDangKy.addEventListener('click', async (e) => {
            e.preventDefault(); // Chặn reload form

            // --- 1. LẤY DỮ LIỆU ---
            const usernameInput = document.getElementById('usernameId');
            const emailInput = document.getElementById('emailId');
            const passwordInput = document.getElementById('passwordId');
            const errorBox = document.querySelector('.messerr'); // Hộp thông báo lỗi
            const errorText = document.getElementById('errorText'); // Dòng chữ báo lỗi

            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // --- 2. RESET TRẠNG THÁI CŨ ---
            // Ẩn bảng lỗi và xóa viền đỏ trước khi kiểm tra mới
            if (errorBox) errorBox.classList.add('hidden');
            [usernameInput, emailInput, passwordInput].forEach(inp => {
                inp.classList.remove('border-red-500', 'bg-red-50');
            });

            // --- 3. KIỂM TRA HỢP LỆ (VALIDATION) ---
            let errorMessage = "";

            // Kiểm tra rỗng
            if (!username) {
                hightlightError(usernameInput);
                errorMessage = "Vui lòng nhập Tên đăng nhập!";
            } 
            else if (!email) {
                hightlightError(emailInput);
                errorMessage = "Vui lòng nhập Email!";
            }
            else if (!isValidEmail(email)) {
                hightlightError(emailInput);
                errorMessage = "Email không đúng định dạng!";
            }
            else if (!password) {
                hightlightError(passwordInput);
                errorMessage = "Vui lòng nhập Mật khẩu!";
            }
            else if (password.length < 6) {
                hightlightError(passwordInput);
                errorMessage = "Mật khẩu phải từ 6 ký tự trở lên!";
            }

            // Nếu có lỗi -> Hiện thông báo và dừng lại
            if (errorMessage) {
                if (errorText) errorText.innerText = errorMessage;
                if (errorBox) errorBox.classList.remove('hidden');
                return; // Dừng ngay, không gửi Server
            }

            // --- 4. GỬI DỮ LIỆU VỀ SERVER (Khi đã hợp lệ) ---
            try {
                const response = await fetch('/dangky', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Đăng ký thành công! Vui lòng đăng nhập.');
                    window.location.href = '/dangnhap';
                } else {
                    // Hiện lỗi từ Server trả về (ví dụ: Tài khoản đã tồn tại)
                    if (errorText) errorText.innerText = data.message;
                    if (errorBox) errorBox.classList.remove('hidden');
                }

            } catch (err) {
                console.error(err);
                alert("Lỗi kết nối Server!");
            }
        });
    }
});

// Hàm phụ: Tô đỏ ô input bị lỗi
function hightlightError(inputElement) {
    inputElement.classList.add('border-red-500', 'bg-red-50');
    inputElement.focus();
}

// Hàm phụ: Kiểm tra định dạng Email (Regex chuẩn)
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}