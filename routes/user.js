const express = require("express");
const router = express.Router();
const db = require("../config/mysql");
const User = require("../models/User");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { isValidEmail } = require("../controller/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../controller/user");


// Register a user
router.post("/register", async (req, res) => {

  let body = req.body;
  let { firstName, lastName, email, password } = body;
  const errors = [];

  // Validate Fields
  if (!firstName) errors.push("Please add the first name");
  if (!lastName) errors.push("Please add the last name");
  if (!email) errors.push("Please add the email");
  if (!password) errors.push("Please add the password");
  if (!isValidEmail(email)) errors.push("Invalid email");
  if (password?.length < 5) errors.push("Password is too short");

  // Check for errors
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(". "),
    });
  }

  password = await bcrypt.hash(password, 10);

  // check if record already exists
  const existingRecord = await User.findOne({ where: { email } });
  if (existingRecord) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists",
    });
  }

  // Insert into table
  User.create({
    firstName,
    lastName,
    email,
    role,
    password,
  })
    .then((user) => {
      res.json({
        success: true,
        id: user.id,
        message: "User created.",
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Unable to create user ${err}`,
      });
    });
});

// log in a user
router.post("/login", async (req, res) => {
  let body = req.body;

  let { email, password } = body;
  const errors = [];

  // Validate Fields
  if (!email) errors.push("Please fill in the email");
  if (!password) errors.push("Please fill in the password");

  // Check for errors
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
    });
  }

  const foundUser = await User.findOne({ where: { email: email } });

  if (!foundUser) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  if (!foundUser.active) {
    return res.status(422).json({
      success: false,
      message: "User account has been disabled",
    });
  }

  const isValidCredentials = await bcrypt.compare(password, foundUser.password);

  if (!isValidCredentials) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }


  const token = jwt.sign(
    { userId: foundUser.id, email: foundUser.email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );

  // successful log in
  res.json({
    success: true,
    token: token,
    tokenExpiration: 7200, // in seconds
    email: foundUser.email,
  });
});

router.put("/update", verifyToken, async (req, res) => {
    
  
    let body = req.body;
    let { id, firstName, lastName, email, password, active } = body;

    if (req.user.id != id)
      return res.status(403).json({
        success: false,
        message: `Log in with account id ${id} in order to edit its details.`,
      });

    const errors = [];
  
    // Validate Fields
    if (!id) errors.push("Please add the user id");
    if (email && !isValidEmail(email)) errors.push("Invalid email");
    if (password && password?.length < 5) errors.push("Password is too short");

    // Check for errors
    if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: errors[0],
        });
      }

    const changeItems = {};
    if(firstName) changeItems.firstName = firstName;
    if(lastName) changeItems.lastName = lastName;
    if(email) changeItems.email = email;
    if(password) changeItems.password = password;
    if(active === true || active === false) changeItems.active = active;
  
  
    // check if user exists
    const existingRecord = await User.findOne({ where: { id } });
    if (!existingRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }
  
    await User.update(
      changeItems,
      {
        where: {
          id,
        },
      }
    )
      .then((user) => {
        res.json({
          success: true,
          id: user.id,
          message: `Details updated successfully"}.`,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: `Unable to update user details. Error: ${err}`,
        });
      });
  });

module.exports = router;
