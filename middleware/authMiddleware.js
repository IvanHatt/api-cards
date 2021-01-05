const jwt = require("jsonwebtoken");
const config = require("config");

/// if token ok, passes the info in token to the next handler
function authMiddleware(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Acces Denied. No Token");

  try {
    const userDecoded = jwt.verify(token, config.get("jwtKey")); //returns decoded token
    req.user = userDecoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
}

exports.authMiddleware = authMiddleware;
