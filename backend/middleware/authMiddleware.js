const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const cleanToken = token.split(" ")[1]; // remove "Bearer"

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    req.user = decoded; // contains user id
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;