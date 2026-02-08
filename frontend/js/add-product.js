const form = document.getElementById("addProductForm");
const error = document.getElementById("error");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const quantity = document.getElementById("quantity").value;

  if (!name || quantity === "" || quantity < 0) {
    error.textContent = "Please enter a valid name and quantity.";
    return;
  }

  error.textContent = "";
  console.log("Product added:", { name, quantity });

  alert("Product added (check console)");
  form.reset();
});
async function addProduct() {
  const data = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    quantity: document.getElementById("quantity").value
  };

  const res = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (res.ok) {
    alert("Product added!");
    loadProducts();
  } else {
    alert(result.message);
  }
}
