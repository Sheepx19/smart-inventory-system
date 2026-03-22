const form = document.getElementById("stockForm");
const dropdown = document.getElementById("product");

function showBanner(message, type = "success") {
  const banner = document.getElementById("banner");
  banner.textContent = message;
  banner.className = `banner show ${type}`;
  setTimeout(() => banner.classList.remove("show"), 3000);
}

function showError(msg) { showBanner(msg, "error"); }
function showSuccess(msg) { showBanner(msg, "success"); }
function showWarning(msg) { showBanner(msg, "warning"); }

// Load products into dropdown
async function loadProductsDropdown() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const products = await res.json();

    dropdown.innerHTML = '<option value="">Select product</option>';

    products.forEach(p => {
      const option = document.createElement("option");
      option.value = p.product_id;          // ✅ FIXED
      option.textContent = p.name;
      dropdown.appendChild(option);
    });
  } catch {
    showError("Failed to load products.");
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const productId = dropdown.value;
  const action = document.getElementById("action").value;
  const quantity = Number(document.getElementById("quantity").value);

  if (!productId || !action || quantity <= 0) {
    showError("Please fill out all fields correctly.");
    return;
  }

  const data = { productId, quantity };

  let url = "";
  if (action === "IN") url = "http://localhost:5000/api/products/stock-in";
  if (action === "OUT") url = "http://localhost:5000/api/products/stock-out";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      showSuccess("Stock updated!");
      if (result.lowStock) showWarning("⚠ Low stock!");
      form.reset();
    } else {
      showError(result.error || "Something went wrong.");
    }
  } catch {
    showError("Server unavailable.");
  }
});

// Load dropdown on page load
loadProductsDropdown();
