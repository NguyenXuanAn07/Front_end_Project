//Chạy ngay khi trang load xong
async function loadCart() {
    const token = localStorage.getItem("token")

    //not yet login?
    if(!token) {
        alert("Please login first!")
        window.location.href = "../SignIn_SignUp/signin.html"
        return
    }

    //Call API get cart
    const response = await fetch("http://127.0.0.1:8000/cart/", {
        method: "GET",
        headers: {
            "Authorization": "Bearer" + token
        }
    })

    const data = await response.json()

    if(!response.ok) {
        alert("Error: " + data.detail)
    }

    //HIỂN THỊ GIỎ HÀNG
    renderCart(data)
}

function renderCart(items) {
    const tbody = document.getElementById("cart-tbody")

    //Cart empty
    if(items.length === 0) {
        tbody.innerHTMl = `
            <tr>
                <td colspan="5" style="text-align:center; padding:40px,">
                    Giỏ hàng trống!
                </td>
            </tr>
        `
        return
    }

    let total = 0
    tbody.innerHTML = ""

    items.forEach((item) => {
        total += Number(item.subtotal)
        tbody.innerHTML += `
            <tr class="cart-item" data-id="${item.product_id}>
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
        `
    });

    //Tính thuế 10%
    const TAX = 0.10
    const tax = total * TAX
    const finallyTotal = total + tax

    //Update total
    document.getElementById("subtotal").textContent = total.toLocaleString("vi-VN") + "₫"
    document.getElementById("total").textContent = finallyTotal.toLocaleString("vi-VN") + "₫"
    document.getElementById("tax").textContent = tax.toLocaleString("vi-VN") + "₫"

    //Lắng nghe sự kiện click trên toàn bộ bảng
    document.getElementById("cart-tbody").addEventListener("click", (e) => {

        //Verify what button can be push
        const btn = e.target

        const row = btn.closest("tr")
    })
}


//Run when page loaded
loadCart()