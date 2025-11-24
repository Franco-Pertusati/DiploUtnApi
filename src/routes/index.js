const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const changelogRoutes = require("./changelogs.routes");
const notesRoutes = require("./notes.routes");
const foldersRoutes = require("./folders.routes")

router.use("/auth", authRoutes);
router.use("/changelog", changelogRoutes);
router.use("/folders", foldersRoutes);
router.use("/notes", notesRoutes);

router.use("/status", (req, res) => {
  res.status(200).json({
    message: "API en funcionamiento",
  });
});

module.exports = router;
