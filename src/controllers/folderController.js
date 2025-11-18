const folderService = require("../services/folderService");

class FoldersController {
  async getFolders(req, res) {
    try {
      const userId = req.user.id;
      const { parent_id } = req.query;

      const folders = await folderService.getFolders(userId, parent_id);
      
      res.status(200).json(folders);
    } catch (error) {
      console.error("Error en getFolders:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al obtener carpetas"
        }
      });
    }
  }

  async getFolder(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const folder = await folderService.getFolder(id, userId);
      
      res.status(200).json(folder);
    } catch (error) {
      console.error("Error en getFolder:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al obtener carpeta"
        }
      });
    }
  }

  async createFolder(req, res) {
    try {
      const userId = req.user.id;
      const { name, parent_folder_id } = req.body;

      const folder = await folderService.createFolder(name, parent_folder_id, userId);
      
      res.status(201).json(folder);
    } catch (error) {
      console.error("Error en createFolder:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al crear carpeta"
        }
      });
    }
  }

  async updateFolder(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { name } = req.body;

      const folder = await folderService.updateFolder(id, userId, name);
      
      res.status(200).json(folder);
    } catch (error) {
      console.error("Error en updateFolder:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al actualizar carpeta"
        }
      });
    }
  }

  async deleteFolder(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await folderService.deleteFolder(id, userId);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error en deleteFolder:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al eliminar carpeta"
        }
      });
    }
  }

  async getFolderContent(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const content = await folderService.getFolderContent(id, userId);
      
      res.status(200).json(content);
    } catch (error) {
      console.error("Error en getFolderContent:", error);
      
      res.status(error.statusCode || 500).json({
        error: {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "Error al obtener contenido de carpeta"
        }
      });
    }
  }
}

module.exports = new FoldersController();