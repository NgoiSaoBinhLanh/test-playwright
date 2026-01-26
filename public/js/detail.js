/**
 * public/js/detail.js
 * Xử lý logic cho trang chi tiết sản phẩm: Mua ngay, Thêm giỏ hàng, Cập nhật Badge
 */

// --- 1. HÀM THÊM VÀO GIỎ HÀNG ---
async function addToCart(productId) {
    try {
        const response = await fetch('/themgiohang', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: productId })
        });

        const data = await response.json();

        // Kiểm tra đăng nhập (401)
        if (response.status === 401 || data.requireLogin) {
            alert(data.message || 'Vui lòng đăng nhập!');
            window.location.href = '/dangnhap';
            return;
        }

        // Thành công
        if (response.ok && data.success) {
            // Cập nhật số trên icon ngay lập tức
            updateCartBadge(data.totalItems);
            alert('✅ ' + (data.message || 'Đã thêm vào giỏ hàng thành công!'));
        } else {
            alert('❌ Lỗi: ' + data.message);
        }

    } catch (e) {
        console.error("Lỗi thêm giỏ hàng:", e);
        alert('Lỗi kết nối đến server!');
    }
}

// --- 2. HÀM MUA NGAY ---
async function buyNow(productId) {
    try {
        // Tìm nút đang bấm để hiện hiệu ứng loading
        const btn = event.target.closest('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'Đang xử lý...';
        btn.disabled = true;

        const response = await fetch('/muangay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: productId })
        });

        const data = await response.json();

        // Kiểm tra đăng nhập
        if (response.status === 401 || data.requireLogin) {
            alert(data.message || 'Vui lòng đăng nhập để mua hàng!');
            window.location.href = '/dangnhap';
            return;
        }

        if (response.ok && data.success) {
            // Chuyển sang trang hóa đơn
            window.location.href = `/donhang/${data.orderId}`;
        } else {
            alert('Lỗi: ' + (data.message || 'Không thể tạo đơn'));
            // Reset nút nếu lỗi
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (e) {
        console.error("Lỗi mua ngay:", e);
        alert('Lỗi kết nối!');
        
        // Reset nút nếu lỗi mạng (Tìm lại nút vì event có thể đã mất)
        const buttons = document.querySelectorAll('button');
        buttons.forEach(b => {
             if(b.innerText === 'Đang xử lý...') {
                 b.disabled = false;
                 b.innerText = 'Mua Ngay';
             }
        });
    }
}

// --- 3. HÀM CẬP NHẬT BADGE (FORCE UPDATE) ---
function updateCartBadge(number) {
    const badge = document.getElementById('cart-badge');
    
    if (badge) {
        badge.innerText = number;
        
        if (number > 0) {
            badge.style.display = 'block'; // Hiện
        } else {
            badge.style.display = 'none'; // Ẩn
        }
    } else {
        console.error("⚠️ Không tìm thấy phần tử #cart-badge trên Header!");
    }
}