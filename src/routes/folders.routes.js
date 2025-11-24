const express = require("express");
const router = express.Router();
const foldersController = require("../controllers/folderController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/", foldersController.getFolders);
router.get("/:id", foldersController.getFolder);
router.post("/", foldersController.createFolder);
router.put("/:id", foldersController.updateFolder);
router.delete("/:id", foldersController.deleteFolder);

router.get("/:id/content", foldersController.getFolderContent);

module.exports = router;