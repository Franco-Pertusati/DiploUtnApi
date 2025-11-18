const Note = require("../models/notesModels");
const Folder = require("../models/foldersModel");

class NoteService {
  // Validar que una nota existe y pertenece al usuario
  async validateNoteOwnership(note_id, user_id) {
    const note = await Note.getNoteById(note_id, user_id);
    if (!note) {
      const error = new Error("Nota no encontrada");
      error.code = "NOTE_NOT_FOUND";
      error.statusCode = 404;
      throw error;
    }
    return note;
  }

  // Validar que la carpeta existe (si se proporciona)
  async validateFolder(folder_id, user_id) {
    if (!folder_id) {
      return null;
    }

    const folder = await Folder.getFolderById(folder_id, user_id);
    if (!folder) {
      const error = new Error("Carpeta no encontrada");
      error.code = "FOLDER_NOT_FOUND";
      error.statusCode = 404;
      throw error;
    }
    return folder;
  }

  // Crear nota con validaciones
  async createNote(title, content, folder_id, user_id) {
    if (!title || title.trim() === "") {
      const error = new Error("El título de la nota es requerido");
      error.code = "INVALID_INPUT";
      error.statusCode = 400;
      throw error;
    }

    await this.validateFolder(folder_id, user_id);

    const noteId = await Note.createNote({
      title: title.trim(),
      content: content || "",
      folder_id: folder_id || null,
      user_id
    });

    return await Note.getNoteById(noteId, user_id);
  }

  // Obtener notas del usuario
  async getNotes(user_id, folder_id = null) {
    return await Note.getNotesByUserId(user_id, folder_id);
  }

  // Obtener una nota específica
  async getNote(note_id, user_id) {
    return await this.validateNoteOwnership(note_id, user_id);
  }

  // Actualizar nota
  async updateNote(note_id, user_id, updates) {
    const { title, content, folder_id } = updates;

    if (title === undefined && content === undefined && folder_id === undefined) {
      const error = new Error("No hay campos para actualizar");
      error.code = "INVALID_INPUT";
      error.statusCode = 400;
      throw error;
    }

    if (title !== undefined && title.trim() === "") {
      const error = new Error("El título no puede estar vacío");
      error.code = "INVALID_INPUT";
      error.statusCode = 400;
      throw error;
    }

    // Validar que la nota existe y pertenece al usuario
    await this.validateNoteOwnership(note_id, user_id);

    if (folder_id !== undefined) {
      await this.validateFolder(folder_id, user_id);
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content;
    if (folder_id !== undefined) updateData.folder_id = folder_id || null;

    await Note.updateNote(note_id, user_id, updateData);

    return await Note.getNoteById(note_id, user_id);
  }

  // Eliminar nota
  async deleteNote(note_id, user_id) {
    await this.validateNoteOwnership(note_id, user_id);

    const affectedRows = await Note.deleteNote(note_id, user_id);
    
    if (affectedRows === 0) {
      const error = new Error("No se pudo eliminar la nota");
      error.code = "DELETE_FAILED";
      error.statusCode = 500;
      throw error;
    }

    return true;
  }
}

module.exports = new NoteService();