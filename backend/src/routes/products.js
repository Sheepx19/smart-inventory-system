console.log("Products router loaded!");
const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// 📊 DASHBOARD ROUTES (MUST BE FIRST)
// ===============================
router.get("/dashboard/total-products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM products");
    res.json({ count: rows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total products" });
  }
});

router.get("/dashboard/low-stock", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS lowStock FROM products WHERE quantity < 10"
    );
    res.json({ count: rows[0].lowStock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch low stock count" });
  }
});

// ===============================
// GET ALL PRODUCTS
// ===============================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ===============================
// GET PRODUCT BY BARCODE
// ===============================
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

// ===============================
// ADD NEW PRODUCT
// ===============================
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

    return res.status(201).json({
      message: "Product added successfully",
      id: result.insertId,
      name,
      price,
      barcode,
      quantity
    });

  } catch (err) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Barcode already exists" });
    }

    return res.status(500).json({ error: "Failed to add product" });
  }
});

// ===============================
// LOW STOCK CHECK HELPER
// ===============================
async function checkLowStock(productId) {
  const [rows] = await db.query(
    "SELECT quantity, low_stock_threshold FROM products WHERE product_id = ?",
    [productId]
  );

  if (!rows.length) return false;

  return rows[0].quantity < rows[0].low_stock_threshold;
}

// ===============================
// UPDATE STOCK BY BARCODE
// ===============================
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

// ===============================
// STOCK IN
// ===============================
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

// ===============================
// STOCK OUT
// ===============================
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

// ===============================
// GET PRODUCT BY ID (MUST BE LAST)
// ===============================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE product_id = ? LIMIT 1",
      [id]
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

module.exports = router;
