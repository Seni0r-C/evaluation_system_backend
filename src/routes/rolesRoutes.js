const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const db = require('../config/db');
const auth = require('../middlewares/authMiddleware');
const onlyRoles = require('../middlewares/onlyTypeOfUsers');
const roles = [1, 10, 11];

// ✅ Obtener todos los roles
router.get('/', auth, rolesController.getRoles);

// ✅ Crear nuevo rol
router.post('/', auth, onlyRoles(roles), async (req, res) => {
  const { nombre } = req.body?.nombre;
  if (!nombre || nombre?.trim() === '') return res.status(400).json({ error: 'Nombre es requerido' });
  const [result] = await db.execute('INSERT INTO sistema_rol (nombre) VALUES (?)', [nombre]);
  res.json({ id: result.insertId, nombre });
});

// ✅ Actualizar rol
router.put('/:id', auth, onlyRoles(roles), async (req, res) => {
  const { nombre } = req.body?.nombre;
  const { id } = req.params;
  if (!nombre || nombre?.trim() === '') return res.status(400).json({ error: 'Nombre es requerido' });
  await db.execute('UPDATE sistema_rol SET nombre = ? WHERE id = ?', [nombre, id]);
  res.sendStatus(204);
});

// ✅ Eliminar rol
router.delete('/:id', auth, onlyRoles(roles), async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM sistema_rol WHERE id = ?', [id]);
  res.sendStatus(204);
});

module.exports = router;
