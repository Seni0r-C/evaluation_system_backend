SELECT 
    u.id AS usuario_id, 
    u.usuario, 
    u.nombre AS usuario_nombre,
    sr.id AS rol_id, 
    sr.nombre AS rol_nombre
FROM usuario u
JOIN usuario_rol ur ON u.id = ur.id_usuario
JOIN sistema_rol sr ON ur.id_rol = sr.id
WHERE sr.nombre = 'DOCENTE' AND u.id=8;
