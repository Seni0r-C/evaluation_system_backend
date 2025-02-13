DROP TABLE IF EXISTS `acta`;
DROP TABLE IF EXISTS `acta_cfg`;
DROP TABLE IF EXISTS `acta_notas_scheme`;

CREATE TABLE IF NOT EXISTS `acta_notas_scheme` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `comp_id` INT(11) NOT NULL,  -- Referencia a un componente de calificación, en este caso, una referencia a sistema_tipo_evaluacion.id
    `comp_parent_id` INT(11) DEFAULT NULL,  -- Si es un subcomponente, referencia al componente padre; puede ser NULL para componentes de primer nivel
    `trabajo_modalidad_id` INT(11) NOT NULL,  -- Referencia a la modalidad de trabajo, por ejemplo, trabajo_titulacion.modalidad_id
    PRIMARY KEY (`id`),
    FOREIGN KEY (`comp_id`) REFERENCES `sistema_tipo_evaluacion` (`id`)  ,  -- Conexión con el tipo de evaluación
    FOREIGN KEY (`comp_parent_id`) REFERENCES `sistema_tipo_evaluacion` (`id`)  ,  -- Conexión con el componente padre, si existe
    FOREIGN KEY (`trabajo_modalidad_id`) REFERENCES `sistema_modalidad_titulacion` (`id`)    -- Conexión con el trabajo_modalidad_titulacion
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `acta` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `year` INT(4) NOT NULL,
    `num_year_count` INT(11) NOT NULL,
    `trabajo_id` INT(11) NOT NULL, -- Referencia al trabajo_estudiante.id
    `secretaria_id` INT(11) NOT NULL,  -- Referencia a usuario.id
    `vicedecano_id` INT(11) NOT NULL,  -- Referencia a usuario.id
    `asesor_juridico_id` INT(11) NOT NULL,  -- Referencia a usuario.id
    `fecha_hora` DATETIME NOT NULL,
    `ciudad` VARCHAR(150) NOT NULL,  -- Referencia a acta_cfg.id
    `lugar` VARCHAR(255) NOT NULL, -- Asumimos que hay un lugar que se referencia
    PRIMARY KEY (`id`),
    FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_estudiante` (`id`)  ,
    FOREIGN KEY (`secretaria_id`) REFERENCES `usuario` (`id`)  ,
    FOREIGN KEY (`vicedecano_id`) REFERENCES `usuario` (`id`)  ,
    FOREIGN KEY (`asesor_juridico_id`) REFERENCES `usuario` (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO sistema_tipo_evaluacion (id, nombre) VALUES (7, 'EXAMEN TEORICO');
UPDATE  sistema_tipo_evaluacion SET nombre="DEFENSA" WHERE id=1;
UPDATE  sistema_tipo_evaluacion SET nombre="INFORME FINAL" WHERE id=2;
UPDATE  sistema_tipo_evaluacion SET nombre="EXAMEN PRACTICO" WHERE id=3;
UPDATE  sistema_tipo_evaluacion SET nombre="EXAMEN TEORICO" WHERE id=7;

DELETE FROM sistema_modalidad_titulacion WHERE id=6;

SELECT * FROM   sistema_tipo_evaluacion;
+----+-----------------+
| id | nombre          |
+----+-----------------+
|  1 | DEFENSA         |
|  2 | INFORME FINAL   |
|  3 | EXAMEN PRACTICO |
|  7 | EXAMEN TEORICO  |
+----+-----------------+

SELECT * FROM sistema_modalidad_titulacion;
+----+------------------------+-------------------+
| id | nombre                 | max_participantes |
+----+------------------------+-------------------+
|  1 | Examen Complexivo      |                 1 |
|  2 | Artículo Científico    |                 1 |
|  3 | Propuesta Tecnológica  |                 2 |
+----+------------------------+-------------------+
-- COMPLEXIVO
-- Componentes de examen practico
INSERT INTO acta_notas_scheme(comp_id, comp_parent_id, trabajo_modalidad_id) VALUES (2, 3, 1), (1, 3, 1);
-- Examen practico y teorico
INSERT INTO acta_notas_scheme(comp_id, comp_parent_id, trabajo_modalidad_id) VALUES (3, null, 1), (7, null, 1);
-- ARTICULO - INFORME FINAL/ESCRITO, DEFENSA 
INSERT INTO acta_notas_scheme(comp_id, comp_parent_id, trabajo_modalidad_id) VALUES (1, null, 2), (2, null, 2);
-- PROPUESTA TECNOLOGICA - INFORME FINAL/ESCRITO, DEFENSA
INSERT INTO acta_notas_scheme(comp_id, comp_parent_id, trabajo_modalidad_id) VALUES (1, null, 3), (2, null, 3);