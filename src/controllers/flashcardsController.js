const flashcardsService = require("../services/flashcardsService");

class FlashcardsController {
  async createFlashcard(req, res) {
    try {
      const { note_id, question, answer } = req.body;
      // const user_id = req.user.id;

      const flashcard = await flashcardsService.createFlashcard({
        note_id,
        question,
        answer,
      });

      res.status(201).json({
        success: true,
        data: flashcard,
        message: "Flashcard creada exitosamente",
      });
    } catch (error) {
      console.error("Error en FlashcardsController.createFlashcard:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error al crear flashcard",
      });
    }
  }

  async getFlashcardsByNoteId(req, res) {
    try {
      const { noteId } = req.params;

      const flashcards = await flashcardsService.getFlashcardsByNoteId(noteId);

      res.status(200).json({
        success: true,
        data: flashcards,
      });
    } catch (error) {
      console.error("Error en FlashcardsController.getFlashcardsByNoteId:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error al obtener flashcards",
      });
    }

    console.log(res)
  }

  async getFlashcardById(req, res) {
    try {
      const { id } = req.params;

      const flashcard = await flashcardsService.getFlashcardById(id);

      res.status(200).json({
        success: true,
        data: flashcard,
      });
    } catch (error) {
      console.error("Error en FlashcardsController.getFlashcardById:", error);
      const statusCode = error.message === "Flashcard no encontrada" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Error al obtener flashcard",
      });
    }
  }

  async updateFlashcard(req, res) {
    try {
      const { id } = req.params;
      const { question, answer } = req.body;

      const flashcard = await flashcardsService.updateFlashcard(id, {
        question,
        answer,
      });

      res.status(200).json({
        success: true,
        data: flashcard,
        message: "Flashcard actualizada exitosamente",
      });
    } catch (error) {
      console.error("Error en FlashcardsController.updateFlashcard:", error);
      const statusCode = error.message === "Flashcard no encontrada" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Error al actualizar flashcard",
      });
    }
  }

  async deleteFlashcard(req, res) {
    try {
      const { id } = req.params;

      const result = await flashcardsService.deleteFlashcard(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Error en FlashcardsController.deleteFlashcard:", error);
      const statusCode = error.message === "Flashcard no encontrada" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Error al eliminar flashcard",
      });
    }
  }

  async getAllFlashcardsByUserId(req, res) {
    try {
      const user_id = req.user.id;

      const flashcards = await flashcardsService.getAllFlashcardsByUserId(user_id);

      res.status(200).json({
        success: true,
        data: flashcards,
      });
    } catch (error) {
      console.error("Error en FlashcardsController.getAllFlashcardsByUserId:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Error al obtener flashcards del usuario",
      });
    }
  }

  async updateReviewData(req, res) {
    try {
      const { id } = req.params;
      const { ease_factor, next_review_date } = req.body;

      const result = await flashcardsService.updateReviewData(id, {
        ease_factor,
        next_review_date,
      });

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Error en FlashcardsController.updateReviewData:", error);
      const statusCode = error.message === "Flashcard no encontrada" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Error al actualizar datos de revisión",
      });
    }
  }
}

module.exports = new FlashcardsController();