const { generateToken } = require(".././config/jwt");
const { hashPassword, comparePassword } = require(".././middlewares/bcrypt");
const { createUser, getUserById, getUserByEmail } = require("../models/userModel");

async function registerUser({ username, email, password }) {
  if (typeof email !== "string" || !email.trim()) {
    throw new Error("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (typeof password !== "string") {
    throw new Error("Password must be a string");
  }

  if (!password.trim()) {
    throw new Error("Password is required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const hashed = await hashPassword(password);

  const user = await createUser({username, password: hashed, email})

  const token = generateToken(
    { id: user.id, email: user.email },
    { expiresIn: "1h" }
  );

  return {
    user: { id: user.id, username: user.username, email: user.email },
    token,
  };
}

async function loginUser({ email, password }) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({ id: user.id, email: user.email });

  return {
    user: { id: user.id, username: user.username, email: user.email },
    token,
  };
}

module.exports = { registerUser, loginUser };
