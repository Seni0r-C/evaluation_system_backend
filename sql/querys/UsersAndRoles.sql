SELECT 
    u.id AS usuario_id, 
    u.usuario, 
    u.nombre AS usuario_nombre,
    sr.id AS rol_id, 
    sr.nombre AS rol_nombre
FROM usuario u
LEFT JOIN usuario_rol ur ON u.id = ur.id_usuario
LEFT JOIN sistema_rol sr ON ur.id_rol = sr.id WHERE  ur.id_rol IS NOT NULL;



