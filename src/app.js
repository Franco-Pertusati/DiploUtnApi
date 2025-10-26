const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());

app.use("/", routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;
