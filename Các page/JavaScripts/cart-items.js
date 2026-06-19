//Chạy ngay khi trang load xong
async function loadCart() {
  const token = localStorage.getItem("token");

  //not yet login?
  if (!token) {
    alert("Please login first!");
    window.location.href = "../SignIn_SignUp/signin.html";
    return;
  }

  //Call API get cart
  const response = await fetch("http://127.0.0.1:8000/cart/", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    alert("Error: " + data.detail);
  }

  //HIỂN THỊ GIỎ HÀNG
  renderCart(data);
}

function renderCart(items) {
  const tbody = document.getElementById("cart-tbody");

  //Cart empty
  if (items.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:40px,">
                    Giỏ hàng trống!
                </td>
            </tr>
        `;
    return;
  }

  let total = 0;
  tbody.innerHTML = "";

  items.forEach((item) => {
    total += Number(item.subtotal);
    tbody.innerHTML += `
            <tr class="cart-item" data-id="${item.product_id}">
                <td class="product-info">
                    <div>
                        <p class="product-name">${item.product_name}</p>
                        <p class="product-category">ID: ${item.product_id}</p>
                    </div>
                </td>
                <td class="price">${Number(item.price).toLocaleString("vi-VN")}₫</td>
                <td class="quantity">
                    <button class="qty-btn">-</button>
                    <input type="number" value="${item.quantity}" min="1" />
                    <button class="qty-btn">+</button>
                </td>
                <td class="total">${Number(item.subtotal).toLocaleString("vi-VN")}₫</td>
                <td class="remove">
                    <button class="remove-btn">✕</button>
                </td>
            </tr>
        `;
  });

  //Tính thuế 10%
  const TAX = 0.1;
  const tax = total * TAX;
  const finallyTotal = total + tax;

  //Update total
  document.getElementById("subtotal").textContent =
    total.toLocaleString("vi-VN") + "₫";
  document.getElementById("total").textContent =
    finallyTotal.toLocaleString("vi-VN") + "₫";
  document.getElementById("tax").textContent =
    tax.toLocaleString("vi-VN") + "₫";

  //Lắng nghe sự kiện click trên toàn bộ bảng
  document.getElementById("cart-tbody").addEventListener("click", (e) => {
    //Verify what button can be push
    const btn = e.target;

    const row = btn.closest("tr"); //leo lên thẻ <tr. cha gần nhất
    if (!row) return; //bấm nhầm chỗ trống thì bỏ qua

    const productId = row.dataset.id; //lấy data-id từ <tr>
    const input = row.querySelector("input"); //lấy ô <input> số lượng
    let quantity = Number(input.value); //số lượng hiện tại

    if (btn.textContent === "+") {
      quantity += 1;
      updateCart(productId, quantity);
    }

    if (btn.textContent === "-") {
      if (quantity <= 1) return;
      quantity -= 1;
      updateCart(productId, quantity);
    }

    if (btn.classList.contains("remove-btn")) removeFromCart(productId);
  });
}

//HÀM UPDATECART()
async function updateCart(productId, quantity) {
  const token = localStorage.getItem("token");

  const response = await fetch("http://127.0.0.1:8000/cart/" + productId, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      quantity: quantity,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    alert("Lỗi: " + data.detail);
    return;
  }
  loadCart();
}

//HÀM REMOVEFROMCART
async function removeFromCart(productId) {
  const token = localStorage.getItem("token");

  const response = await fetch("http://127.0.0.1:8000/cart/" + productId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    alert("Lỗi:" + data.detail);
    return;
  }
  loadCart();
}
//Run when page loaded
loadCart();

//NÚT CHECKOUT/ĐẶT HÀNG
document.getElementById("checkout-btn").addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token")
    if(!token) {
      alert("Vui lòng đăng nhập trước!")
      window.location.href = "../SignIn_SignUp/signin.html"
      return
    }

    const address = prompt("Nhập địa chỉ giao hàng")
    if(!address) {
      alert('Vui lòng nhập địa chỉ giao hàng!')
      return
    }
    
    console.log("Đang gửi request checkout...")
    const response = await fetch("http://127.0.0.1:8000/cart/checkout", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        shipping_address: address
      })
    })
    
    console.log("Response status:", response.status)
    const data = await response.json()
    console.log("Response data:", data)
    
    if(!response.ok) {
      alert("Lỗi: " + data.detail)
      return
    } else{
      alert("Đặt hàng thành công, mã đơn:" + data.order_id + "\n Tổng tiền: " + Number(data.total).toLocaleString("vi-VN") + "₫")
    }
  } catch (error) {
    console.error("Lỗi:", error)
    alert("Lỗi: " + error.message)
  }
})
