const express = require("express");
const router = express.Router();
const db = require("../config/mysql");
const Sequelize = require("sequelize");
const Category = require("../models/Category");
const { verifyToken } = require("../controller/user");

// Get all categories
router.get("/all", (req, res) =>
Category.findAll()
    .then((categories) => res.json({categories, success: true,}))
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Unable to fetch categories ${err}`,
      });
    })
);

module.exports = router;
