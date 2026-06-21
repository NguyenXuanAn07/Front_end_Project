// ── DATA LAYER ──
const STORAGE_KEY = "nike_admin_orders";
const ITEMS_PER_PAGE = 8;

async function loadOrders() {
  try {
    const response = await fetch("http://127.0.0.1:8000/cart/admin/orders");
    const data = await response.json();

    allOrders = data.map(function (o) {
      return {
        id: "NK" + o.id,
        product: o.product,
        emoji: "👟",
        size: "N/A",
        color: "N/A",
        qty: 1,
        customer: o.customer,
        email: o.email,
        phone: o.phone || "",
        address: o.address || "",
        date: o.created_at,
        price: o.total_amount,
        status: o.status,
        note: "",
      };
    });
  } catch (error) {
    console.log("Lỗi tải đơn hàng:", error);
    allOrders = [];
  }
}
function saveOrders(orders) {
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
async function render() {
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
async function init() {
  await loadOrders();
  render();
}
init();

// Auto-refresh mỗi 10s để cập nhật đơn hàng mới
setInterval(async function () {
  const before = allOrders.length;
  await loadOrders();
  if (allOrders.length !== before) {
    toast("🛎️ Đã cập nhật đơn hàng!");
  }
  render();
}, 10000);


