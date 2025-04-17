const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Obtener todos los permisos
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM sistema_permisos');
  res.json(rows);
});

// ✅ Crear nuevo permiso
router.post('/', async (req, res) => {
  const { nombre, permiso, permiso_id = null } = req.body;
  const [result] = await db.execute(
    'INSERT INTO sistema_permisos (nombre, permiso, permiso_id) VALUES (?, ?, ?)',
    [nombre, permiso, permiso_id]
  );
  res.json({ id: result.insertId, nombre, permiso, permiso_id });
});

// ✅ Actualizar permiso
router.put('/:id', async (req, res) => {
  const { nombre, permiso, permiso_id = null } = req.body;
  const { id } = req.params;
  await db.execute(
    'UPDATE sistema_permisos SET nombre = ?, permiso = ?, permiso_id = ? WHERE id = ?',
    [nombre, permiso, permiso_id, id]
  );
  res.sendStatus(204);
});

// ✅ Eliminar permiso
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM sistema_permisos WHERE id = ?', [id]);
  res.sendStatus(204);
});

module.exports = router;
