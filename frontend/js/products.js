async function loadProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  const data = await res.json();

  table.innerHTML = `
    <tr>
      <th>Product Name</th>
      <th>Quantity</th>
    </tr>
  `;

  data.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.quantity}</td>
      </tr>
    `;
  });
}

loadProducts();
