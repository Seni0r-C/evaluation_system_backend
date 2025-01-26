const db = require('../config/db'); // Suponiendo que tienes un modelo para la base de datos

// Crear una nueva ruta
exports.createRuta = async (req, res) => {
    try {
        const { ruta } = req.body;
        const [nuevaRuta] = await db.query("INSERT INTO sistema_ruta (ruta) VALUES (?)", [ruta]);
        if (nuevaRuta.affectedRows === 0) {
            return res.status(500).json({ error: 'Error al crear la ruta' });
        } else {
            res.status(200).json({ exito: true, mensaje: 'Ruta creada correctamente', id: nuevaRuta.insertId });
        }
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

exports.getRutasRol = async (req, res) => {
    try {
        const [rutas] = await db.query("SELECT * FROM vista_rutas_rol");
        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las rutas', details: error });
    }
}

// Obtener una ruta específica
exports.hasAccess = async (req, res) => {
    const { rol, ruta } = req.body; // roles es un array de roles

    // Asegurémonos de que roles sea un array
    if (!Array.isArray(rol) || rol.length === 0) {
        return res.status(400).json({ exito: false, mensaje: 'Se deben proporcionar roles válidos.' });
    }
    const roleIds = rol.map(role => role.id); // obtenemos los ids de los roles

    try {
        // Consulta para verificar si al menos uno de los roles tiene acceso a la ruta
        const [consulta] = await db.query(
            "SELECT * FROM vista_rutas_rol WHERE rol IN (?) AND ruta = ?",
            [roleIds, ruta]
        );

        // Si la consulta no devuelve resultados, es porque ninguno de los roles tiene acceso
        if (consulta.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Sin acceso' });
        }

        // Si encuentra al menos un resultado, devuelve acceso permitido
        res.status(200).json({ exito: true, mensaje: 'Acceso permitido' });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error al obtener la ruta', details: error });
    }
};

// Obtener una ruta específica
exports.getMenuByRol = async (req, res) => {
    const { rol } = req.params;
    try {
        const [menu] = await db.query("SELECT * FROM vista_menu_rol WHERE rol = ?", [rol]);
        if (menu.length === 0) {
            return res.status(404).json({ mensaje: 'Ruta no encontrada' });
        }
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la ruta', details: error });
    }
};

// Actualizar una ruta
exports.updateRuta = async (req, res) => {
    const { id } = req.params;
    const { ruta } = req.body;
    try {
        const [sql] = await db.query("SELECT * FROM sistema_ruta WHERE id = ?", [id]);
        if (sql.length === 0) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }

        // Actualizar los campos
        const [sql2] = await db.query("UPDATE sistema_ruta SET ruta = ? WHERE id = ?", [ruta, id]);

        if (sql2.affectedRows === 0) {
            return res.status(404).json({ error: 'Ruta no encontrada' });
        }

        res.status(200).json({ message: 'Ruta actualizada correctamente' });
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

exports.createMenu = async (req, res) => {
    try {
        const { nombre, ruta_id, padre_id, orden, todos, icon } = req.body;
        const [nuevoMenu] = await db.query("INSERT INTO sistema_menu (nombre, ruta_id, padre_id, orden, todos, icon) VALUES (?, ?, ?, ?, ?, ?)", [nombre, ruta_id, padre_id, orden, todos, icon]);
        if (nuevoMenu.affectedRows === 0) {
            return res.status(500).json({ error: 'Error al crear el menú' });
        } else {
            res.status(200).json({ exito: true, mensaje: 'Menú creado correctamente', id: nuevoMenu.insertId });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el menú', details: error });
    }
};

exports.getMenus = async (req, res) => {
    try {
        const [menus] = await db.query("SELECT * FROM sistema_menu");
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los menú', details: error });
    }
}

exports.updateMenu = async (req, res) => {
    const { id } = req.params;
    const { nombre, ruta_id, padre_id, orden, todos, icon } = req.body;
    try {
        const [sql] = await db.query("SELECT * FROM sistema_menu WHERE id = ?", [id]);
        if (sql.length === 0) {
            return res.status(404).json({ error: 'Menú no encontrada' });
        }

        const [resultado] = await db.query("UPDATE sistema_menu SET nombre = ?, ruta_id = ?, padre_id = ?, orden = ?, todos = ?, icon = ? WHERE id = ?", [
            nombre,
            ruta_id,
            padre_id,
            orden,
            todos,
            icon,
            id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(500).json({ error: 'Error al actualizar el menú' });
        } else {
            return res.status(200).json({ exito: true, mensaje: 'Menú actualizado correctamente' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el menú', details: error });
    }
};

exports.deleteMenu = async (req, res) => {
    const { id } = req.params;
    try {
        const [resultado] = await db.query("DELETE FROM sistema_menu WHERE id = ?", [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Menú no encontrada' });
        }
        res.status(200).json({ exito: true, mensaje: 'Menú eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el menú', details: error });
    }
};  