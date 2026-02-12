const form = document.getElementById("addProductForm");
const error = document.getElementById("error");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  addProduct(); // <-- THIS is the missing piece
});

async function addProduct() {
  const name = document.getElementById("name").value.trim();
  const quantity = document.getElementById("quantity").value;
  const price = document.getElementById("price").value;

  if (!name || quantity === "" || quantity < 0) {
    error.textContent = "Please enter a valid name and quantity.";
    return;
  }

  const data = { name, quantity, price };

  const res = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (res.ok) {
    alert("Product added!");
    form.reset();
  } else {
    alert(result.message);
  }
}
