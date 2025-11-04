const express = require("express");
const router = express.Router();
const userModels = require("../models/userModel");
const bcrypt = require("../middlewares/bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Username, password y email son requeridos",
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
    const userId = await userModels.createUser({
      email,
      username,
      password: hashedPassword,
    });

    req.session.id_user = userId;

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      user: {
        id: userId,
        username: username,
        email: email
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

    req.session.id_user = user.id;

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      user: {
        id: user.id,
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

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al cerrar sesión",
      });
    }
    res.status(200).json({
      success: true,
      message: "Sesión cerrada exitosamente",
    });
  });
});

router.get("/verify", (req, res) => {
  if (req.session.id_user) {
    res.status(200).json({
      success: true,
      message: "Sesión activa",
      userId: req.session.id_user
    });
  } else {
    res.status(401).json({
      success: false,
      message: "No hay sesión activa",
    });
  }
});

module.exports = router;