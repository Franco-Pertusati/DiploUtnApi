const { verifyToken } = require("../config/jwt");
const { getUserById } = require("../models/usersModel");
const { registerUser, loginUser } = require("../services/authService");

async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const { user, token } = await registerUser({ username, email, password });
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ user, message: "Registration successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUser({ email, password });
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ user, message: "Login successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function verify(req, res) {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    verifyToken(token);
    return res.json({ valid: true });
  } catch (err) {
    return res
      .status(401)
      .json({ valid: false, message: "Invalid or expired token" });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getUserInfo(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "No user information available" });
    }
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { register, login, verify, logout, getUserInfo };
