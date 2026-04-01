require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productsRouter = require("./routes/products");
app.use("/api/products", productsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Server
const PORT = process.env.PORT || 5000;

// ⭐ IMPORTANT: Bind to 0.0.0.0 so Expo can reach it
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
