let errorBox = document.querySelector('.messerr')
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnDangNhap');

    if (btn) {
        btn.addEventListener('click', async (event) => {
            event.preventDefault(); // Chặn reload trang

            // 1. Lấy thẻ input
            const usernameInput = document.getElementById('usernameId');
            const passwordInput = document.getElementById('passwordId');

            // Kiểm tra xem thẻ input có tồn tại trong HTML không
            if (!usernameInput || !passwordInput) {
                alert('Lỗi: Không tìm thấy ô nhập liệu (sai ID HTML)');
                return;
            }

            // 2. Lấy giá trị (Value)
            const username = usernameInput.value;
            const password = passwordInput.value;

            // 3. GỌI HÀM VALIDATE (Sửa lại tên biến cho đúng)
            // Truyền 'username' và 'password' vừa lấy được ở trên vào
            if (validateLoginForm(username, password) === false) {
                
                if (errorBox) {
                    errorBox.classList.remove('hidden');
                }
                return; // Nếu có lỗi thì dừng lại, không gửi fetch nữa
            }

            console.log("Dữ liệu hợp lệ, đang gửi về Server...");

            // 4. Gửi dữ liệu về Server
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Đăng nhập thành công! Nhấn OK để chuyển trang.');
                    window.location.href = '/';
                } else {
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
 */
function validateLoginForm(username, password) {
    // 1. Kiểm tra Username
    if (!username || username.trim() === '') {
        const el = document.getElementById('usernameId');
        if (el) el.focus();
        return false;
    }

    // 2. Kiểm tra Password
    if (!password || password.trim() === '') {
        const el = document.getElementById('passwordId');
        if (el) el.focus();
        
        return false;
    }

    return true;
}