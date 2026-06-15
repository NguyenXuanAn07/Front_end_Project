// Hàm chạy khi người dùng bấm nút Add to Bag
// event: sự kiện click chuột
// productId: id của sản phẩm trong database
async function addToBag(event, productId) {
  // Chặn hành vi mặc định của thẻ cha
  // Vì nút Add to Bag của bạn đang nằm trong thẻ <a>
  // Nếu không chặn, bấm nút có thể bị chuyển trang
  event.preventDefault();

  // Chặn sự kiện click lan ra ngoài
  // Nghĩa là chỉ xử lý click ở nút này thôi
  event.stopPropagation();

  // Lấy token đăng nhập từ localStorage
  // Token này được lưu sau khi user đăng nhập thành công
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Bạn cần đăng nhập trước!");
    window.location.href = "./SignIn_SignUp/signin.html";
    return;
  }

  // Gửi request từ frontend sang FastAPI
  const response = await fetch("http://127.0.0.1:8000/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",   // Báo cho backend biết dữ liệu gửi lên là JSON

      // Gửi token đăng nhập cho backend kiểm tra user là ai
      // FastAPI của bạn đang dùng dạng Bearer token
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: 1,
    }),
  });

  // Chuyển dữ liệu backend trả về từ JSON thành object JS
  const data = await response.json();

  // Nếu response.ok là true
  // Nghĩa là status code nằm trong khoảng 200-299
  if (response.ok) {
    alert("Đã thêm vào giỏ hàng!");
  } else {
    alert(data.detail || "Thêm vào giỏ hàng thất bại!");
  }
}
