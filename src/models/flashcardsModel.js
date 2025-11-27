const pool = require("./pool");

async function createFlashcard({ note_id, question, answer }) {
  try {
    const [result] = await pool.query(
      "INSERT INTO flashcards (note_id, question, answer) VALUES (?, ?, ?)",
      [note_id, question, answer]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error en createFlashcard:", error);
    throw error;
  }
}

async function getFlashcardsByNoteId(note_id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM flashcards WHERE note_id = ? ORDER BY created_at ASC",
      [note_id]
    );
    return rows;
  } catch (error) {
    console.error("Error en getFlashcardsByNoteId:", error);
    throw error;
  }
}

async function getFlashcardById(id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM flashcards WHERE id = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error en getFlashcardById:", error);
    throw error;
  }
}

async function updateFlashcard(id, { question, answer }) {
  try {
    const [result] = await pool.query(
      "UPDATE flashcards SET question = ?, answer = ? WHERE id = ?",
      [question, answer, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error en updateFlashcard:", error);
    throw error;
  }
}

async function deleteFlashcard(id) {
  try {
    const [result] = await pool.query(
      "DELETE FROM flashcards WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error en deleteFlashcard:", error);
    throw error;
  }
}

async function getAllFlashcardsByUserId(user_id) {
  try {
    const [rows] = await pool.query(
      `SELECT f.* FROM flashcards f
       INNER JOIN notes n ON f.note_id = n.id
       WHERE n.user_id = ?
       ORDER BY f.created_at DESC`,
      [user_id]
    );
    return rows;
  } catch (error) {
    console.error("Error en getAllFlashcardsByUserId:", error);
    throw error;
  }
}

async function updateReviewData(id, { ease_factor, next_review_date }) {
  try {
    const [result] = await pool.query(
      `UPDATE flashcards 
       SET ease_factor = ?, 
           next_review_date = ?, 
           review_count = review_count + 1 
       WHERE id = ?`,
      [ease_factor, next_review_date, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error en updateReviewData:", error);
    throw error;
  }
}

module.exports = {
  createFlashcard,
  getFlashcardsByNoteId,
  getFlashcardById,
  updateFlashcard,
  deleteFlashcard,
  getAllFlashcardsByUserId,
  updateReviewData,
};