const express = require("express");
const router = express.Router();
const { register, login, verify, logout, getUserInfo } = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verify);
router.post("/logout", logout);
router.get("/user-info", authMiddleware, getUserInfo);

module.exports = router;
