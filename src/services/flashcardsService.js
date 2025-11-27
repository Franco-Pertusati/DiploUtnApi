const flashcardsModel = require("../models/flashcardsModel");

class FlashcardsService {
  async createFlashcard({ note_id, question, answer }) {
    try {
      if (!note_id) {
        throw new Error("El note_id es requerido");
      }
      if (!question || question.trim().length === 0) {
        throw new Error("La pregunta no puede estar vacía");
      }
      if (!answer || answer.trim().length === 0) {
        throw new Error("La respuesta no puede estar vacía");
      }

      const flashcardId = await flashcardsModel.createFlashcard({
        note_id,
        question: question.trim(),
        answer: answer.trim(),
      });

      return {
        id: flashcardId,
        note_id,
        question: question.trim(),
        answer: answer.trim(),
      };
    } catch (error) {
      console.error("Error en FlashcardsService.createFlashcard:", error);
      throw error;
    }
  }

  async getFlashcardsByNoteId(note_id) {
    try {
      if (!note_id) {
        throw new Error("El note_id es requerido");
      }

      const flashcards = await flashcardsModel.getFlashcardsByNoteId(note_id);
      return flashcards;
    } catch (error) {
      console.error("Error en FlashcardsService.getFlashcardsByNoteId:", error);
      throw error;
    }
  }

  async getFlashcardById(id) {
    try {
      if (!id) {
        throw new Error("El id es requerido");
      }

      const flashcard = await flashcardsModel.getFlashcardById(id);
      
      if (!flashcard) {
        throw new Error("Flashcard no encontrada");
      }

      return flashcard;
    } catch (error) {
      console.error("Error en FlashcardsService.getFlashcardById:", error);
      throw error;
    }
  }

  async updateFlashcard(id, { question, answer }) {
    try {
      if (!id) {
        throw new Error("El id es requerido");
      }

      const existingFlashcard = await flashcardsModel.getFlashcardById(id);
      if (!existingFlashcard) {
        throw new Error("Flashcard no encontrada");
      }

      if (question !== undefined && question.trim().length === 0) {
        throw new Error("La pregunta no puede estar vacía");
      }
      if (answer !== undefined && answer.trim().length === 0) {
        throw new Error("La respuesta no puede estar vacía");
      }

      const updatedQuestion = question !== undefined ? question.trim() : existingFlashcard.question;
      const updatedAnswer = answer !== undefined ? answer.trim() : existingFlashcard.answer;

      const success = await flashcardsModel.updateFlashcard(id, {
        question: updatedQuestion,
        answer: updatedAnswer,
      });

      if (!success) {
        throw new Error("No se pudo actualizar la flashcard");
      }

      return {
        id,
        question: updatedQuestion,
        answer: updatedAnswer,
      };
    } catch (error) {
      console.error("Error en FlashcardsService.updateFlashcard:", error);
      throw error;
    }
  }

  async deleteFlashcard(id) {
    try {
      if (!id) {
        throw new Error("El id es requerido");
      }

      const existingFlashcard = await flashcardsModel.getFlashcardById(id);
      if (!existingFlashcard) {
        throw new Error("Flashcard no encontrada");
      }

      const success = await flashcardsModel.deleteFlashcard(id);

      if (!success) {
        throw new Error("No se pudo eliminar la flashcard");
      }

      return { success: true, message: "Flashcard eliminada correctamente" };
    } catch (error) {
      console.error("Error en FlashcardsService.deleteFlashcard:", error);
      throw error;
    }
  }

  async getAllFlashcardsByUserId(user_id) {
    try {
      if (!user_id) {
        throw new Error("El user_id es requerido");
      }

      const flashcards = await flashcardsModel.getAllFlashcardsByUserId(user_id);
      return flashcards;
    } catch (error) {
      console.error("Error en FlashcardsService.getAllFlashcardsByUserId:", error);
      throw error;
    }
  }

  async updateReviewData(id, { ease_factor, next_review_date }) {
    try {
      if (!id) {
        throw new Error("El id es requerido");
      }
      if (ease_factor === undefined || next_review_date === undefined) {
        throw new Error("ease_factor y next_review_date son requeridos");
      }

      const existingFlashcard = await flashcardsModel.getFlashcardById(id);
      if (!existingFlashcard) {
        throw new Error("Flashcard no encontrada");
      }

      const success = await flashcardsModel.updateReviewData(id, {
        ease_factor,
        next_review_date,
      });

      if (!success) {
        throw new Error("No se pudieron actualizar los datos de revisión");
      }

      return { success: true, message: "Datos de revisión actualizados" };
    } catch (error) {
      console.error("Error en FlashcardsService.updateReviewData:", error);
      throw error;
    }
  }
}

module.exports = new FlashcardsService();