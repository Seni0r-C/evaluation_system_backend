const verifyRoles = require('../onlyTypeOfUsers');
const db = require('../../config/db');

// Mock para la base de datos
jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

describe('Middleware de Verificación de Roles', () => {
  let req, res, next;

  beforeEach(() => {
    // Configuración inicial para cada prueba
    req = {
      user: { userId: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Limpiar mocks después de cada prueba
    jest.clearAllMocks();
  });

  test('Debería denegar acceso cuando el usuario no está autenticado', async () => {
    // Arrange
    req.user = null;
    const middleware = verifyRoles([1, 2, 3]);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no autenticado' });
    expect(next).not.toHaveBeenCalled();
    expect(db.query).not.toHaveBeenCalled();
  });

  test('Debería denegar acceso cuando el usuario no tiene roles requeridos', async () => {
    // Arrange
    db.query.mockResolvedValue([[], null]); // Sin roles coincidentes
    const middleware = verifyRoles([1, 2, 3]);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT id_rol FROM usuario_rol'),
      [1, [1, 2, 3]]
    );
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acceso denegado: rol no autorizado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debería permitir acceso cuando el usuario tiene al menos un rol requerido', async () => {
    // Arrange
    db.query.mockResolvedValue([[{ id_rol: 2 }], null]); // Un rol coincidente
    const middleware = verifyRoles([1, 2, 3]);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT id_rol FROM usuario_rol'),
      [1, [1, 2, 3]]
    );
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Debería manejar errores de base de datos correctamente', async () => {
    // Arrange
    const dbError = new Error('Error de conexión a la base de datos');
    db.query.mockRejectedValue(dbError);
    const middleware = verifyRoles([1, 2, 3]);
    
    // Act
    await middleware(req, res, next);
    
    // Assert
    expect(db.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error interno del servidor' });
    expect(next).not.toHaveBeenCalled();
  });
});