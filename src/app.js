const express = require("express");
const routes = require("./routes");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. LUEGO el middleware de sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 
    }
  })
);

app.use("/", routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;
