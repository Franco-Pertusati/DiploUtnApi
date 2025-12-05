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
    
    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
  } catch (error) {
    console.error("Error en getAllChangelogs:", error);
    throw error;
  }
}

async function updateChangelog(id, { version, release_date, description, tags, is_published } = {}) {
  try {
    const fields = [];
    const values = [];

    if (version !== undefined) {
      fields.push("version = ?");
      values.push(version);
    }
    if (release_date !== undefined) {
      fields.push("release_date = ?");
      values.push(release_date);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (tags !== undefined) {
      fields.push("tags = ?");
      values.push(JSON.stringify(tags));
    }
    if (is_published !== undefined) {
      fields.push("is_published = ?");
      values.push(is_published);
    }

    if (fields.length === 0) {
      throw new Error("No fields provided to update");
    }

    values.push(id); // for WHERE id = ?
    const sql = `UPDATE changelogs SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await pool.query(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error en updateChangelog:", error);
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
  deleteChangelog,
  updateChangelog
};