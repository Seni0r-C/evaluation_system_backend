const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const db = require('../config/db');

// ✅ Obtener todos los roles
router.get('/', rolesController.getRoles);

// ✅ Crear nuevo rol
router.post('/', async (req, res) => {
  const { nombre } = req.body;
  const [result] = await db.execute('INSERT INTO sistema_rol (nombre) VALUES (?)', [nombre]);
  res.json({ id: result.insertId, nombre });
});

// ✅ Actualizar rol
router.put('/:id', async (req, res) => {
  const { nombre } = req.body;
  const { id } = req.params;
  await db.execute('UPDATE sistema_rol SET nombre = ? WHERE id = ?', [nombre, id]);
  res.sendStatus(204);
});

// ✅ Eliminar rol
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM sistema_rol WHERE id = ?', [id]);
  res.sendStatus(204);
});

module.exports = router;
