const session = require("express-session");

const secured = async (req, res, next) => {
  try {
    if (req.session.id_user) {
      next();
    } else {
      res.status(401).json({
        message: "Usuario con sesión no iniciada",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error en la autenticación",
    });
  }
};

module.exports = { secured };
