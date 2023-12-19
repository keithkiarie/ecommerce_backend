const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");


dotenv.config();

const filePath = path.join(__dirname, "..", "dbConnection.json");
dbConfigs = JSON.parse(fs.readFileSync(filePath, "utf-8"));

module.exports = new Sequelize(dbConfigs.dbName, dbConfigs.username, dbConfigs.password, {
    host: dbConfigs.host,
    dialect: "mysql",
    operatorAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    define: {
        freezeTableName: true
    }

})