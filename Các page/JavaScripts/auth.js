document.getElementById("btn-register")   //getelementbtid: tìm phần tử có Id cụ thể

//Lắng nghe sự kiện Click
document.getElementById("btn-register").addEventListener("click", function(){})   //addeventlistener: lắng nghe sự kiện "click", function() {}: hàm chạy khi sự kiện diễn ra

// Lấy dữ liệu từ form
document.getElementById("btn-register").addEventListener("click", function() {
    const email = document.getElementById("email").value 
    const fullname = document.getElementById("fullname").value
    const password = document.getElementById("password").value
    const phone = document.getElementById("phone").value
    const address = document.getElementById("address").value
})

//Gửi dữ liệu lên API
fetch("http:/localhost:8000/auth/register)",{   //fetch: công cụ JS gửi request lên API
    method: "POST",                             //"POST": loại request
    headers: {                                  //headers: thông tin đính kèm request
        "Content-Type": "application/json"      //"Content-Type": "application/json" -> báo server: tôi đang gửi dữ liệu dạng JSON
    },
    body: JSON.stringify({                      //body: dữ liệu gửi lên, "JSON.stringify": chuyển object JS thành chuỗi JSON
        email: email,                           //{email,password,....} -> {"email","password",....}
        full_name: fullname,
        password: password,
        phone: phone,
        address: address
    })
})

//Xử lý kết quả trả về
.then(function(response) {
    return response.json()
})
.then(function(data){
    if (data.email) {
        alert("Đăng ký thành công!")
        window.location.href = "../index.html"
    } else {
        alert("Lỗi: " + data.detail)
    }
})
.catch(function(error){
    alert("Không kết nối được server!")
})