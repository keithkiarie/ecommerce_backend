const Sequelize = require("sequelize");
const db = require("../config/mysql");

const User = db.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.DOUBLE,
  },
  description: {
    type: Sequelize.STRING,
  },
  categoryId: {
    type: Sequelize.INTEGER,
  },
  available: {
    type: Sequelize.BOOLEAN,
  },
});

User.sync().then(() => {
  console.log("product table synced");
});
module.exports = User;
