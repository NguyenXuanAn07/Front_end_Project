async function addToBag(productId) {
    //Lấy token từ localStorage
    const token = localStorage.getItem("token")

    //Chưa đăng nhập -> chuyển sang trang đăng nhập
    if (!token) {
        alert("Vui lòng đăng nhập trước!")
        window.location.href = "../SignIn_SignUp/signin.html"
        return
    }

    //Gửi request thêm vào giỏ hàng
    const reponse = await fetch("http://127.0.0.1:8000/cart/add" , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer" + token   //gửi kèm token khi gọi API giỏ hàng -> biết được user nào
        },
        body: JSON.stringfy({
            product_id: productId,
            quantity: 1
        })
    })
    const data = await response.json()   //await/async: cách viết fetch gọn hơn .then() -> chờ kết quả xong mới làm tiếp

    if(response.ok) {
        alert("Đã thêm vào giỏ hàng!")
    } else {
        alert("Lỗi" + data.detail)
    }
}


//Sửa thẻ addToBAg ra khỏi thẻ <a>
async function addToBag(event, productId) {
    console.log("addToBag chạy! productId:", productId)  
    event.preventDefault()  // ← ngăn không cho <a> chuyển trang
    event.stopPropagation() // ← ngăn sự kiện lan ra thẻ cha
}