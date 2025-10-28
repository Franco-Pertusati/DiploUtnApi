const express = require('express');
const router = express.Router();
const secured = require("../middlewares/secured")

const authRoutes = require("./auth.routes")
const changelogRoutes = require("./changelogs.routes")


router.use("/auth", authRoutes)
router.use("/changelog", changelogRoutes)

router.use("/status", (req, res) => {
    res.status(200).json({
        message: "API en funcionamiento"
    })
})

router.use("/verify")

module.exports = router;