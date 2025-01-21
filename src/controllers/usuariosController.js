// usuariosController.js
const db = require('../config/db'); // Importa la conexión a la base de datos
const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false
});

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  const { nombre, apellido, email, contrasenia, id_rol } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO .usuario (nombre, apellido, email, contrasenia, id_rol) VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, email, contrasenia, id_rol]
    );
    res.status(201).json({ message: 'Usuario creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario', message: error.message });
  }
};

/**
 * Controlador para obtener los usuarios del sistema, con búsquedas opcionales.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con un array de usuarios o un mensaje de error.
 */
exports.obtenerUsuarios = async (req, res) => {
  const { nombre, email, rol } = req.query; // Obtener parámetros de búsqueda de la query string

  try {
    // Construir condiciones dinámicas
    const condiciones = [];
    const valores = [];

    if (nombre) {
      condiciones.push("u.nombre LIKE ? ");
      valores.push(`%${nombre}%`);  // Asegúrate de que se agreguen dos valores para nombre y apellido
    }
    if (email) {
      condiciones.push("u.usuario LIKE ?");
      valores.push(`%${email}%`);
    }

    if (rol) {
      condiciones.push("r.id_rol = ?");
      valores.push(rol);
    }

    // Generar consulta dinámica
    const queryBase = "SELECT DISTINCT u.* FROM .usuario u INNER JOIN .usuario_rol r WHERE r.id_usuario = u.id";
    const queryFinal = condiciones.length
      ? `${queryBase} AND ${condiciones.join(' AND ')}`  // Se debe unir las condiciones con "AND"
      : queryBase;

    // Ejecutar consulta
    const [usuarios] = await db.execute(queryFinal, valores);
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios', message: error.message });
  }
};

// Obtener un usuario por su id
exports.obtenerUsuariosByRol = async (req, res) => {
  const { rol } = req.params;
  try {
    const [usuario] = await db.execute('SELECT * FROM usuario u INNER JOIN usuario_rol r WHERE u.id_personal = 104419 AND r.id_usuario = u.id AND r.id_rol = ?', [rol]);
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
      `UPDATE .usuario SET nombre = ?, apellido = ?, email = ?, contrasenia = ?, id_rol = ? WHERE id = ?`,
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
    const [result] = await db.execute('DELETE FROM .usuario WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario', message: error.message });
  }
};

exports.obtenerEstudianteByTrabajo = async (req, res) => {
  const { id } = req.params;
  try {
    const [estudiante] = await db.execute('SELECT u.* FROM usuario u INNER JOIN trabajo_estudiante t WHERE u.id = t.estudiante_id AND t.trabajo_id = ?', [id]);
    if (estudiante.length === 0) {
      return res.status(404).json({ message: 'No hay estudiantes con ese trabajo' });
    }
    res.status(200).json(estudiante);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el estudiante', message: error.message });
  }
}

exports.obtenerFotoUsuario = async (req, res) => {
  const { id } = req.params;
  let userPhotoBase64 = null;
  try {
    const photoResponse = await axios.post(
      "https://app.utm.edu.ec:3000/movil/obtener_foto_carnet",
      { idpersonal: id }, {
      httpsAgent: agent
    }
    );

    const photoData = photoResponse.data[0]?.archivo_bin?.data;
    if (photoData) {
      // Convertir buffer a Base64
      userPhotoBase64 = Buffer.from(photoData).toString('base64');
    }

    res.status(200).json(userPhotoBase64);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la foto', message: error.message });
  }
};