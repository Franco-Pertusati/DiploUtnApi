const pool = require("./pool");

async function createChangelog({ version, release_date, description, tags = [], is_published = true }) {
  try {
    const tagsJson = JSON.stringify(tags);
    const [result] = await pool.query(
      "INSERT INTO changelogs (version, release_date, description, tags, is_published) VALUES (?, ?, ?, ?, ?)",
      [version, release_date, description, tagsJson, is_published]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error en createChangelog:", error);
    throw error;
  }
}

async function getAllChangelogs() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM changelogs WHERE is_published = true ORDER BY release_date DESC",
      []
    );
    
    // Parsear tags de JSON string a array
    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
  } catch (error) {
    console.error("Error en getAllChangelogs:", error);
    throw error;
  }
}

async function deleteChangelog(id) {
  try {
    const [result] = await pool.query(
      "DELETE FROM changelogs WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error en deleteChangelog:", error);
    throw error;
  }
}

module.exports = {
  createChangelog,
  getAllChangelogs,
  deleteChangelog
};