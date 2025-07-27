const jwt = require('jsonwebtoken');
const verifyToken = require('../authMiddleware');

// Mock para jwt
jest.mock('jsonwebtoken');

// Mock para process.env
process.env.JWT_SECRET = 'test_secret_key';

describe('Middleware de Autenticación', () => {
  let req, res, next;

  beforeEach(() => {
    // Configuración inicial para cada prueba
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('Debería denegar acceso cuando no hay token', () => {
    // Arrange - ya configurado en beforeEach
    
    // Act
    verifyToken(req, res, next);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      exito: false,
      mensaje: 'Acceso denegado. No se encontró el token.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debería denegar acceso cuando el token es inválido', () => {
    // Arrange
    req.headers['authorization'] = 'Bearer invalid_token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Token inválido');
    });
    
    // Act
    verifyToken(req, res, next);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('invalid_token', 'test_secret_key');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      exito: false,
      mensaje: 'Token no válido'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debería permitir acceso cuando el token es válido', () => {
    // Arrange
    const validToken = 'valid_token';
    const decodedToken = { userId: 1, role: 'admin' };
    req.headers['authorization'] = `Bearer ${validToken}`;
    jwt.verify.mockReturnValue(decodedToken);
    
    // Act
    verifyToken(req, res, next);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(validToken, 'test_secret_key');
    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Debería manejar tokens expirados correctamente', () => {
    // Arrange
    req.headers['authorization'] = 'Bearer expired_token';
    jwt.verify.mockImplementation(() => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      throw error;
    });
    
    // Act
    verifyToken(req, res, next);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('expired_token', 'test_secret_key');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      exito: false,
      mensaje: 'Token no válido'
    });
  });
});