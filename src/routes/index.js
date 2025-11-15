const express = require('express');
const router = express.Router();
const authRoutes = require("./auth.routes")
const changelogRoutes = require("./changelogs.routes")
const isDev = process.env.NODE_ENV !== 'production'


router.use("/auth", authRoutes)

router.use("/changelog",  changelogRoutes)

router.use("/status", (req, res) => {
    res.status(200).json({
        message: "API en funcionamiento"
    })
})

module.exports = router;