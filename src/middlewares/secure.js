const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

secured = async (req, res, next) => {
  try {
    if (req.session.id_user) {
      next();
    } else {
      res.status(401).json({
        message: "Usiario con sesion no iniciada",
      });
    }
  } catch(error) {
    console.log(error)
  }
};

module.exports = secured