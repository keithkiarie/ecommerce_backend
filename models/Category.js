const Sequelize = require("sequelize");
const db = require("../config/mysql");

const User = db.define("category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
});

User.sync().then(() => {
  console.log("category table synced");
});
module.exports = User;
