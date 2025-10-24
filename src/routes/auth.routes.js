const express = require("express");
const router = express.Router();
const userModels = require("../models/userModel");
const bcrypt = require("../utils/bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        succes: false,
        message: "Username, password y email son requridos",
      });
    }

    const userExists = await userModels.getUserByEmail(email);
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "El email ya está en uso",
      });
    }

    const hashedPassword = await bcrypt.hashPassword(password);

    const newUser = userModels.createUser({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      user: newUser,
    });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
});

module.exports = router;
