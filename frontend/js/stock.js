const form = document.getElementById("stockForm");
const error = document.getElementById("error");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const product = document.getElementById("product").value;
  const action = document.getElementById("action").value;
  const quantity = document.getElementById("quantity").value;

  if (!product || !action || quantity === "" || quantity <= 0) {
    error.textContent = "Please fill out all fields correctly.";
    return;
  }

  error.textContent = "";
  console.log({ product, action, quantity });

  alert("Stock updated (check console)");
  form.reset();
});
async function stockIn() {
  const data = {
    productId: document.getElementById("id").value,
    quantity: document.getElementById("qty").value
  };

  await fetch("http://localhost:5000/api/products/stock-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  loadProducts();
}
