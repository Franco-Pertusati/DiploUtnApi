const express = require('express');
const router = express.Router();
const authRoutes = require("./auth.routes")

router.use("/auth", authRoutes)
router.use("/status", (req, res) => {
    res.status(200).json({
        message: "API en funcionamiento"
    })
})

module.exports = router;