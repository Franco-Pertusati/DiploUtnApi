const Folder = require("../models/foldersModel");

class FolderService {
  // Validar que una carpeta existe y pertenece al usuario
  async validateFolderOwnership(folder_id, user_id) {
    const folder = await Folder.getFolderById(folder_id, user_id);
    if (!folder) {
      const error = new Error("Carpeta no encontrada");
      error.code = "FOLDER_NOT_FOUND";
      error.statusCode = 404;
      throw error;
    }
    return folder;
  }

  // Validar que la carpeta padre existe (si se proporciona)
  async validateParentFolder(parent_folder_id, user_id) {
    if (!parent_folder_id) {
      return null; // No hay carpeta padre, es carpeta raíz
    }

    const parentFolder = await Folder.getFolderById(parent_folder_id, user_id);
    if (!parentFolder) {
      const error = new Error("Carpeta padre no encontrada");
      error.code = "PARENT_FOLDER_NOT_FOUND";
      error.statusCode = 404;
      throw error;
    }
    return parentFolder;
  }

  // Crear carpeta con validaciones
  async createFolder(name, parent_folder_id, user_id) {
    if (!name || name.trim() === "") {
      const error = new Error("El nombre de la carpeta es requerido");
      error.code = "INVALID_INPUT";
      error.statusCode = 400;
      throw error;
    }

    await this.validateParentFolder(parent_folder_id, user_id);

    const folderId = await Folder.createFolder({
      name: name.trim(),
      parent_folder_id: parent_folder_id || null,
      user_id
    });

    return await Folder.getFolderById(folderId, user_id);
  }

  async getFolders(user_id, parent_folder_id = null) {
    return await Folder.getFoldersByUserId(user_id, parent_folder_id);
  }

  async getFolder(folder_id, user_id) {
    return await this.validateFolderOwnership(folder_id, user_id);
  }

  async updateFolder(folder_id, user_id, name) {
    if (!name || name.trim() === "") {
      const error = new Error("El nombre de la carpeta es requerido");
      error.code = "INVALID_INPUT";
      error.statusCode = 400;
      throw error;
    }

    await this.validateFolderOwnership(folder_id, user_id);

    await Folder.updateFolder(folder_id, user_id, { name: name.trim() });

    return await Folder.getFolderById(folder_id, user_id);
  }

  // Eliminar carpeta
  async deleteFolder(folder_id, user_id) {
    await this.validateFolderOwnership(folder_id, user_id);

    const affectedRows = await Folder.deleteFolder(folder_id, user_id);
    
    if (affectedRows === 0) {
      const error = new Error("No se pudo eliminar la carpeta");
      error.code = "DELETE_FAILED";
      error.statusCode = 500;
      throw error;
    }

    return true;
  }

  async getFolderContent(folder_id, user_id) {
    await this.validateFolderOwnership(folder_id, user_id);

    return await Folder.getFolderContent(folder_id, user_id);
  }
}

module.exports = new FolderService();