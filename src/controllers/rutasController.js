const db = require('../config/db'); // Suponiendo que tienes un modelo para la base de datos

// Crear una nueva ruta
exports.createRuta = async (req, res) => {
    try {
        const { nombre, ruta, padre, orden } = req.body;
        const [nuevaRuta] = await db.query("INSERT INTO sistema_ruta (nombre, ruta, padre, orden) VALUES (?, ?, ?, ?)", [nombre, ruta, padre, orden]);
        res.status(201).json(nuevaRuta);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la ruta', details: error });
    }
};

// Obtener todas las rutas
exports.getRutas = async (req, res) => {
    try {
        const [rutas] = await db.query("SELECT * FROM sistema_ruta");
        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las rutas', details: error });
    }
};

// Obtener una ruta específica
exports.getRutaByRol = async (req, res) => {
    const { rol } = req.params;
    try {
        const [ruta] = await db.query("SELECT * FROM sistema_ruta WHERE nombre = ?", [rol]);
        if (!ruta) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }
        res.status(200).json(ruta[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la ruta', details: error });
    }
};

// Actualizar una ruta
exports.updateRuta = async (req, res) => {
    const { id } = req.params;
    const { nombre, ruta, padre, orden } = req.body;
    try {
        const [sql] = await db.query("SELECT * FROM sistema_ruta WHERE id = ?", [id]);
        if (sql.length === 0) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }

        // Actualizar los campos
        const [sql2] = await db.query("UPDATE sistema_ruta SET nombre = ?, ruta = ?, padre = ?, orden = ? WHERE id = ?", [nombre, ruta, padre, orden, id]);

        if (sql2.affectedRows === 0) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }

        res.status(200).json(sql2);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la ruta', details: error });
    }
};

// Eliminar una ruta
exports.deleteRuta = async (req, res) => {
    const { id } = req.params;
    try {
        const [ruta] = await db.query("SELECT * FROM sistema_ruta WHERE id = ?", [id]);
        if (ruta.length === 0) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }

        const [sql] = await db.query("DELETE FROM sistema_ruta WHERE id = ?", [id]);
        if (sql.affectedRows === 0) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }

        res.status(200).json({ message: 'Ruta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la ruta', details: error });
    }
};

// Asignar un rol a una ruta
exports.assignRoleToRuta = async (req, res) => {
    const { rutaId, rolId } = req.params;
    try {
        const [ruta] = await db.query("SELECT * FROM sistema_ruta WHERE id = ?", [rutaId]);
        const [rol] = await db.query("SELECT * FROM sistema_rol WHERE id = ?", [rolId]);

        if (ruta.length === 0 || rol.length === 0) {
            return res.status(404).json({ error: 'Ruta o Rol no encontrado' });
        }

        const [sql] = await db.query("INSERT INTO sistema_rol_ruta (rol_id, ruta_id) VALUES (?, ?)", [rolId, rutaId]);
        if (sql.affectedRows === 0) {
            return res.status(404).json({ error: 'Rol no asignado a esta ruta' });
        }

        res.status(200).json({ message: 'Rol asignado a la ruta correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar el rol a la ruta', details: error });
    }
};

// Eliminar un rol de una ruta
exports.removeRoleFromRuta = async (req, res) => {
    const { rutaId, rolId } = req.params;
    try {
        const [resultado] = await db.query("DELETE FROM sistema_rol_ruta WHERE ruta_id = ? AND rol_id = ?", [rutaId, rolId]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Rol no asignado a esta ruta' });
        }

        res.status(200).json({ message: 'Rol eliminado de la ruta correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el rol de la ruta', details: error });
    }
};
