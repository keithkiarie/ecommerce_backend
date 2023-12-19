const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Database
const db = require("./config/mysql");

// Connect to the DB
db
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/api/cart", require("./routes/cart"));
app.use("/api/category", require("./routes/category"));
app.use("/api/order", require("./routes/order"));
app.use("/api/product", require("./routes/product"));
app.use("/api/user", require("./routes/user"));

// last route
app.get('*', function(req, res){
    res.status(404).json({success: false, message: "Page not found"});
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
