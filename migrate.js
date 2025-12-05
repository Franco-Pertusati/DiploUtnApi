// migrate.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const migrationSQL = `
-- Crear tabla users (sin dependencias)
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla folders (depende de users)
CREATE TABLE IF NOT EXISTS folders (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    parent_folder_id INT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_parent_folder (parent_folder_id),
    KEY idx_user (user_id),
    CONSTRAINT fk_folders_parent FOREIGN KEY (parent_folder_id) REFERENCES folders(id) ON DELETE CASCADE,
    CONSTRAINT fk_folders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla notes (depende de users y folders)
CREATE TABLE IF NOT EXISTS notes (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    content TEXT NULL,
    folder_id INT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_title (title(255)),
    KEY idx_folder (folder_id),
    KEY idx_user (user_id),
    CONSTRAINT fk_notes_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
    CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla flashcards (depende de notes)
CREATE TABLE IF NOT EXISTS flashcards (
    id INT NOT NULL AUTO_INCREMENT,
    note_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    next_review_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    ease_factor DECIMAL(3,2) NULL DEFAULT 2.50,
    review_count INT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_note (note_id),
    KEY idx_created (created_at),
    KEY idx_next_review (next_review_date),
    CONSTRAINT fk_flashcards_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla changelogs (sin dependencias)
CREATE TABLE IF NOT EXISTS changelogs (
    id INT NOT NULL AUTO_INCREMENT,
    version VARCHAR(20) NOT NULL,
    release_date DATE NOT NULL,
    description TEXT NOT NULL,
    tags JSON NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_published TINYINT(1) NULL DEFAULT 1,
    PRIMARY KEY (id),
    KEY idx_version (version),
    KEY idx_release_date (release_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos...');
    console.log(`Host: ${process.env.MYSQL_HOST}`);
    console.log(`Port: ${process.env.MYSQL_PORT || 3306}`);
    console.log(`Database: ${process.env.MYSQL_DB_NAME}`);
    
    // Crear conexión con SSL para Railway
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB_NAME,
      port: process.env.MYSQL_PORT || 3306,
      connectTimeout: 60000,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('✅ Conectado exitosamente\n');

    // Limpiar SQL y dividir en queries individuales
    const queries = migrationSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n')
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    console.log(`🔄 Ejecutando ${queries.length} queries...\n`);

    // Ejecutar cada query por separado
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
      
      if (tableName) {
        console.log(`  📝 Creando tabla: ${tableName}...`);
      }
      
      try {
        await connection.query(query);
        if (tableName) {
          console.log(`  ✅ Tabla ${tableName} creada\n`);
        }
      } catch (error) {
        console.error(`  ❌ Error en query ${i + 1}:`, error.message);
        throw error;
      }
    }

    console.log('✅ Migración completada exitosamente\n');

    // Verificar tablas creadas
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Tablas en la base de datos:');
    tables.forEach(table => {
      console.log(`  ✓ ${Object.values(table)[0]}`);
    });

  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar migración
runMigration();