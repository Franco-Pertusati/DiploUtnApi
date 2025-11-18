const noteService = require("../services/noteService");

class NotesController {
  async getNotes(req, res) {
    try {
      const userId = req.user.id;
      const { folder_id } = req.query;

      const notes = await noteService.getNotes(userId, folder_id);
      
      res.status(200).json(notes);
    } catch (error) {
      console.error("Error en getNotes:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al obtener notas"
        }
      });
    }
  }

  async getNote(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const note = await noteService.getNote(id, userId);
      
      res.status(200).json(note);
    } catch (error) {
      console.error("Error en getNote:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al obtener nota"
        }
      });
    }
  }

  async createNote(req, res) {
    try {
      const userId = req.user.id;
      const { title, content, folder_id } = req.body;

      const note = await noteService.createNote(title, content, folder_id, userId);
      
      res.status(201).json(note);
    } catch (error) {
      console.error("Error en createNote:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al crear nota"
        }
      });
    }
  }

  async updateNote(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { title, content, folder_id } = req.body;

      const note = await noteService.updateNote(id, userId, { title, content, folder_id });
      
      res.status(200).json(note);
    } catch (error) {
      console.error("Error en updateNote:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al actualizar nota"
        }
      });
    }
  }

  async deleteNote(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await noteService.deleteNote(id, userId);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error en deleteNote:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al eliminar nota"
        }
      });
    }
  }
}

module.exports = new NotesController();