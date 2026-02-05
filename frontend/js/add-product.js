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
