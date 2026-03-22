const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by barcode
router.get("/barcode/:code", async (req, res) => {
  const { code } = req.params;

  if (!code || code.trim() === "") {
    return res.status(400).json({ error: "Invalid barcode" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE barcode = ? LIMIT 1",
      [code]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  const { name, price, barcode, quantity } = req.body;

  if (!name || quantity == null) {
    return res.status(400).json({ error: "Name and quantity are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO products (name, price, barcode, quantity) VALUES (?, ?, ?, ?)",
      [name, price || null, barcode || null, quantity]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      price,
      barcode,
      quantity
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Low-stock check helper
async function checkLowStock(productId) {
  const [rows] = await db.query(
    "SELECT quantity, low_stock_threshold FROM products WHERE product_id = ?",
    [productId]
  );

  if (!rows.length) return false;

  return rows[0].quantity < rows[0].low_stock_threshold;
}

// Update stock using barcode
router.post("/update-by-barcode", async (req, res) => {
  const { barcode, quantityChange } = req.body;

  if (!barcode || barcode.trim() === "") {
    return res.status(400).json({ error: "Invalid barcode" });
  }

  if (quantityChange == null || isNaN(quantityChange)) {
    return res.status(400).json({ error: "Quantity must be a number" });
  }

  if (Number(quantityChange) === 0) {
    return res.status(400).json({ error: "Quantity cannot be zero" });
  }

  try {
    const [rows] = await db.query(
      "SELECT product_id, quantity FROM products WHERE barcode = ? LIMIT 1",
      [barcode]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productId = rows[0].product_id;

    await db.query(
      "UPDATE products SET quantity = quantity + ? WHERE product_id = ?",
      [quantityChange, productId]
    );

    await db.query(
      "INSERT INTO `transaction` (product_id, transaction_type, quantity) VALUES (?, ?, ?)",
      [
        productId,
        quantityChange > 0 ? "IN" : "OUT",
        Math.abs(quantityChange)
      ]
    );

    const lowStock = await checkLowStock(productId);

    res.json({ message: "Stock updated successfully", lowStock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

// Stock In
router.post("/stock-in", async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    await db.query(
      "UPDATE products SET quantity = quantity + ? WHERE product_id = ?",
      [quantity, productId]
    );

    await db.query(
      "INSERT INTO `transaction` (product_id, transaction_type, quantity) VALUES (?, 'IN', ?)",
      [productId, quantity]
    );

    const lowStock = await checkLowStock(productId);

    res.json({ message: "Stock increased", lowStock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process stock in" });
  }
});

// Stock Out
router.post("/stock-out", async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const [rows] = await db.query(
      "SELECT quantity FROM products WHERE product_id = ?",
      [productId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (rows[0].quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    await db.query(
      "UPDATE products SET quantity = quantity - ? WHERE product_id = ?",
      [quantity, productId]
    );

    await db.query(
      "INSERT INTO `transaction` (product_id, transaction_type, quantity) VALUES (?, 'OUT', ?)",
      [productId, quantity]
    );

    const lowStock = await checkLowStock(productId);

    res.json({ message: "Stock decreased", lowStock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process stock out" });
  }
});

module.exports = router;
