const express = require("express");
const router = express.Router();
const flashcardsController = require("../controllers/flashcardsController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.post("/", flashcardsController.createFlashcard);
router.get("/user/all", flashcardsController.getAllFlashcardsByUserId);
router.get("/note/:noteId", flashcardsController.getFlashcardsByNoteId);
router.get("/:id", flashcardsController.getFlashcardById);
router.put("/:id", flashcardsController.updateFlashcard);
router.delete("/:id", flashcardsController.deleteFlashcard);
router.put("/:id/review", flashcardsController.updateReviewData);

module.exports = router;
