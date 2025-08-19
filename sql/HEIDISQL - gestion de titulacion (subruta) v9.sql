-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para gestion_titulacion
CREATE DATABASE IF NOT EXISTS `gestion_titulacion` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `gestion_titulacion`;

-- Volcando estructura para tabla gestion_titulacion.acta
CREATE TABLE IF NOT EXISTS `acta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(4) NOT NULL,
  `num_year_count` int(11) NOT NULL,
  `trabajo_id` int(11) NOT NULL,
  `secretaria_id` int(11) NOT NULL,
  `vicedecano_id` int(11) NOT NULL,
  `asesor_juridico_id` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `ciudad` varchar(150) NOT NULL,
  `lugar` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trabajo_id` (`trabajo_id`),
  KEY `secretaria_id` (`secretaria_id`),
  KEY `vicedecano_id` (`vicedecano_id`),
  KEY `asesor_juridico_id` (`asesor_juridico_id`),
  CONSTRAINT `FK_acta_trabajo_titulacion` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`),
  CONSTRAINT `acta_ibfk_3` FOREIGN KEY (`vicedecano_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.acta: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestion_titulacion.acta_notas_scheme
CREATE TABLE IF NOT EXISTS `acta_notas_scheme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comp_id` int(11) NOT NULL,
  `comp_parent_id` int(11) DEFAULT NULL,
  `trabajo_modalidad_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comp_id` (`comp_id`),
  KEY `comp_parent_id` (`comp_parent_id`),
  KEY `trabajo_modalidad_id` (`trabajo_modalidad_id`),
  CONSTRAINT `acta_notas_scheme_ibfk_1` FOREIGN KEY (`comp_id`) REFERENCES `sistema_tipo_evaluacion` (`id`),
  CONSTRAINT `acta_notas_scheme_ibfk_2` FOREIGN KEY (`comp_parent_id`) REFERENCES `sistema_tipo_evaluacion` (`id`),
  CONSTRAINT `acta_notas_scheme_ibfk_3` FOREIGN KEY (`trabajo_modalidad_id`) REFERENCES `sistema_modalidad_titulacion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.acta_notas_scheme: ~8 rows (aproximadamente)
INSERT INTO `acta_notas_scheme` (`id`, `comp_id`, `comp_parent_id`, `trabajo_modalidad_id`) VALUES
	(1, 2, 3, 1),
	(2, 1, 3, 1),
	(3, 3, NULL, 1),
	(4, 7, NULL, 1),
	(5, 1, NULL, 2),
	(7, 1, NULL, 3),
	(8, 2, NULL, 3),
	(9, 8, NULL, 2);

-- Volcando estructura para tabla gestion_titulacion.rubrica
CREATE TABLE IF NOT EXISTS `rubrica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_evaluacion_id` int(11) NOT NULL,
  `modalidad_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rubrica_ibfk_1` (`modalidad_id`),
  KEY `FK_tipo_evaluacion_id` (`tipo_evaluacion_id`),
  CONSTRAINT `FK_tipo_evaluacion_id` FOREIGN KEY (`tipo_evaluacion_id`) REFERENCES `sistema_tipo_evaluacion` (`id`),
  CONSTRAINT `rubrica_ibfk_1` FOREIGN KEY (`modalidad_id`) REFERENCES `sistema_modalidad_titulacion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.rubrica: ~8 rows (aproximadamente)
INSERT INTO `rubrica` (`id`, `tipo_evaluacion_id`, `modalidad_id`) VALUES
	(1, 2, 3),
	(2, 1, 3),
	(3, 1, 2),
	(7, 7, 1),
	(8, 1, 1),
	(9, 2, 1),
	(10, 8, 2),
	(11, 3, 1);

-- Volcando estructura para tabla gestion_titulacion.rubrica_criterio
CREATE TABLE IF NOT EXISTS `rubrica_criterio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rubrica_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `puntaje_maximo` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rubrica_id` (`rubrica_id`),
  CONSTRAINT `rubrica_criterio_ibfk_1` FOREIGN KEY (`rubrica_id`) REFERENCES `rubrica` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.rubrica_criterio: ~29 rows (aproximadamente)
INSERT INTO `rubrica_criterio` (`id`, `rubrica_id`, `nombre`, `puntaje_maximo`) VALUES
	(21, 7, 'Puntaje de prueba evirtual', 100.00),
	(22, 1, 'APLICACIÓN DEL MÉTODO CIENTIFICO EN EL ANÁLISIS Y SOLUCIÓN DEL PROBLEMA (El método es idóneo para atender la necesidad detectada', 40.00),
	(23, 1, 'RIGOR CIENTÍFICO (Implica un control coherente de la planificación, el desarrollo y el análisis de la investigación. Definición adecuada de los contenidos en el objeto de estudio y que se explique y aplique con exactitud la metodología de trabajo).', 10.00),
	(24, 1, 'METODOLOGÍA UTILIZADA (Coherencia entre el tipo de estudio, diseño, métodos y técnicas se recogida y procesamiento de la información que lleven al alcance de los objetivos propuestos).', 10.00),
	(25, 1, 'ORIGINALIDAD (Incluye ideas o fragmentos de otros autores, siempre y debidamente citados y referenciados que se verifican en los resultados de la aplicación de la herramienta antiplagio).', 10.00),
	(26, 1, 'CAPACIDAD CREADORA (la forma en que se presenta la solución del problema tiene un enfoque innovador)', 10.00),
	(27, 1, 'PRESENTACIÓN DEL INFORME FINAL: (cuenta con los aspectos descritos en el reglamento y de desarrollan de manera coherente)', 20.00),
	(28, 2, 'CONTENIDO::>Calidad de la exposición de la sustentación tomando en cuenta la organización y contenido. (Presenta los aspectos más relevantes de la investigación de manera sistemática y coherente).', 30.00),
	(29, 2, 'CONTENIDO::>Dominio demostrado en el tema y sobre otros aspectos de la especialidad durante la exposición (utiliza lenguaje técnico propio de la profesión, demuestra dominio en los procesos, describe adecuadamente los resultados).', 20.00),
	(30, 2, 'PRESENTACIÓN::>Elaboración y uso de la ayuda de equipos en apoyo de la disertación (las diapositivas son claras, concretas direccionan adecuadamente la disertación).', 10.00),
	(31, 2, 'PRESENTACIÓN::>Manejo de la presentación y dominio del auditorio (demostró seguridad, centró la atención del tribunal).', 10.00),
	(32, 2, 'DISCUSIÓN::>Contenido y coherencia de la respuestas y explicaciones solicitadas por el tribunal (las respuestas responden a la inquietud del tribunal en función de la investigación y la experiencia del estudiante).', 30.00),
	(39, 3, 'CONTENIDO::>Calidad de la exposición de la sustentación tomando en cuenta la organización y contenido. (Presenta los aspectos más relevantes de la investigación de manera sistemática y coherente).', 30.00),
	(40, 3, 'CONTENIDO::>Dominio demostrado en el tema y sobre otros aspectos de la especialidad durante la exposición (utiliza lenguaje técnico propio de la profesión, demuestra dominio en los procesos, describe adecuadamente los resultados).', 20.00),
	(41, 3, 'PRESENTACIÓN::>Elaboración y uso de la ayuda de equipos en apoyo de la disertación (las diapositivas son claras, concretas direccionan adecuadamente la disertación).', 10.00),
	(42, 3, 'PRESENTACIÓN::>Manejo de la presentación y dominio del auditorio (demostró seguridad, centró la atención del tribunal).', 10.00),
	(43, 3, 'DISCUSIÓN::>Contenido y coherencia de la respuestas y explicaciones solicitadas por el tribunal (las respuestas responden a la inquietud del tribunal en función de la investigación y la experiencia del estudiante).', 30.00),
	(44, 9, 'APLICACIÓN DEL MÉTODO CIENTIFICO EN EL ANÁLISIS Y SOLUCIÓN DEL PROBLEMA (El método es idóneo para atender la necesidad detectada)', 40.00),
	(45, 9, 'RIGOR CIENTÍFICO (Implica un control coherente de la planificación, el desarrollo y el análisis de la investigación. Definición adecuada de los contenidos en el objeto de estudio y que se explique y aplique con exactitud la metodología de trabajo).', 10.00),
	(46, 9, 'METODOLOGÍA UTILIZADA (Coherencia entre el tipo de estudio, diseño, métodos y técnicas se recogida y procesamiento de la información que lleven al alcance de los objetivos propuestos).', 10.00),
	(47, 9, 'ORIGINALIDAD (Incluye ideas o fragmentos de otros autores, siempre y debidamente citados y referenciados que se verifican en los resultados de la aplicación de la herramienta antiplagio).', 10.00),
	(48, 9, 'CAPACIDAD CREADORA (la forma en que se presenta la solución del problema tiene un enfoque innovador)', 10.00),
	(49, 9, 'PRESENTACIÓN DEL INFORME FINAL: (cuenta con los aspectos descritos en el reglamento y de desarrollan de manera coherente)', 20.00),
	(50, 8, 'CONTENIDO: Calidad de la exposición de la sustentación tomando en cuenta la organización y contenido. (Presenta los aspectos más relevantes de la investigación de manera sistemática y coherente).', 30.00),
	(51, 8, 'CONTENIDO: Dominio demostrado en el tema y sobre otros aspectos de la especialidad durante la exposición (utiliza lenguaje técnico propio de la profesión, demuestra dominio en los procesos, describe adecuadamente los resultados).', 20.00),
	(52, 8, 'PRESENTACIÓN: Elaboración y uso de la ayuda de equipos en apoyo de la disertación (las diapositivas son claras, concretas direccionan adecuadamente la disertación).', 10.00),
	(53, 8, 'PRESENTACIÓN: Manejo de la presentación y dominio del auditorio (demostró seguridad, centró la atención del tribunal).', 10.00),
	(54, 8, 'DISCUSIÓN: Contenido y coherencia de la respuestas y explicaciones solicitadas por el tribunal (las respuestas responden a la inquietud del tribunal en función de la investigación y la experiencia del estudiante).', 30.00),
	(55, 10, 'Nota de Revista Indexada', 80.00);

-- Volcando estructura para tabla gestion_titulacion.rubrica_evaluacion
CREATE TABLE IF NOT EXISTS `rubrica_evaluacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trabajo_id` int(11) NOT NULL,
  `rubrica_id` int(11) NOT NULL,
  `rubrica_criterio_id` int(11) NOT NULL,
  `docente_id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `puntaje_obtenido` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_rubrica_id` (`rubrica_id`),
  KEY `FK_rubrica_criterio_id` (`rubrica_criterio_id`),
  KEY `FK_docente_id` (`docente_id`),
  KEY `FK_estudiante_evaluacion_id` (`estudiante_id`),
  KEY `FK_trabajo_evaluacion_id` (`trabajo_id`),
  CONSTRAINT `FK_docente_id` FOREIGN KEY (`docente_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FK_estudiante_evaluacion_id` FOREIGN KEY (`estudiante_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FK_rubrica_criterio_id` FOREIGN KEY (`rubrica_criterio_id`) REFERENCES `rubrica_criterio` (`id`),
  CONSTRAINT `FK_rubrica_id` FOREIGN KEY (`rubrica_id`) REFERENCES `rubrica` (`id`),
  CONSTRAINT `FK_trabajo_evaluacion_id` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.rubrica_evaluacion: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestion_titulacion.sistema_carrera
CREATE TABLE IF NOT EXISTS `sistema_carrera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_carrera: ~2 rows (aproximadamente)
INSERT INTO `sistema_carrera` (`id`, `nombre`) VALUES
	(4, 'SISTEMAS DE INFORMACION'),
	(5, 'GENERAL');

-- Volcando estructura para tabla gestion_titulacion.sistema_menu
CREATE TABLE IF NOT EXISTS `sistema_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `ruta_id` int(11) DEFAULT NULL,
  `padre_id` int(11) DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `todos` tinyint(4) NOT NULL DEFAULT 0,
  `icon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_ruta_id` (`ruta_id`) USING BTREE,
  KEY `FK_padre_id` (`padre_id`) USING BTREE,
  CONSTRAINT `FK_id_ruta` FOREIGN KEY (`ruta_id`) REFERENCES `sistema_ruta` (`id`),
  CONSTRAINT `FK_padre_id` FOREIGN KEY (`padre_id`) REFERENCES `sistema_menu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_menu: ~16 rows (aproximadamente)
INSERT INTO `sistema_menu` (`id`, `nombre`, `ruta_id`, `padre_id`, `orden`, `todos`, `icon`) VALUES
	(1, 'Inicio', 1, NULL, 1, 1, 'home'),
	(2, 'Administrar Sistema', NULL, NULL, 2, 1, 'items'),
	(3, 'Modalidades de Titulación', 3, 2, 4, 0, NULL),
	(5, 'Items de rúbrica', 5, 2, 5, 0, NULL),
	(6, 'Registro Anteproyecto', 6, NULL, 3, 0, 'subir'),
	(7, 'Registro Trabajo Final', 22, NULL, 4, 0, 'subir'),
	(8, 'Asignación Tribunal', 8, NULL, 5, 0, 'asignar'),
	(9, 'Calificación Trabajos', 9, NULL, 6, 0, 'calificar'),
	(10, 'Documento de acta', 10, NULL, 8, 0, 'reporte'),
	(12, 'Carreras', 15, 2, 3, 0, ''),
	(14, 'Rutas', 19, 2, 6, 0, ''),
	(15, 'Menu', 21, 2, 7, 0, ''),
	(22, 'Proceso de calificación', 23, NULL, 7, 0, 'items'),
	(24, 'Administrar Roles de Usuarios', 26, 2, 2, 0, ''),
	(25, 'Roles del Sistema', 25, 2, 1, 0, ''),
	(26, 'Reportes', 27, NULL, 9, 0, 'datos');

-- Volcando estructura para tabla gestion_titulacion.sistema_modalidad_titulacion
CREATE TABLE IF NOT EXISTS `sistema_modalidad_titulacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `max_participantes` int(11) NOT NULL,
  `puntaje_final_promedio` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_modalidad_titulacion: ~3 rows (aproximadamente)
INSERT INTO `sistema_modalidad_titulacion` (`id`, `nombre`, `max_participantes`, `puntaje_final_promedio`) VALUES
	(1, 'Examen Complexivo', 1, 0),
	(2, 'Artículo Científico', 1, 0),
	(3, 'Propuesta Tecnológica', 2, 1);

-- Volcando estructura para tabla gestion_titulacion.sistema_modalidad_titulacion_carrera
CREATE TABLE IF NOT EXISTS `sistema_modalidad_titulacion_carrera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_carrera` int(11) NOT NULL,
  `id_modalidad_titulacion` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_id_carrera` (`id_carrera`),
  KEY `FK_id_modalidad_titulacion` (`id_modalidad_titulacion`),
  CONSTRAINT `FK_id_modalidad_titulacion` FOREIGN KEY (`id_modalidad_titulacion`) REFERENCES `sistema_modalidad_titulacion` (`id`),
  CONSTRAINT `FK_modalidad_titulacion_carrera_sistema_carrera` FOREIGN KEY (`id_carrera`) REFERENCES `sistema_carrera` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_modalidad_titulacion_carrera: ~3 rows (aproximadamente)
INSERT INTO `sistema_modalidad_titulacion_carrera` (`id`, `id_carrera`, `id_modalidad_titulacion`) VALUES
	(1, 4, 3),
	(2, 4, 2),
	(3, 4, 1);

-- Volcando estructura para tabla gestion_titulacion.sistema_rol
CREATE TABLE IF NOT EXISTS `sistema_rol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_rol: ~7 rows (aproximadamente)
INSERT INTO `sistema_rol` (`id`, `nombre`) VALUES
	(1, 'ADMINISTRACIÓN'),
	(2, 'SECRETARíA'),
	(3, 'DOCENTE'),
	(4, 'ESTUDIANTE'),
	(9, 'VALIDADOR DE CONGRESO'),
	(10, 'VICEDECANATO'),
	(11, 'DECANATO');

-- Volcando estructura para tabla gestion_titulacion.sistema_rol_ruta
CREATE TABLE IF NOT EXISTS `sistema_rol_ruta` (
  `rol_id` int(11) NOT NULL,
  `ruta_id` int(11) NOT NULL,
  PRIMARY KEY (`rol_id`,`ruta_id`) USING BTREE,
  KEY `FK_ruta_id` (`ruta_id`),
  CONSTRAINT `FK_rol_id` FOREIGN KEY (`rol_id`) REFERENCES `sistema_rol` (`id`),
  CONSTRAINT `FK_ruta_id` FOREIGN KEY (`ruta_id`) REFERENCES `sistema_ruta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_rol_ruta: ~22 rows (aproximadamente)
INSERT INTO `sistema_rol_ruta` (`rol_id`, `ruta_id`) VALUES
	(2, 6),
	(2, 10),
	(2, 24),
	(3, 6),
	(3, 7),
	(3, 9),
	(3, 11),
	(3, 13),
	(3, 22),
	(3, 24),
	(10, 8),
	(10, 10),
	(10, 12),
	(10, 23),
	(10, 24),
	(10, 27),
	(11, 8),
	(11, 10),
	(11, 12),
	(11, 23),
	(11, 24),
	(11, 27);

-- Volcando estructura para tabla gestion_titulacion.sistema_ruta
CREATE TABLE IF NOT EXISTS `sistema_ruta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ruta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_ruta: ~22 rows (aproximadamente)
INSERT INTO `sistema_ruta` (`id`, `ruta`) VALUES
	(1, '/gestion-titulacion/'),
	(3, '/gestion-titulacion/modalidades'),
	(5, '/gestion-titulacion/items-rubrica'),
	(6, '/gestion-titulacion/registro-anteproyecto'),
	(7, '/gestion-titulacion/registro-proyecto-titulacion'),
	(8, '/gestion-titulacion/asignacion-de-tribunal'),
	(9, '/gestion-titulacion/calificacion-de-trabajo-titulacion'),
	(10, '/gestion-titulacion/generacion-de-documento'),
	(11, '/gestion-titulacion/calificar'),
	(12, '/gestion-titulacion/trabajos-titulacion-realizados'),
	(13, '/gestion-titulacion/trabajos-titulacion'),
	(14, '/gestion-titulacion/profile'),
	(15, '/gestion-titulacion/carreras'),
	(19, '/gestion-titulacion/rutas'),
	(21, '/gestion-titulacion/menu'),
	(22, '/gestion-titulacion/registro-trabajo-final'),
	(23, '/gestion-titulacion/ver-calificacion-de-trabajo-titulacion'),
	(24, '/gestion-titulacion/ver-calificar'),
	(25, '/gestion-titulacion/gestion-roles'),
	(26, '/gestion-titulacion/admin/user-permissions'),
	(27, '/gestion-titulacion/reportes');

-- Volcando estructura para tabla gestion_titulacion.sistema_tipo_evaluacion
CREATE TABLE IF NOT EXISTS `sistema_tipo_evaluacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `pos_evaluation` tinyint(4) NOT NULL DEFAULT 0,
  `calificacion_global` tinyint(4) NOT NULL DEFAULT 0,
  `modificador` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Si el valor de esta columna es 1 quiere decir que dependiendo de que valor se obtenga por la suma de todos su criterios de la su rubrica, ese será el valor que represente de la calificación en porcentaje.',
  `valor_base` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_tipo_evaluacion: ~5 rows (aproximadamente)
INSERT INTO `sistema_tipo_evaluacion` (`id`, `nombre`, `pos_evaluation`, `calificacion_global`, `modificador`, `valor_base`) VALUES
	(1, 'DEFENSA', 0, 0, 0, NULL),
	(2, 'INFORME FINAL', 0, 1, 0, NULL),
	(3, 'EXAMEN PRACTICO', 1, 0, 0, 60),
	(7, 'EXAMEN TEORICO', 1, 0, 0, 40),
	(8, 'INDEXACIÓN', 1, 0, 1, NULL);

-- Volcando estructura para tabla gestion_titulacion.sistema_tipo_evauacion_options
CREATE TABLE IF NOT EXISTS `sistema_tipo_evauacion_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_option` varchar(255) DEFAULT NULL,
  `id_tipo_evaluacion` int(11) DEFAULT NULL,
  `valor` varchar(255) DEFAULT NULL,
  `tipo_valor` enum('porcentaje','número') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ste_fk_id_tipo_evaluacion` (`id_tipo_evaluacion`),
  CONSTRAINT `ste_fk_id_tipo_evaluacion` FOREIGN KEY (`id_tipo_evaluacion`) REFERENCES `sistema_tipo_evaluacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_tipo_evauacion_options: ~2 rows (aproximadamente)
INSERT INTO `sistema_tipo_evauacion_options` (`id`, `nombre_option`, `id_tipo_evaluacion`, `valor`, `tipo_valor`) VALUES
	(1, 'Scopus', 8, '80', 'porcentaje'),
	(2, 'Latin Index', 8, '60', 'porcentaje');

-- Volcando estructura para tabla gestion_titulacion.trabajo_estado
CREATE TABLE IF NOT EXISTS `trabajo_estado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.trabajo_estado: ~4 rows (aproximadamente)
INSERT INTO `trabajo_estado` (`id`, `nombre`) VALUES
	(1, 'ANTEPROYECTO'),
	(2, 'SIN TRIBUNAL'),
	(3, 'CON TRIBUNAL'),
	(4, 'DEFENDIDO');

-- Volcando estructura para tabla gestion_titulacion.trabajo_estudiante
CREATE TABLE IF NOT EXISTS `trabajo_estudiante` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trabajo_id` int(11) NOT NULL,
  `estudiante_id` int(11) DEFAULT NULL,
  `intentos` int(11) NOT NULL DEFAULT 0,
  `resultado` enum('Aprobado','Reprobado','Pendiente') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `FK_trabajo_id` (`trabajo_id`),
  KEY `FK_estudiante_id` (`estudiante_id`),
  CONSTRAINT `FK_estudiante_trabajo_id` FOREIGN KEY (`estudiante_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_trabajo_id` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.trabajo_estudiante: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestion_titulacion.trabajo_titulacion
CREATE TABLE IF NOT EXISTS `trabajo_titulacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carrera_id` int(11) NOT NULL,
  `modalidad_id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `cotutor_id` int(11) DEFAULT NULL,
  `estado_id` int(11) NOT NULL DEFAULT 1,
  `fecha_defensa` datetime DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `link_anteproyecto` text NOT NULL,
  `link_final` text NOT NULL,
  `suplente_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_carrera_is` (`carrera_id`),
  KEY `FK_modlaiad_titulacion_id` (`modalidad_id`),
  KEY `FK_tutor_id` (`tutor_id`),
  KEY `FK_cotutor_id` (`cotutor_id`),
  KEY `FK_estado_id` (`estado_id`),
  KEY `FK_suplente_id` (`suplente_id`),
  CONSTRAINT `FK_cotutor_id` FOREIGN KEY (`cotutor_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_estado_id` FOREIGN KEY (`estado_id`) REFERENCES `trabajo_estado` (`id`),
  CONSTRAINT `FK_modlaiad_titulacion_id` FOREIGN KEY (`modalidad_id`) REFERENCES `sistema_modalidad_titulacion` (`id`),
  CONSTRAINT `FK_suplente_id` FOREIGN KEY (`suplente_id`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_trabajo_titulacion_sistema_carrera` FOREIGN KEY (`carrera_id`) REFERENCES `sistema_carrera` (`id`),
  CONSTRAINT `FK_tutor_id` FOREIGN KEY (`tutor_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.trabajo_titulacion: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestion_titulacion.trabajo_tribunal
CREATE TABLE IF NOT EXISTS `trabajo_tribunal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trabajo_id` int(11) NOT NULL,
  `docente_id` int(11) NOT NULL,
  `tribunal_rol_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_trabajo_tribunal_id` (`trabajo_id`),
  KEY `FK_docente_tribunal_id` (`docente_id`),
  KEY `FK_tribunal_rol_id` (`tribunal_rol_id`) USING BTREE,
  CONSTRAINT `FK_docente_tribunal_id` FOREIGN KEY (`docente_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FK_trabajo_tribunal_id` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`),
  CONSTRAINT `FK_tribunal_rol_id` FOREIGN KEY (`tribunal_rol_id`) REFERENCES `tribunal_rol` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.trabajo_tribunal: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestion_titulacion.tribunal_rol
CREATE TABLE IF NOT EXISTS `tribunal_rol` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.tribunal_rol: ~5 rows (aproximadamente)
INSERT INTO `tribunal_rol` (`id`, `nombre`) VALUES
	(1, 'DELEGADO/PRESIDENTE'),
	(2, 'DELEGADO H. CONSEJO DIRECTIVO'),
	(3, 'DOCENTE DEL ÁREA'),
	(4, 'DELEGADO COM. INVESTIGACIÓN CIENTIFÍCA'),
	(5, 'TUTOR DEL TRABAJO DE TITULACIÓN');

-- Volcando estructura para tabla gestion_titulacion.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) DEFAULT NULL,
  `id_personal` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `cedula` char(10) DEFAULT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.usuario: ~1 rows (aproximadamente)
INSERT INTO `usuario` (`id`, `usuario`, `id_personal`, `nombre`, `cedula`, `activo`) VALUES
	(1, 'admin', '1', 'ADMINISTRADOR', '1301234567', 1);

-- Volcando estructura para tabla gestion_titulacion.usuario_carrera
CREATE TABLE IF NOT EXISTS `usuario_carrera` (
  `id_usuario` int(11) NOT NULL,
  `id_carrera` int(11) NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_carrera`),
  KEY `id_carrera_FK` (`id_carrera`),
  CONSTRAINT `id_carrera_FK` FOREIGN KEY (`id_carrera`) REFERENCES `sistema_carrera` (`id`),
  CONSTRAINT `id_usuario_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.usuario_carrera: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestion_titulacion.usuario_rol
CREATE TABLE IF NOT EXISTS `usuario_rol` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_rol`),
  KEY `FK_id_usuario` (`id_usuario`),
  KEY `FK_id_rol` (`id_rol`),
  CONSTRAINT `FK_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `sistema_rol` (`id`),
  CONSTRAINT `FK_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.usuario_rol: ~1 rows (aproximadamente)
INSERT INTO `usuario_rol` (`id_usuario`, `id_rol`) VALUES
	(1, 1);

-- Volcando estructura para vista gestion_titulacion.vista_menu_rol
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_menu_rol` (
	`rol` INT(11) NOT NULL,
	`id` INT(11) NOT NULL,
	`menu_nombre` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`ruta` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`ruta_id` INT(11) NULL,
	`icon` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`padre` INT(11) NULL,
	`orden` INT(11) NULL,
	`todos` TINYINT(4) NOT NULL
);

-- Volcando estructura para vista gestion_titulacion.vista_roles_usuario
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_roles_usuario` (
	`id_usuario` INT(11) NOT NULL,
	`id` INT(11) NOT NULL,
	`nombre` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci'
);

-- Volcando estructura para vista gestion_titulacion.vista_rubricas_detalle
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_rubricas_detalle` (
	`rubrica_id` INT(11) NOT NULL,
	`tipo_evaluacion_id` INT(11) NOT NULL,
	`tipo_evaluacion_nombre` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`modalidad_id` INT(11) NOT NULL,
	`modalidad_nombre` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`criterio_nombre` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`puntaje_maximo` DECIMAL(5,2) NULL
);

-- Volcando estructura para vista gestion_titulacion.vista_rutas_rol
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_rutas_rol` (
	`rol` INT(11) NULL,
	`ruta` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci'
);

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_menu_rol`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_menu_rol` AS SELECT
    r.id AS rol,
    m.id AS id,
    m.nombre AS menu_nombre,
    rt.ruta AS ruta,
    rt.id AS ruta_id, 
    m.icon,
    m.padre_id AS padre,
    m.orden,
    m.todos
FROM
    sistema_menu m
LEFT JOIN sistema_ruta rt ON m.ruta_id = rt.id
JOIN sistema_rol r ON 
    m.todos = 1 OR -- Opción accesible para todos los roles
    r.id = 1 OR -- Administrador tiene acceso a todo
    r.id IN (
        SELECT rr.rol_id
        FROM sistema_rol_ruta rr
        WHERE rr.ruta_id = m.ruta_id
    )
ORDER BY
    m.orden 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_roles_usuario`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_roles_usuario` AS SELECT 
    u.id AS id_usuario,
    sr.id AS id,
    sr.nombre AS nombre
FROM 
    usuario u
JOIN 
    usuario_rol ur ON u.id = ur.id_usuario
JOIN 
    sistema_rol sr ON ur.id_rol = sr.id 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_rubricas_detalle`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_rubricas_detalle` AS SELECT 
    r.id AS rubrica_id,
    r.tipo_evaluacion_id,
    te.nombre AS tipo_evaluacion_nombre,
    r.modalidad_id,
    mt.nombre AS modalidad_nombre,
    rcr.nombre AS criterio_nombre,
    rcr.puntaje_maximo
FROM 
    rubrica r
JOIN 
    sistema_tipo_evaluacion te ON r.tipo_evaluacion_id = te.id
JOIN 
    sistema_modalidad_titulacion mt ON r.modalidad_id = mt.id
LEFT JOIN 
    rubrica_criterio rcr ON r.id = rcr.rubrica_id 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_rutas_rol`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_rutas_rol` AS SELECT
    r.id AS rol,
    ruta.ruta AS ruta
FROM
    sistema_ruta ruta
LEFT JOIN sistema_rol_ruta rr ON ruta.id = rr.ruta_id
LEFT JOIN sistema_rol r ON 
    r.id = 1 OR -- Administrador tiene acceso a todas las rutas
    ruta.id = 1 OR -- Todos los roles tienen acceso a la ruta "/"
    ruta.id = 14 OR -- Todos los roles tienen acceso a la ruta "/profile"
    r.id = rr.rol_id -- Acceso basado en las relaciones rol-ruta
ORDER BY
    ruta.id 
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
