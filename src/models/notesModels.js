const pool = require("./pool");

async function createNote({ title, content, folder_id, user_id }) {
  try {
    const [result] = await pool.query(
      "INSERT INTO notes (title, content, folder_id, user_id) VALUES (?, ?, ?, ?)",
      [title, content, folder_id, user_id]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error en createNote:", error);
    throw error;
  }
}

async function getNoteById(id, user_id) {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, content, folder_id, user_id, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error en getNoteById:", error);
    throw error;
  }
}

async function getNotesByUserId(user_id, folder_id = null) {
  try {
    let query;
    let params;

    if (folder_id === "root" || folder_id === null) {
      query = "SELECT id, title, content, folder_id, user_id, created_at, updated_at FROM notes WHERE user_id = ? AND folder_id IS NULL ORDER BY updated_at DESC";
      params = [user_id];
    } else {
      query = "SELECT id, title, content, folder_id, user_id, created_at, updated_at FROM notes WHERE user_id = ? AND folder_id = ? ORDER BY updated_at DESC";
      params = [user_id, folder_id];
    }

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error en getNotesByUserId:", error);
    throw error;
  }
}

async function updateNote(id, user_id, { title, content, folder_id }) {
  try {
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push("title = ?");
      params.push(title);
    }
    if (content !== undefined) {
      updates.push("content = ?");
      params.push(content);
    }
    if (folder_id !== undefined) {
      updates.push("folder_id = ?");
      params.push(folder_id);
    }

    if (updates.length === 0) {
      return 0;
    }

    params.push(id, user_id);

    const [result] = await pool.query(
      `UPDATE notes SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
      params
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error en updateNote:", error);
    throw error;
  }
}

async function getAllNotesByUserId(user_id) {
  try {
    const query = `
      SELECT 
        id, title, content, folder_id, user_id, created_at, updated_at
      FROM 
        notes
      WHERE 
        user_id = ?
      ORDER BY 
        updated_at DESC
    `;

    const [rows] = await pool.query(query, [user_id]);
    return rows;
  } catch (error) {
    console.error("Error en getAllNotesByUserId:", error);
    throw error;
  }
}

async function deleteNote(id, user_id) {
  try {
    const [result] = await pool.query(
      "DELETE FROM notes WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error en deleteNote:", error);
    throw error;
  }
}

module.exports = {
  createNote,
  getNoteById,
  getNotesByUserId,
  updateNote,
  deleteNote,
  getAllNotesByUserId,
};
