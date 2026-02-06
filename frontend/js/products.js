const products = [
  { name: "Milk", quantity: 20 },
  { name: "Bread", quantity: 15 },
  { name: "Eggs", quantity: 30 }
];

const list = document.getElementById("product-list");

products.forEach(product => {
  const li = document.createElement("li");
  li.textContent = `${product.name} - Quantity: ${product.quantity}`;
  list.appendChild(li);
});
