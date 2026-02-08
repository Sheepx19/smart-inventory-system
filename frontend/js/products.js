async function loadProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  const products = await res.json();

  const table = document.getElementById("inventory");

  table.innerHTML = `
    <tr>
      <th>Product Name</th>
      <th>Quantity</th>
    </tr>
  `;

  products.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.quantity}</td>
      </tr>
    `;
  });
}

loadProducts();
