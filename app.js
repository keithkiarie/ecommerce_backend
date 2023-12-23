const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

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

const PORT = process.env.PORT || 4000;

// swagger set up
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce',
      version: '1.0.0',
      description: 'Ecommerce site',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: [path.join(__dirname, "routes", "*.js")],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// ROUTES
app.use("/api/cart", require("./routes/cart"));
app.use("/api/category", require("./routes/category"));
app.use("/api/order", require("./routes/order"));
app.use("/api/product", require("./routes/product"));
app.use("/api/user", require("./routes/user"));


// any other route
app.get('*', function(req, res){
  res.status(404).json({success: false, message: "Page not found"});
});


app.listen(PORT, console.log(`Server started on port ${PORT}`));
