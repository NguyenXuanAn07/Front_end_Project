/**
 * plp-render.js
 * Render danh sách sản phẩm (PLP) từ mảng dữ liệu PRODUCTS (products.js).
 */

(function () {
    const grid = document.getElementById("plp-grid");
    const plpCountEl = document.querySelector(".plp-count");

    function formatPrice(value) {
        return value.toLocaleString("vi-VN") + "₫";
    }

    function createProductCard(product) {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.id = product.id;

        const badgeHtml = product.badge
            ? `<p class="product-badge">${product.badge}</p>`
            : "";

        card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${product.img}" alt="${product.name}" loading="lazy" />
      </div>
      ${badgeHtml}
      <p class="product-name">${product.name}</p>
      <p class="product-type">${product.type}</p>
      <p class="product-price">${formatPrice(product.price)}</p>
    `;

        card.addEventListener("click", () => {
            window.location.href = `./product-detail.html?id=${product.id}`;
        });

        return card;
    }

    function renderList(list) {
        grid.innerHTML = "";
        if (plpCountEl) {
            plpCountEl.textContent = `(${list.length})`;
        }
        list.forEach((product) => {
            grid.appendChild(createProductCard(product));
        });
    }

    // Sort helper
    function sortProducts(list, value) {
        const copy = [...list];
        if (value === "newest") return copy.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        if (value === "price-high-low") return copy.sort((a, b) => b.price - a.price);
        if (value === "price-low-high") return copy.sort((a, b) => a.price - b.price);
        return copy; // featured: giữ nguyên thứ tự gốc
    }

    function init() {
        if (!grid) return;
        renderList(PRODUCTS);

        // Hook sort dropdown (nếu có trong trang)
        const sortMenu = document.getElementById("sort-menu");
        if (sortMenu) {
            sortMenu.querySelectorAll(".plp-sort-option").forEach((option) => {
                option.addEventListener("click", () => {
                    const currentFiltered = window.PLP._currentList || PRODUCTS;
                    window.PLP._currentList = currentFiltered;
                    renderList(sortProducts(currentFiltered, option.dataset.value));
                });
            });
        }
    }

    document.addEventListener("DOMContentLoaded", init);

    window.PLP = {
        renderList,
        PRODUCTS,
        _currentList: null,
        sortProducts,
    };
})();