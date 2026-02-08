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
async function loadProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  const products = await res.json();

  const table = document.getElementById("inventory");

  table.innerHTML = "";

  products.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.quantity}</td>
      </tr>
    `;
  });
}

