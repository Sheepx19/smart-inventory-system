const form = document.getElementById("stockForm");
const error = document.getElementById("error");
const dropdown = document.getElementById("product");

// Load products into dropdown
async function loadProductsDropdown() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const products = await res.json();

    dropdown.innerHTML = '<option value="">Select product</option>';

    products.forEach(p => {
      const option = document.createElement("option");
      option.value = p._id;      // ✅ FIX HERE
      option.textContent = p.name;
      dropdown.appendChild(option);
    });
  } catch {
    error.textContent = "Failed to load products.";
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const productId = dropdown.value;
  const action = document.getElementById("action").value;
  const quantity = Number(document.getElementById("quantity").value);

  if (!productId || !action || quantity <= 0) {
    error.textContent = "Please fill out all fields correctly.";
    return;
  }

  error.textContent = "";

  const data = { productId, quantity };

  let url = "";
  if (action === "IN") url = "http://localhost:5000/api/products/stock-in";
  if (action === "OUT") url = "http://localhost:5000/api/products/stock-out";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Stock updated!");
    form.reset();
  } else {
    const result = await res.json();
    alert(result.message);
  }
});

// Load dropdown on page load
loadProductsDropdown();
