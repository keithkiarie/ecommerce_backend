const Sequelize = require("sequelize");
const db = require("../config/mysql");

const User = db.define("cart_item", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cartId: {
    type: Sequelize.INTEGER,
  },
  productId: {
    type: Sequelize.INTEGER,
  },
  quantity: {
    type: Sequelize.INTEGER,
  },
  // to remember the price when the product was put in the cart
  totalPrice: {
    type: Sequelize.DOUBLE,
  },
});

User.sync().then(() => {
  console.log("cart_item table synced");
});
module.exports = User;
