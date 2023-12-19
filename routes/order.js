const express = require("express");
const router = express.Router();
const db = require("../config/mysql");
const Sequelize = require("sequelize");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const { verifyToken } = require("../controller/user");

// View orders
router.get("/", verifyToken, async (req, res) => {
    let userId= req.user.id;

    const orders = await Cart.findAll({
        where: {
            userId,
            orderMade: true
        }
    });

    res.json({success: true, orders});
});

router.post("/", async (req, res) => {
    let userId = req.user.id;
    const {items} = req.body;

    // fetch the currently live cart
    const order = await Cart.findOne({
        where: {
            userId,
            orderMade: false
        }
    });
        
    order.orderMade = true;
    order.orderedAt = new Date();

    const totalPriceQuery = `SELECT SUM(totalPrice) AS total FROM cart_item WHERE cartId = ${order.id}`;
    const totalPriceResult = await Sequelize.query(totalPriceQuery, { type: Sequelize.QueryTypes.SELECT });

    order.totalPrice = totalPriceResult.total;

    res.json({message: "Order executed successfully", success: true});
});


module.exports = router;
