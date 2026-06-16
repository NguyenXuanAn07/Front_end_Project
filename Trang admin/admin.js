// ── DATA LAYER ──
const STORAGE_KEY = "nike_admin_orders";
const ITEMS_PER_PAGE = 8;

const DEMO_ORDERS = [
  {
    id: "NK001",
    product: "Air Max 95",
    emoji: "👟",
    size: "42",
    color: "Black/White",
    qty: 1,
    customer: "Nguyễn Văn An",
    email: "an.nguyen@gmail.com",
    phone: "0912345678",
    address: "12 Lý Thường Kiệt, Hà Nội",
    date: "2024-06-01T09:15:00",
    price: 4200000,
    status: "pending",
    note: "Giao giờ hành chính",
  },
  {
    id: "NK002",
    product: "Air Jordan 1 Low",
    emoji: "🏀",
    size: "41",
    color: "Red",
    qty: 2,
    customer: "Trần Thị Bảo",
    email: "bao.tran@hotmail.com",
    phone: "0987654321",
    address: "88 Hoàng Cầu, Hà Nội",
    date: "2024-06-02T14:22:00",
    price: 7800000,
    status: "confirmed",
    note: "",
  },
  {
    id: "NK003",
    product: "Nike Dunk Low",
    emoji: "⚡",
    size: "39",
    color: "Panda",
    qty: 1,
    customer: "Lê Minh Châu",
    email: "chau.le@yahoo.com",
    phone: "0967891234",
    address: "45 Nguyễn Trãi, TP.HCM",
    date: "2024-06-03T10:05:00",
    price: 3500000,
    status: "shipping",
    note: "",
  },
  {
    id: "NK004",
    product: "Nike Pegasus 41",
    emoji: "🔵",
    size: "43",
    color: "Blue",
    qty: 1,
    customer: "Phạm Quốc Dũng",
    email: "dung.pham@gmail.com",
    phone: "0903456789",
    address: "7 Điện Biên Phủ, Đà Nẵng",
    date: "2024-06-03T16:40:00",
    price: 3200000,
    status: "delivered",
    note: "Khách VIP",
  },
  {
    id: "NK005",
    product: "Air Force 1 07",
    emoji: "🤍",
    size: "40",
    color: "White",
    qty: 3,
    customer: "Hoàng Thu Hà",
    email: "ha.hoang@gmail.com",
    phone: "0978123456",
    address: "22 Phan Bội Châu, Hà Nội",
    date: "2024-06-04T08:30:00",
    price: 9600000,
    status: "pending",
    note: "",
  },
  {
    id: "NK006",
    product: "KD18",
    emoji: "🔴",
    size: "44",
    color: "Red/Gold",
    qty: 1,
    customer: "Vũ Thanh Sơn",
    email: "son.vu@gmail.com",
    phone: "0945678901",
    address: "91 Bạch Đằng, TP.HCM",
    date: "2024-06-04T11:10:00",
    price: 4400000,
    status: "cancelled",
    note: "Khách huỷ",
  },
  {
    id: "NK007",
    product: "Nike Blazer Mid",
    emoji: "🟠",
    size: "41",
    color: "Orange",
    qty: 1,
    customer: "Đỗ Ngọc Linh",
    email: "linh.do@gmail.com",
    phone: "0912000111",
    address: "38 Trần Phú, Hải Phòng",
    date: "2024-06-05T13:20:00",
    price: 2800000,
    status: "confirmed",
    note: "",
  },
  {
    id: "NK008",
    product: "Nike Cortez",
    emoji: "🌿",
    size: "38",
    color: "Green",
    qty: 2,
    customer: "Ngô Phương Thảo",
    email: "thao.ngo@gmail.com",
    phone: "0989876543",
    address: "55 Ngô Gia Tự, Hà Nội",
    date: "2024-06-05T17:00:00",
    price: 5600000,
    status: "shipping",
    note: "",
  },
  {
    id: "NK009",
    product: "Air Max Muse",
    emoji: "💜",
    size: "37",
    color: "Purple",
    qty: 1,
    customer: "Bùi Khánh Linh",
    email: "linh.bui@gmail.com",
    phone: "0900123123",
    address: "14 Lê Lợi, Huế",
    date: "2024-06-06T09:00:00",
    price: 3800000,
    status: "pending",
    note: "Gói quà",
  },
  {
    id: "NK010",
    product: "Nike Vomero 18",
    emoji: "⚪",
    size: "43",
    color: "Grey/White",
    qty: 1,
    customer: "Nguyễn Xuân An",
    email: "an.nguyen@gmail.com",
    phone: "0956789012",
    address: "77 Hai Bà Trưng, Hà Nội",
    date: "2024-06-06T11:30:00",
    price: 4100000,
    status: "delivered",
    note: "",
  },
];

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const initial = DEMO_ORDERS.map((o) => ({ ...o }));
  saveOrders(initial);
  return initial;
}
function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

let allOrders = loadOrders();
let currentFilter = "all";
let currentSort = "newest";
let currentSearch = "";
let currentPage = 1;
let editingId = null;

// ── SYNC with customer orders (localStorage key: cart_orders) ──
function syncCustomerOrders() {
  try {
    // Try known keys used in Nike JS projects
    const keys = ["orders", "cart_orders", "nike_orders", "placed_orders"];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr) || arr.length === 0) continue;
      arr.forEach((co) => {
        const exists = allOrders.find((o) => o.id === (co.id || co.orderId));
        if (!exists) {
          allOrders.push({
            id: co.id || co.orderId || "NK" + Date.now(),
            product: co.product || co.name || "Sản phẩm",
            emoji: "👟",
            size: co.size || "N/A",
            color: co.color || "N/A",
            qty: co.qty || co.quantity || 1,
            customer: co.customer || co.name || "Khách hàng",
            email: co.email || "",
            phone: co.phone || "",
            address: co.address || "",
            date: co.date || new Date().toISOString(),
            price: co.price || co.total || 0,
            status: "pending",
            note: co.note || "",
          });
        }
      });
    }
    saveOrders(allOrders);
  } catch (e) {}
}

// ── COMPUTED ──
function getFiltered() {
  let list = [...allOrders];
  if (currentFilter !== "all")
    list = list.filter((o) => o.status === currentFilter);
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    list = list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q),
    );
  }
  list.sort((a, b) => {
    if (currentSort === "newest") return new Date(b.date) - new Date(a.date);
    if (currentSort === "oldest") return new Date(a.date) - new Date(b.date);
    if (currentSort === "price-high") return b.price - a.price;
    if (currentSort === "price-low") return a.price - b.price;
    return 0;
  });
  return list;
}

function fmtPrice(n) {
  return n.toLocaleString("vi-VN") + "₫";
}
function fmtDate(d) {
  const dt = new Date(d);
  return (
    dt.toLocaleDateString("vi-VN") +
    " " +
    dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  );
}

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã huỷ",
};

// ── RENDER ──
function render() {
  syncCustomerOrders();
  allOrders = loadOrders();

  // KPI
  const total = allOrders.length;
  const pending = allOrders.filter((o) => o.status === "pending").length;
  const shipping = allOrders.filter((o) => o.status === "shipping").length;
  const revenue = allOrders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + o.price, 0);
  document.getElementById("kpi-total").textContent = total;
  document.getElementById("kpi-pending").textContent = pending;
  document.getElementById("kpi-shipping").textContent = shipping;
  document.getElementById("kpi-revenue").textContent = fmtPrice(revenue);
  document.getElementById("badge-orders").textContent = pending;

  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const page = filtered.slice(start, start + ITEMS_PER_PAGE);

  document.getElementById("order-count-label").textContent =
    filtered.length > 0 ? `(${filtered.length} đơn)` : "";

  const tbody = document.getElementById("orders-tbody");
  const empty = document.getElementById("empty-state");
  tbody.innerHTML = "";

  if (page.length === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
    page.forEach((o) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="order-id">${o.id}<br/><span>${fmtDate(o.date)}</span></div>
        </td>
        <td>
          <div class="product-cell">
            <div class="product-thumb">${o.emoji}</div>
            <div>
              <div class="product-name">${o.product}</div>
              <div class="product-meta">Size ${o.size} · ${o.color} · SL: ${o.qty}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="customer-cell">
            <div class="cname">${o.customer}</div>
            <div class="cemail">${o.email || o.phone}</div>
          </div>
        </td>
        <td>${fmtDate(o.date)}</td>
        <td><div class="price-cell">${fmtPrice(o.price)}</div></td>
        <td><span class="status-badge ${o.status}">${STATUS_LABELS[o.status]}</span></td>
        <td>
          <div class="action-btns">
            <div class="act-btn view" title="Xem chi tiết" onclick="openModal('${o.id}')"><i class="fa-solid fa-eye"></i></div>
            <div class="act-btn edit" title="Đổi trạng thái" onclick="quickEdit('${o.id}')"><i class="fa-solid fa-pen"></i></div>
            <div class="act-btn del" title="Xoá đơn" onclick="deleteOrder('${o.id}')"><i class="fa-solid fa-trash"></i></div>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // Pagination
  document.getElementById("page-info").textContent =
    `Hiển thị ${start + 1}–${Math.min(start + ITEMS_PER_PAGE, filtered.length)} của ${filtered.length} đơn hàng`;
  const pbEl = document.getElementById("page-btns");
  pbEl.innerHTML = "";
  const prev = document.createElement("button");
  prev.className = "page-btn";
  prev.textContent = "‹";
  prev.disabled = currentPage <= 1;
  prev.onclick = () => {
    currentPage--;
    render();
  };
  pbEl.appendChild(prev);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.textContent = i;
    btn.onclick = (() => {
      const pg = i;
      return () => {
        currentPage = pg;
        render();
      };
    })();
    pbEl.appendChild(btn);
  }
  const next = document.createElement("button");
  next.className = "page-btn";
  next.textContent = "›";
  next.disabled = currentPage >= totalPages;
  next.onclick = () => {
    currentPage++;
    render();
  };
  pbEl.appendChild(next);
}

// ── FILTER / SEARCH ──
function filterStatus(s, el) {
  currentFilter = s;
  currentPage = 1;
  document
    .querySelectorAll(".filter-tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  render();
}
function filterSort(v) {
  currentSort = v;
  currentPage = 1;
  render();
}
function handleSearch() {
  currentSearch = document.getElementById("search-input").value;
  currentPage = 1;
  render();
}

// ── MODAL ──
function openModal(id) {
  const o = allOrders.find((x) => x.id === id);
  if (!o) return;
  editingId = id;
  document.getElementById("modal-title").textContent = `Đơn hàng · ${o.id}`;
  document.getElementById("modal-body").innerHTML = `
    <div class="detail-row"><div class="detail-label">Sản phẩm</div><div class="detail-value">${o.emoji} ${o.product} – Size ${o.size} – ${o.color} × ${o.qty}</div></div>
    <div class="detail-row"><div class="detail-label">Khách hàng</div><div class="detail-value">${o.customer}</div></div>
    <div class="detail-row"><div class="detail-label">Email</div><div class="detail-value">${o.email || "—"}</div></div>
    <div class="detail-row"><div class="detail-label">Điện thoại</div><div class="detail-value">${o.phone || "—"}</div></div>
    <div class="detail-row"><div class="detail-label">Địa chỉ</div><div class="detail-value">${o.address || "—"}</div></div>
    <div class="detail-row"><div class="detail-label">Ngày đặt</div><div class="detail-value">${fmtDate(o.date)}</div></div>
    <div class="detail-row"><div class="detail-label">Tổng tiền</div><div class="detail-value" style="color:var(--nike-red);font-weight:700;font-size:16px">${fmtPrice(o.price)}</div></div>
    <div class="detail-row"><div class="detail-label">Ghi chú</div><div class="detail-value">${o.note || "—"}</div></div>
    <hr class="divider"/>
    <div class="detail-row">
      <div class="detail-label">Trạng thái</div>
      <div class="detail-value">
        <select class="status-select" id="status-edit">
          ${Object.entries(STATUS_LABELS)
            .map(
              ([k, v]) =>
                `<option value="${k}" ${k === o.status ? "selected" : ""}>${v}</option>`,
            )
            .join("")}
        </select>
      </div>
    </div>`;
  document.getElementById("modal-overlay").classList.add("open");
}
function closeModal(e) {
  if (e.target === document.getElementById("modal-overlay")) closeModalDirect();
}
function closeModalDirect() {
  document.getElementById("modal-overlay").classList.remove("open");
  editingId = null;
}
function saveStatus() {
  if (!editingId) return;
  const newStatus = document.getElementById("status-edit").value;
  const idx = allOrders.findIndex((o) => o.id === editingId);
  if (idx !== -1) {
    allOrders[idx].status = newStatus;
    saveOrders(allOrders);
    toast("✅ Đã cập nhật trạng thái: " + STATUS_LABELS[newStatus]);
    closeModalDirect();
    render();
  }
}

// ── QUICK EDIT (cycle status) ──
const STATUS_CYCLE = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
];
function quickEdit(id) {
  const o = allOrders.find((x) => x.id === id);
  if (!o) return;
  const ci = STATUS_CYCLE.indexOf(o.status);
  o.status = STATUS_CYCLE[(ci + 1) % STATUS_CYCLE.length];
  saveOrders(allOrders);
  toast("🔄 " + o.id + " → " + STATUS_LABELS[o.status]);
  render();
}

// ── DELETE ──
function deleteOrder(id) {
  if (!confirm("Xoá đơn hàng " + id + "?")) return;
  allOrders = allOrders.filter((o) => o.id !== id);
  saveOrders(allOrders);
  toast("🗑️ Đã xoá đơn " + id, true);
  render();
}

// ── TOAST ──
function toast(msg, isErr = false) {
  const el = document.createElement("div");
  el.className = "toast" + (isErr ? " error" : "");
  el.textContent = msg;
  document.getElementById("toast-area").appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── NOTIFICATION ──
function showNotif() {
  const pending = allOrders.filter((o) => o.status === "pending").length;
  toast(`🔔 Có ${pending} đơn hàng đang chờ xử lý`);
  document.getElementById("notif-dot").style.display = "none";
}

// ── EXPORT CSV ──
function exportCSV() {
  const headers = [
    "Mã đơn",
    "Sản phẩm",
    "Size",
    "Màu",
    "SL",
    "Khách hàng",
    "Email",
    "SĐT",
    "Địa chỉ",
    "Ngày đặt",
    "Tổng tiền",
    "Trạng thái",
    "Ghi chú",
  ];
  const rows = allOrders.map((o) => [
    o.id,
    o.product,
    o.size,
    o.color,
    o.qty,
    o.customer,
    o.email,
    o.phone,
    `"${o.address}"`,
    fmtDate(o.date),
    o.price,
    STATUS_LABELS[o.status],
    `"${o.note}"`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "nike_orders.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast("📊 Đã xuất file CSV thành công");
}

// ── PAGE SWITCH (stub) ──
function switchPage(page) {
  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));
  event.currentTarget.classList.add("active");
  if (page !== "orders")
    toast('ℹ️ Chức năng "' + page + '" đang phát triển...');
}

// ── INIT ──
render();

// Auto-refresh every 10s to pick up customer orders
setInterval(() => {
  syncCustomerOrders();
  const before = allOrders.length;
  allOrders = loadOrders();
  if (allOrders.length > before) {
    toast("🛎️ Có đơn hàng mới từ khách!");
    render();
  }
}, 10000);
