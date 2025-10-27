const bcrypt = require('bcrypt');

SALT_ROUNDS = 10;

async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error("Error al encriptar contraseña:", error);
    throw new Error("Error al procesar la contraseña");
  }
}

async function comparePassword(plainPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error al comparar contraseñas:", error);
    throw new Error("Error al verificar la contraseña");
  }
}

module.exports = { hashPassword, comparePassword };
