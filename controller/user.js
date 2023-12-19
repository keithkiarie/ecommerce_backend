const jwt = require("jsonwebtoken");

const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );14
};

const verifyToken = (req, res, next) => {
  const config = process.env;
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({message: "A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({message: "Invalid Token"});
  }
  return next();
};

module.exports = {
  isValidEmail,
  verifyToken,
};
