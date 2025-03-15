const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const router = express.Router();

// Public routes
router.get("/register", (req, res) => {
  res.json({
    name: "Register",
  });
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
