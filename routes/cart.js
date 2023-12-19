const express = require("express");
const router = express.Router();
const db = require("../config/mysql");
const Sequelize = require("sequelize");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const { verifyToken } = require("../controller/user");

// View cart
router.get("/", verifyToken, async (req, res) => {
    let userId= req.user.id;

    const cart = await Cart.findOne({
        where: {
            userId,
            orderMade: false
        }
    });

    if (!cart) return res.json({
        success: true,
        cartProducts: []
    });

    const cartProductsQuery = `SELECT cart_item.productId, cart_item.quantity, product.id, product.name, product.price, product.description, product.categoryId, FROM cart_item, product WHERE cartId = ${cart.id} AND cart_item.productId = product.id`;

    const cartProducts = await Sequelize.query(cartProductsQuery, { type: Sequelize.QueryTypes.SELECT });

    res.json({success: true, cartProducts});
});

router.put("/", async (req, res) => {
    let userId = req.user.id;
    const {items} = req.body;

    // check the input
    if(!Array.isArray(items)) {
        return res.status(400).json({
            success: false,
            message: "Invalid list of cart items",
          });
    }
        
    for (const item of items) {
        if(typeof item.productId !== 'number' || typeof item.quantity !== 'number') {
            return res.status(400).json({
                success: false,
                message: "Invalid product id or quantity in one or more of cart items",
              });
        }

        const product = await Product.findOne({
            where: {
                productId: item.productId
            }
        });
        
        if(!product) {
            return res.status(400).json({
                success: false,
                message: `Invalid product id ${item.productId}`,
              });
        }
    }

    const cart = await Cart.findOrCreate({ where: { userId, orderMade: false } });

    // create the cart items
    try {
        CartItem.bulkCreate(items.map((item) => {
            return {
                cartId: cart.id,
                productId: item.productId,
                quantity: item.quantity,
            }
        }))
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error inserting cart items ${err}`,
          });
    }
  

  res.json({message: "Cart items recorded successfully", success: true});
});


module.exports = router;
