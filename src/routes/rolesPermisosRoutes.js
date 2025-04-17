const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Obtener permisos de un rol
router.get('/:id_rol/permisos', async (req, res) => {
    const { id_rol } = req.params;
    if (!String(id_rol) || String(id_rol).trim() === '') return res.status(400).json({ error: 'id_rol es requerido' });
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
    if (!String(id_rol) || String(id_rol).trim() === '') return res.status(400).json({ error: 'id_rol es requerido' });
    if (!String(id_permiso) || String(id_permiso).trim() === '') return res.status(400).json({ error: 'id_permiso es requerido' });
    
    await db.execute(
        'INSERT IGNORE INTO permisos_roles (id_rol, id_permiso) VALUES (?, ?)',
        [id_rol, id_permiso]
    );
    res.sendStatus(201);
});

// ✅ Quitar permiso de un rol
router.delete('/', async (req, res) => {
    const { id_rol, id_permiso } = req.body;
    if (!String(id_rol) || String(id_rol).trim() === '') return res.status(400).json({ error: 'id_rol es requerido' });
    if (!String(id_permiso) || String(id_permiso).trim() === '') return res.status(400).json({ error: 'id_permiso es requerido' });
    
    await db.execute(
        'DELETE FROM permisos_roles WHERE id_rol = ? AND id_permiso = ?',
        [id_rol, id_permiso]
    );
    res.sendStatus(204);
});

module.exports = router;
