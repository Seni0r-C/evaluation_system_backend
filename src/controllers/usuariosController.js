// usuariosController.js
const db = require('../config/db'); // Importa la conexión a la base de datos

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  const { nombre, apellido, email, contrasenia, id_rol } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO utm.usuario (nombre, apellido, email, contrasenia, id_rol) VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, email, contrasenia, id_rol]
    );
    res.status(201).json({ message: 'Usuario creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario', message: error.message });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.execute('SELECT id, nombre, apellido, email, id_rol FROM utm.usuario');
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios', message: error.message });
  }
};

// Obtener un usuario por su id
exports.obtenerUsuariosByRol = async (req, res) => {
  const {  rol } = req.params;
  try {
    const [usuario] = await db.execute('SELECT id, nombre, apellido, email FROM utm.usuario WHERE id_rol = ?', [rol]);
    if (usuario.length === 0) {
      return res.status(404).json({ message: 'No hay usuarios con ese rol' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario', message: error.message });
  }
};

// Actualizar un usuario
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, contrasenia, id_rol } = req.body;
  try {
    const [result] = await db.execute(
      `UPDATE utm.usuario SET nombre = ?, apellido = ?, email = ?, contrasenia = ?, id_rol = ? WHERE id = ?`,
      [nombre, apellido, email, contrasenia, id_rol, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario', message: error.message });
  }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM utm.usuario WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario', message: error.message });
  }
};

