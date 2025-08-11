// usuariosController.js
const db = require('../config/db'); // Importa la conexión a la base de datos
const axios = require('axios');
const https = require('https');
const { UTM_API_TOKEN } = require('../config/env');

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
  const { nombre: searchParams, rol } = req.query;

  try {
    // 1. Búsqueda en la base de datos local
    const condiciones = [];
    const valores = [];

    if (searchParams) {
      condiciones.push("u.nombre LIKE ? OR u.usuario LIKE ? OR u.cedula LIKE ?");
      const searchValue = `%${searchParams}%`;
      valores.push(searchValue, searchValue, searchValue);
    }

    if (rol) {
      condiciones.push("r.id_rol = ?");
      valores.push(rol);
    }

    const queryBase = "SELECT DISTINCT u.* FROM usuario u INNER JOIN usuario_rol r ON r.id_usuario = u.id";
    const queryFinal = condiciones.length
      ? `${queryBase} AND ${condiciones.join(' AND ')}`
      : queryBase;

    const [usuarios] = await db.execute(queryFinal, valores);

    // 2. Si encontramos resultados en DB, los devolvemos
    if (usuarios.length > 0) {
      return res.status(200).json(usuarios);
    }

    // 3. Si no hay resultados en DB y tenemos searchParams sin rol
    if (searchParams) {
      const headers = {
        'Content-Type': 'application/json',
        'X-Api-Key': UTM_API_TOKEN
      };

      // 4. Búsqueda en la API externa
      const apiResponse = await axios.post(
        'https://app.utm.edu.ec/becas/api/publico/ObtenerDatosPersona',
        { datos: searchParams },
        { headers, httpsAgent: agent }
      );

      const { state, value } = apiResponse.data;

      // 5. Procesar respuesta de la API
      if (state === 'success' && value && value.length > 0) {
        const usuariosAPI = value.map(persona => ({
          id: null, // No existe en nuestra DB
          cedula: persona.r_cedula,
          nombre: persona.r_nombres,
          email: persona.r_mail_alternativo,
          usuario: null,
          // Agrega aquí otros campos necesarios
          origen: 'API Externa' // Para identificar el origen
        }));

        return res.status(200).json(usuariosAPI);
      }
    }

    // 6. Si no se encontraron resultados en ningún lado
    res.status(200).json([]);
  } catch (error) {
    console.error('Error en obtenerUsuarios:', error);

    // Manejo específico de errores de API
    if (error.response) {
      return res.status(502).json({
        error: 'Error en API externa',
        message: `API responded with ${error.response.status}`
      });
    }

    res.status(500).json({
      error: 'Error al obtener los usuarios',
      message: error.message
    });
  }
};

// Obtener un usuario por su id
exports.obtenerUsuariosByRol = async (req, res) => {
  const { rol } = req.params;

  try {
    const [usuario] = await db.execute(
      'SELECT * FROM usuario u INNER JOIN usuario_rol r ON r.id_usuario = u.id WHERE r.id_rol = ?',
      [rol]
    );
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

exports.obtenerRolesDeUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT r.id, r.nombre FROM sistema_rol r
       JOIN usuario_rol ur ON r.id = ur.id_rol
       WHERE ur.id_usuario = ?`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los roles del usuario' });
  }
};

exports.actualizarRolesDeUsuario = async (req, res) => {
  const { id } = req.params;
  const { roles } = req.body; // Se espera un array de IDs de roles

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Eliminar roles actuales
    await connection.execute('DELETE FROM usuario_rol WHERE id_usuario = ?', [id]);

    // Insertar nuevos roles
    if (roles && roles.length > 0) {
      const values = roles.map(rolId => [id, rolId]);
      await connection.query('INSERT INTO usuario_rol (id_usuario, id_rol) VALUES ?', [values]);
    }

    await connection.commit();
    res.json({ message: 'Roles actualizados correctamente' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Error al actualizar los roles del usuario' });
  } finally {
    connection.release();
  }
};
