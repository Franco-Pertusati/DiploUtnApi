const pool = require("./pool");

async function createFolder({ name, parent_folder_id, user_id }) {
  try {
    const [result] = await pool.query(
      "INSERT INTO folders (name, parent_folder_id, user_id) VALUES (?, ?, ?)",
      [name, parent_folder_id, user_id]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error en createFolder:", error);
    throw error;
  }
}

async function getFolderById(id, user_id) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, parent_folder_id, user_id, created_at, updated_at FROM folders WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error en getFolderById:", error);
    throw error;
  }
}

async function getFoldersByUserId(user_id, parent_folder_id = null) {
  try {
    let query;
    let params;

    if (parent_folder_id) {
      query = "SELECT id, name, parent_folder_id, user_id, created_at, updated_at FROM folders WHERE user_id = ? AND parent_folder_id = ? ORDER BY name ASC";
      params = [user_id, parent_folder_id];
    } else {
      query = "SELECT id, name, parent_folder_id, user_id, created_at, updated_at FROM folders WHERE user_id = ? AND parent_folder_id IS NULL ORDER BY name ASC";
      params = [user_id];
    }

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error en getFoldersByUserId:", error);
    throw error;
  }
}

async function updateFolder(id, user_id, { name }) {
  try {
    const [result] = await pool.query(
      "UPDATE folders SET name = ? WHERE id = ? AND user_id = ?",
      [name, id, user_id]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error en updateFolder:", error);
    throw error;
  }
}

async function deleteFolder(id, user_id) {
  try {
    const [result] = await pool.query(
      "DELETE FROM folders WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error en deleteFolder:", error);
    throw error;
  }
}

async function getFolderContent(folder_id, user_id) {
  try {
    // Obtener subcarpetas
    const [folders] = await pool.query(
      "SELECT id, name, parent_folder_id, created_at FROM folders WHERE parent_folder_id = ? AND user_id = ? ORDER BY name ASC",
      [folder_id, user_id]
    );

    // Obtener notas
    const [notes] = await pool.query(
      "SELECT id, title, folder_id, created_at FROM notes WHERE folder_id = ? AND user_id = ? ORDER BY updated_at DESC",
      [folder_id, user_id]
    );

    return { folders, notes };
  } catch (error) {
    console.error("Error en getFolderContent:", error);
    throw error;
  }
}

module.exports = {
  createFolder,
  getFolderById,
  getFoldersByUserId,
  updateFolder,
  deleteFolder,
  getFolderContent
};