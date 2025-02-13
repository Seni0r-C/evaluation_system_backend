CREATE TABLE IF NOT EXISTS `rubrica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_evaluacion_id` int(11) NOT NULL,
  `modalidad_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rubrica_ibfk_1` (`modalidad_id`),
  KEY `FK_tipo_evaluacion_id` (`tipo_evaluacion_id`),
  CONSTRAINT `FK_tipo_evaluacion_id` FOREIGN KEY (`tipo_evaluacion_id`) REFERENCES `sistema_tipo_evaluacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rubrica_ibfk_1` FOREIGN KEY (`modalidad_id`) REFERENCES `sistema_modalidad_titulacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;


-- Volcando estructura para tabla gestion_titulacion.rubrica_criterio
CREATE TABLE IF NOT EXISTS `rubrica_criterio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rubrica_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `puntaje_maximo` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rubrica_id` (`rubrica_id`),
  CONSTRAINT `rubrica_criterio_ibfk_1` FOREIGN KEY (`rubrica_id`) REFERENCES `rubrica` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;


SELECT 
    t.nombre AS tipo_evaluacion, 
    rc.nombre AS criterio_nombre,
    rc.puntaje_maximo
FROM 
    rubrica r
INNER JOIN 
    sistema_tipo_evaluacion t ON r.tipo_evaluacion_id = t.id
INNER JOIN 
    sistema_modalidad_titulacion m ON r.modalidad_id = m.id
INNER JOIN 
    rubrica_criterio rc ON r.id = rc.rubrica_id;


// Obtener criterios de rubricas con puntaje maximo con su modalidad y tipo de evaluacion (ESCRITO, DEFESA, ETC)

 SELECT    m.nombre AS modalidad,  t.nombre AS tipo_evaluacion,           rc.nombre AS criterio_nombre,     rc.puntaje_maximo FROM      rubrica r INNER JOIN      sistema_tipo_evaluacion t ON r.tipo_evaluacion_id = t.id INNER JOIN      sistema_modalidad_titulacion m ON r.modalidad_id = m.id INNER JOIN      rubrica_criterio rc ON r.id = rc.rubrica_id GROUP BY rc.nombre, m.id ORDER BY m.nombre, t.nombre;

-- POSILE CONSULTA DE DATOS CUANDO SE PRETENDA GENERAR EXCEL DE PONDERACION RUBRICA 
--  CRITERIO/Item, DOCENTE, ESTUDIANTE, puntaje_obtenido 
SELECT 
    estudiante.nombre AS estudiante,
    rc.nombre AS criterio,
    re.puntaje_obtenido AS docente.nombre docente
FROM 
    rubrica_evaluacion re
INNER JOIN 
    rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
INNER JOIN 
    usuario docente ON re.docente_id = docente.id
INNER JOIN 
    usuario estudiante ON re.estudiante_id = estudiante.id;

-- POSILE CONSULTA DE DATOS CUANDO SE PRETENDA GENERAR DOCUMENTO DE PONDERACION RUBRICA A UN ESTUDIANTE
-- LO ANTERIOR + MODALIAD, PUNTAJE MAXIMO
SELECT 
    docente.nombre AS docente,
    estudiante.id AS est_id,
    estudiante.nombre AS estudiante,
    t.nombre AS tipo_evaluacion, 
    rc.id,
    rc.nombre AS criterio,
    re.puntaje_obtenido AS nota,
    rc.puntaje_maximo AS base
FROM 
    rubrica_evaluacion re
INNER JOIN 
    rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
INNER JOIN 
    usuario docente ON re.docente_id = docente.id
INNER JOIN 
    usuario estudiante ON re.estudiante_id = estudiante.id
INNER JOIN  rubrica r ON rc.rubrica_id = r.id
INNER JOIN 
    sistema_tipo_evaluacion t ON r.tipo_evaluacion_id = t.id
INNER JOIN 
    sistema_modalidad_titulacion m ON r.modalidad_id = m.id
WHERE estudiante.id = 3
GROUP BY re.id;

-- POSIBLE CONSULTA DE DATOS CUANDO SE PRETENDA GENERAR PROMEDIOS POR TIPO RUBRICA/EVALUACION DE UN TRABAJO DE TITULACION
    -- rc.nombre AS criterio,
    SELECT 
        -- tt.id,
        docente.nombre AS docente,
        estudiante.id AS est_id,
        estudiante.nombre AS estudiante,
        te.nombre AS tipo_evaluacion, 
        SUM(re.puntaje_obtenido) AS nota,
        SUM(rc.puntaje_maximo) AS base
    FROM 
        rubrica_evaluacion re
    INNER JOIN 
        rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
    INNER JOIN 
        usuario docente ON re.docente_id = docente.id
    INNER JOIN 
        usuario estudiante ON re.estudiante_id = estudiante.id
    INNER JOIN  rubrica r ON rc.rubrica_id = r.id
    INNER JOIN 
        sistema_tipo_evaluacion te ON r.tipo_evaluacion_id = te.id
    INNER JOIN 
        sistema_modalidad_titulacion m ON r.modalidad_id = m.id
    INNER JOIN trabajo_titulacion tt ON re.trabajo_id = tt.id
    WHERE tt.id = 10
    GROUP BY te.id, estudiante.id;

SELECT 
            docente.nombre AS docente,
            estudiante.id AS est_id,
            estudiante.nombre AS estudiante,
            te.nombre AS tipo_evaluacion, 
            SUM(re.puntaje_obtenido) AS nota,
            SUM(rc.puntaje_maximo) AS base
        FROM 
            rubrica_evaluacion re
        INNER JOIN 
            rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
        INNER JOIN 
            usuario docente ON re.docente_id = docente.id
        INNER JOIN 
            usuario estudiante ON re.estudiante_id = estudiante.id
        INNER JOIN  rubrica r ON rc.rubrica_id = r.id
        INNER JOIN 
            sistema_tipo_evaluacion te ON r.tipo_evaluacion_id = te.id
        INNER JOIN 
            sistema_modalidad_titulacion m ON r.modalidad_id = m.id
        INNER JOIN trabajo_titulacion tt ON re.trabajo_id = tt.id
        WHERE tt.id = 10
        GROUP BY te.id, docente.id, estudiante.id ORDER BY estudiante.id

acta_cfg = (
       id,
      year,
      count_per_year,
      ciudad
  )
    
 #  define jerarquia de notas y compomentes de notas basado en rubrica_evaluacion_id en comp's'
  acta_notas_scheme = (
      id,
      comp_id,
      comp_parent_id(sistema_tipo_evaluacion.id | null),
      trabajo_modalidad_id(sistema_modalidad_titulacion.id)
  )
  
#  asesor y secretaria, vicedecano asociados con usuario.id, acta_cfg
 acta = (
    id,
    year,
    num_year_count,
    trabajo_id(trabajo_estudiante.id),
    secretaria_id(usuario.id),
    vicedecano_id(usuario.id),
    asesor_juridico_id(usuario.id),
    fecha_hora_verbose,
    ciudad_id (acta_cfg.id),
    lugar_id
 )