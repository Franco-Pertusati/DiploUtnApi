const express = require("express");
const router = express.Router();
const {
  createChangelog,
  getAllChangelogs,
  deleteChangelog,
} = require("../models/changelogModel");

router.get("/", async (req, res) => {
  try {
    const changelogs = await getAllChangelogs();
    res.json(changelogs);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener changelogs" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { version, release_date, description, tags, is_published } = req.body;

    // Validaciones básicas
    if (!version || !release_date || !description) {
      return res.status(400).json({
        error: "Faltan campos requeridos: version, release_date, description",
      });
    }

    const changelogId = await createChangelog({
      version,
      release_date,
      description,
      tags: tags || [],
      is_published: is_published !== undefined ? is_published : true,
    });

    res.status(201).json({
      message: "Changelog creado exitosamente",
      id: changelogId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el changelog" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteChangelog(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Changelog no encontrado" });
    }

    res.json({ message: "Changelog eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el changelog" });
  }
});

module.exports = router;
