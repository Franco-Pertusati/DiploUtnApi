const express = require('express');
const router = express.Router();
const { secured } = require("../middlewares/secured")

const authRoutes = require("./auth.routes")
const changelogRoutes = require("./changelogs.routes")


router.use("/auth", authRoutes)
router.use("/changelog", secured,  changelogRoutes)

router.use("/status", (req, res) => {
    res.status(200).json({
        message: "API en funcionamiento"
    })
})

module.exports = router;