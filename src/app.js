const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.use(cookieParser());

app.use("/", routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;
