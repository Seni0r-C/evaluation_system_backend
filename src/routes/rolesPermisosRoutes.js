const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Obtener permisos de un rol
router.get('/:id_rol/permisos', async (req, res) => {
  const { id_rol } = req.params;
  const [rows] = await db.execute(
    `SELECT sp.* FROM permisos_roles pr
     JOIN sistema_permisos sp ON pr.id_permiso = sp.id
     WHERE pr.id_rol = ?`,
    [id_rol]
  );
  res.json(rows);
});

// ✅ Asignar permiso a rol
router.post('/', async (req, res) => {
  const { id_rol, id_permiso } = req.body;
  await db.execute(
    'INSERT IGNORE INTO permisos_roles (id_rol, id_permiso) VALUES (?, ?)',
    [id_rol, id_permiso]
  );
  res.sendStatus(201);
});

// ✅ Quitar permiso de un rol
router.delete('/', async (req, res) => {
  const { id_rol, id_permiso } = req.body;
  await db.execute(
    'DELETE FROM permisos_roles WHERE id_rol = ? AND id_permiso = ?',
    [id_rol, id_permiso]
  );
  res.sendStatus(204);
});

module.exports = router;
