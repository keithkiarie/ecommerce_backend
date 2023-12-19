const Sequelize = require("sequelize");
const db = require("../config/mysql");

const User = db.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
  },
  orderedMade: {
    type: Sequelize.BOOLEAN,
  },
  orderedAt: {
    type: Sequelize.DATE
  }
});

User.sync().then(() => {
  console.log("cart table synced");
});
module.exports = User;
