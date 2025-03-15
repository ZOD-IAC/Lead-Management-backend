const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

module.exports.isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "unauthorized" });

  try {
    const decode = jwt.decode(token, process.env.JWT_KEY);
    const user = await userModel.findById(decode.id).select("-password");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports.checkRole = (roles) => async (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(400).json({ message: "Not Allowed" });
  }
  next();
};
