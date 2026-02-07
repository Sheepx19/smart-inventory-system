const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ADD product
router.post("/", async (req, res) => {
  const { name, price, barcode, quantity } = req.body;

  if (!name || quantity == null) {
    return res.status(400).json({ error: "Name and quantity required" });
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

// STOCK IN
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

    res.json({ message: "Stock increased" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process stock in" });
  }
});


// STOCK OUT
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

    res.json({ message: "Stock decreased" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process stock out" });
  }
});


module.exports = router;
