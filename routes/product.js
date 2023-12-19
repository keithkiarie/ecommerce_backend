const express = require("express");
const router = express.Router();
const db = require("../config/mysql");
const Sequelize = require("sequelize");
const Product = require("../models/Product");
const { verifyToken } = require("../controller/user");

// Get all categories
router.get("/all", (req, res) =>
    Product.findAll()
    .then((products) => res.json({products, success: true,}))
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Unable to fetch products ${err}`,
      });
    })
);

router.get("/byProductId", async (req, res) => {
    let { id } = req.query;
    
  const product = await Product.findOne({ where: { id } });
  if (!existingRecord) {
    return res.status(400).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({product, success: true});
});

router.get("/byCategoryId", async (req, res) => {
    let { id } = req.query;
    
  const products = await Product.findAll({ where: { categoryId: id } });

  res.json({products, success: true});
});


module.exports = router;
