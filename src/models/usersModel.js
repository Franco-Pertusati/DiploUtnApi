const pool = require("./pool");

async function createUser({ username, password, email }) {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, password, email]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error en createUser:", error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, password, email FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  } catch (error) {
    console.error("Error en getUserByEmail:", error);
    throw error;
  }
}

async function getUserById(id) {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error en getUserById:", error);
    throw error;
  }
}

module.exports = {getUserByEmail, createUser, getUserById};
