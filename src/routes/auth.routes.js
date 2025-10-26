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
      user: {
        username: newUser.username,
        email: newUser.email
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json({
        success: false,
        message: "Email y password son requeridos",
      });
    }

    const user = await userModels.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    const passwordMatch = await bcrypt.comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      user: {
        username: user.username,
        email: user.email
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
});

module.exports = router;
