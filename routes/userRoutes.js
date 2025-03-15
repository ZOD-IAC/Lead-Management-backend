const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

// Public routes
router.get("/register", (req, res) => {
  res.json({
    name: "Register",
  });
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;
