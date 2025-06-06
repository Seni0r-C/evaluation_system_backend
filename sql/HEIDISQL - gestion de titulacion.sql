-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
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

-- Volcando estructura para tabla gestion_titulacion.registro_accion
CREATE TABLE IF NOT EXISTS `registro_accion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `registro_accion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.registro_accion: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestion_titulacion.rubrica
CREATE TABLE IF NOT EXISTS `rubrica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_evaluacion_id` int(11) NOT NULL,
  `modalidad_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rubrica_ibfk_1` (`modalidad_id`),
  KEY `FK_tipo_evaluacion_id` (`tipo_evaluacion_id`),
  CONSTRAINT `FK_tipo_evaluacion_id` FOREIGN KEY (`tipo_evaluacion_id`) REFERENCES `sistema_tipo_evaluacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rubrica_ibfk_1` FOREIGN KEY (`modalidad_id`) REFERENCES `sistema_modalidad_titulacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.rubrica: ~5 rows (aproximadamente)
INSERT INTO `rubrica` (`id`, `tipo_evaluacion_id`, `modalidad_id`) VALUES
	(1, 2, 3),
	(2, 1, 3),
	(3, 1, 2),
	(4, 2, 2),
	(5, 3, 1);

-- Volcando estructura para tabla gestion_titulacion.rubrica_criterio
CREATE TABLE IF NOT EXISTS `rubrica_criterio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rubrica_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `puntaje_maximo` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rubrica_id` (`rubrica_id`),
  CONSTRAINT `rubrica_criterio_ibfk_1` FOREIGN KEY (`rubrica_id`) REFERENCES `rubrica` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.rubrica_criterio: ~17 rows (aproximadamente)
INSERT INTO `rubrica_criterio` (`id`, `rubrica_id`, `nombre`, `puntaje_maximo`) VALUES
	(1, 1, 'APLICACIÓN DEL MÉTODO CIENTIFICO EN EL ANÁLISIS Y SOLUCIÓN DEL PROBLEMA', 40.00),
	(2, 1, 'RIGOR CIENTÍFICO', 10.00),
	(5, 1, 'METODOLOGÍA UTILIZADA', 10.00),
	(6, 1, 'ORIGINALIDAD', 10.00),
	(7, 1, 'CAPACIDAD CREADORA', 10.00),
	(8, 1, 'PRESENTACIÓN DEL INFORME', 20.00),
	(9, 2, 'Calidad de la exposición', 30.00),
	(10, 2, 'Dominio demostrado en el tema', 20.00),
	(11, 2, 'Elaboración y uso de la ayuda de equipos en apoyo de la disertación', 10.00),
	(12, 2, 'Manejo de la presentación', 10.00),
	(13, 2, 'Contenido y coherencia de la respuestas', 30.00),
	(14, 4, 'Indexación', 80.00),
	(15, 3, 'Calidad de la exposición', 30.00),
	(16, 3, 'Dominio demostrado en el tema', 20.00),
	(17, 3, 'Elaboración y uso de la ayuda de equipos en apoyo de la disertación', 20.00),
	(18, 3, 'Manejo de la presentación', 10.00),
	(19, 3, 'Contenido y coherencia de la respuestas', 30.00);

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
  CONSTRAINT `FK_docente_id` FOREIGN KEY (`docente_id`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_estudiante_evaluacion_id` FOREIGN KEY (`estudiante_id`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_rubrica_criterio_id` FOREIGN KEY (`rubrica_criterio_id`) REFERENCES `rubrica_criterio` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_rubrica_id` FOREIGN KEY (`rubrica_id`) REFERENCES `rubrica` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_trabajo_evaluacion_id` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.rubrica_evaluacion: ~22 rows (aproximadamente)
INSERT INTO `rubrica_evaluacion` (`id`, `trabajo_id`, `rubrica_id`, `rubrica_criterio_id`, `docente_id`, `estudiante_id`, `puntaje_obtenido`) VALUES
	(1, 10, 2, 9, 27, 3, 30.00),
	(2, 10, 2, 10, 27, 3, 20.00),
	(3, 10, 2, 11, 27, 3, 10.00),
	(4, 10, 2, 12, 27, 3, 10.00),
	(5, 10, 2, 13, 27, 3, 30.00),
	(6, 10, 1, 1, 27, 3, 37.00),
	(7, 10, 1, 2, 27, 3, 10.00),
	(8, 10, 1, 5, 27, 3, 10.00),
	(9, 10, 1, 6, 27, 3, 10.00),
	(10, 10, 1, 7, 27, 3, 10.00),
	(11, 10, 1, 8, 27, 3, 20.00),
	(12, 10, 2, 9, 27, 4, 30.00),
	(13, 10, 2, 10, 27, 4, 20.00),
	(14, 10, 2, 11, 27, 4, 10.00),
	(15, 10, 2, 12, 27, 4, 10.00),
	(16, 10, 2, 13, 27, 4, 30.00),
	(17, 10, 1, 1, 27, 4, 40.00),
	(18, 10, 1, 2, 27, 4, 10.00),
	(19, 10, 1, 5, 27, 4, 10.00),
	(20, 10, 1, 6, 27, 4, 10.00),
	(21, 10, 1, 7, 27, 4, 10.00),
	(22, 10, 1, 8, 27, 4, 20.00);

-- Volcando estructura para tabla gestion_titulacion.sistema_carrera
CREATE TABLE IF NOT EXISTS `sistema_carrera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_carrera: ~3 rows (aproximadamente)
INSERT INTO `sistema_carrera` (`id`, `nombre`) VALUES
	(4, 'INGENIERIA EN SISTEMAS INFORMATICOS'),
	(5, 'GENERAL'),
	(6, 'NIV. - SISTEMAS DE INFORMACION');

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
  CONSTRAINT `FK_id_ruta` FOREIGN KEY (`ruta_id`) REFERENCES `sistema_ruta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_padre_id` FOREIGN KEY (`padre_id`) REFERENCES `sistema_menu` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_menu: ~12 rows (aproximadamente)
INSERT INTO `sistema_menu` (`id`, `nombre`, `ruta_id`, `padre_id`, `orden`, `todos`, `icon`) VALUES
	(1, 'Inicio', 1, NULL, 1, 1, 'home'),
	(2, 'Administrar Sistema', NULL, NULL, 2, 1, 'items'),
	(3, 'Modalidades de Titulación', 3, 2, 2, 0, NULL),
	(5, 'Items de rúbrica', 5, 2, 3, 0, NULL),
	(6, 'Registro Anteproyecto', 6, NULL, 3, 0, 'subir'),
	(7, 'Registro Trabajo Final', 22, NULL, 4, 0, 'subir'),
	(8, 'Asignación Tribunal', 8, NULL, 5, 0, 'asignar'),
	(9, 'Calificación Trabajos', 9, NULL, 6, 0, 'calificar'),
	(10, 'Documento calificación', 10, NULL, 7, 0, 'reporte'),
	(12, 'Carreras', 15, 2, 1, 0, ''),
	(14, 'Rutas', 19, 2, 4, 0, ''),
	(15, 'Menu', 21, 2, 5, 0, '');

-- Volcando estructura para tabla gestion_titulacion.sistema_modalidad_titulacion
CREATE TABLE IF NOT EXISTS `sistema_modalidad_titulacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `max_participantes` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_modalidad_titulacion: ~4 rows (aproximadamente)
INSERT INTO `sistema_modalidad_titulacion` (`id`, `nombre`, `max_participantes`) VALUES
	(1, 'Examen Complexivo', 1),
	(2, 'Artículo Científico', 1),
	(3, 'Propuesta Tecnológica', 2),
	(6, 'tirarse de un puente', 1);

-- Volcando estructura para tabla gestion_titulacion.sistema_modalidad_titulacion_carrera
CREATE TABLE IF NOT EXISTS `sistema_modalidad_titulacion_carrera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_carrera` int(11) NOT NULL,
  `id_modalidad_titulacion` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_id_carrera` (`id_carrera`),
  KEY `FK_id_modalidad_titulacion` (`id_modalidad_titulacion`),
  CONSTRAINT `FK_id_modalidad_titulacion` FOREIGN KEY (`id_modalidad_titulacion`) REFERENCES `sistema_modalidad_titulacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_modalidad_titulacion_carrera_sistema_carrera` FOREIGN KEY (`id_carrera`) REFERENCES `sistema_carrera` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_rol: ~8 rows (aproximadamente)
INSERT INTO `sistema_rol` (`id`, `nombre`) VALUES
	(1, 'ADMINISTRACIÓN'),
	(2, 'SECRETARíA'),
	(3, 'DOCENTE'),
	(4, 'ESTUDIANTE'),
	(9, 'VALIDADOR DE CONGRESO'),
	(10, 'VICEDECANATO'),
	(11, 'DECANATO'),
	(12, 'TUTOR');

-- Volcando estructura para tabla gestion_titulacion.sistema_rol_ruta
CREATE TABLE IF NOT EXISTS `sistema_rol_ruta` (
  `rol_id` int(11) NOT NULL,
  `ruta_id` int(11) NOT NULL,
  PRIMARY KEY (`rol_id`,`ruta_id`) USING BTREE,
  KEY `FK_ruta_id` (`ruta_id`),
  CONSTRAINT `FK_rol_id` FOREIGN KEY (`rol_id`) REFERENCES `sistema_rol` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ruta_id` FOREIGN KEY (`ruta_id`) REFERENCES `sistema_ruta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_rol_ruta: ~7 rows (aproximadamente)
INSERT INTO `sistema_rol_ruta` (`rol_id`, `ruta_id`) VALUES
	(2, 6),
	(3, 6),
	(3, 7),
	(3, 9),
	(3, 11),
	(3, 13),
	(10, 10);

-- Volcando estructura para tabla gestion_titulacion.sistema_ruta
CREATE TABLE IF NOT EXISTS `sistema_ruta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ruta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_ruta: ~16 rows (aproximadamente)
INSERT INTO `sistema_ruta` (`id`, `ruta`) VALUES
	(1, '/'),
	(3, '/modalidades'),
	(5, '/items-rubrica'),
	(6, '/registro-anteproyecto'),
	(7, '/registro-proyecto-titulacion'),
	(8, '/asignacion-de-tribunal'),
	(9, '/calificacion-de-trabajo-titulacion'),
	(10, '/generacion-de-documento'),
	(11, '/calificar'),
	(12, '/trabajos-titulacion-realizados'),
	(13, '/trabajos-titulacion'),
	(14, '/profile'),
	(15, '/carreras'),
	(19, '/rutas'),
	(21, '/menu'),
	(22, '/registro-trabajo-final');

-- Volcando estructura para tabla gestion_titulacion.sistema_tipo_evaluacion
CREATE TABLE IF NOT EXISTS `sistema_tipo_evaluacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.sistema_tipo_evaluacion: ~3 rows (aproximadamente)
INSERT INTO `sistema_tipo_evaluacion` (`id`, `nombre`) VALUES
	(1, 'Defensa'),
	(2, 'Informe Escrito'),
	(3, 'Caso Practico');

-- Volcando estructura para tabla gestion_titulacion.solicitud_excepcion
CREATE TABLE IF NOT EXISTS `solicitud_excepcion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trabajo_id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `estado` enum('Aprobada','Rechazada','Pendiente') NOT NULL DEFAULT 'Pendiente',
  `vicedecano_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_trabajo_excepcion_id` (`trabajo_id`),
  KEY `FK_estudiante_excepcion_id` (`estudiante_id`),
  KEY `FK_vicedecano_is` (`vicedecano_id`),
  CONSTRAINT `FK_estudiante_excepcion_id` FOREIGN KEY (`estudiante_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_trabajo_excepcion_id` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_vicedecano_is` FOREIGN KEY (`vicedecano_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.solicitud_excepcion: ~0 rows (aproximadamente)

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
  CONSTRAINT `FK_estudiante_trabajo_id` FOREIGN KEY (`estudiante_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_trabajo_id` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.trabajo_estudiante: ~8 rows (aproximadamente)
INSERT INTO `trabajo_estudiante` (`id`, `trabajo_id`, `estudiante_id`, `intentos`, `resultado`) VALUES
	(1, 10, 4, 0, 'Pendiente'),
	(2, 10, 3, 0, 'Pendiente'),
	(3, 11, 3, 0, 'Pendiente'),
	(4, 11, 4, 0, 'Pendiente'),
	(5, 12, 27, 0, 'Pendiente'),
	(6, 13, 27, 0, 'Pendiente'),
	(7, 18, 27, 0, 'Pendiente'),
	(8, 19, 47, 0, 'Pendiente');

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
  PRIMARY KEY (`id`),
  KEY `FK_carrera_is` (`carrera_id`),
  KEY `FK_modlaiad_titulacion_id` (`modalidad_id`),
  KEY `FK_tutor_id` (`tutor_id`),
  KEY `FK_cotutor_id` (`cotutor_id`),
  KEY `FK_estado_id` (`estado_id`),
  CONSTRAINT `FK_cotutor_id` FOREIGN KEY (`cotutor_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_estado_id` FOREIGN KEY (`estado_id`) REFERENCES `trabajo_estado` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_modlaiad_titulacion_id` FOREIGN KEY (`modalidad_id`) REFERENCES `sistema_modalidad_titulacion` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_trabajo_titulacion_sistema_carrera` FOREIGN KEY (`carrera_id`) REFERENCES `sistema_carrera` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_tutor_id` FOREIGN KEY (`tutor_id`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.trabajo_titulacion: ~6 rows (aproximadamente)
INSERT INTO `trabajo_titulacion` (`id`, `carrera_id`, `modalidad_id`, `tutor_id`, `cotutor_id`, `estado_id`, `fecha_defensa`, `titulo`, `link_anteproyecto`, `link_final`) VALUES
	(10, 4, 3, 2, NULL, 4, '2025-01-06 00:00:00', 'JIJIJA', ':)))', ''),
	(11, 4, 3, 2, NULL, 3, '2025-01-27 04:01:00', 'JIIJA', 'sdfghsdfgjsdfg', 'google.com'),
	(12, 4, 3, 14, 21, 1, NULL, 'dasdsa', 'asdasdasd', ''),
	(13, 4, 3, 21, 14, 1, NULL, 'JIJIJA GAMING', 'sdasdas', ''),
	(18, 4, 3, 21, 21, 1, NULL, 'dasd', 'asdsad', ''),
	(19, 4, 2, 8, NULL, 2, '2025-01-08 09:42:00', 'ejemplo', '123456789', '');

-- Volcando estructura para tabla gestion_titulacion.trabajo_tribunal
CREATE TABLE IF NOT EXISTS `trabajo_tribunal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trabajo_id` int(11) NOT NULL,
  `docente_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_trabajo_tribunal_id` (`trabajo_id`),
  KEY `FK_docente_tribunal_id` (`docente_id`),
  CONSTRAINT `FK_docente_tribunal_id` FOREIGN KEY (`docente_id`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_trabajo_tribunal_id` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.trabajo_tribunal: ~9 rows (aproximadamente)
INSERT INTO `trabajo_tribunal` (`id`, `trabajo_id`, `docente_id`) VALUES
	(1, 10, 21),
	(2, 10, 14),
	(3, 10, 8),
	(4, 19, 21),
	(5, 19, 8),
	(6, 19, 43),
	(7, 11, 8),
	(8, 11, 21),
	(9, 11, 14);

-- Volcando estructura para tabla gestion_titulacion.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) NOT NULL,
  `id_personal` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `id_personal` (`id_personal`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.usuario: ~30 rows (aproximadamente)
INSERT INTO `usuario` (`id`, `usuario`, `id_personal`, `nombre`) VALUES
	(2, 'VArgas@Vargas.Vargas', '235657', 'Vargas'),
	(3, 'xd', '104421', 'Joston'),
	(4, 'sfdfsdf', '104420', 'Daniela'),
	(5, 'luis.torres@docente.com', '542562', 'Luis'),
	(6, 'sofia.gonzalez@docente.com', '565425', 'Sofía'),
	(7, 'pablo.fernandez@docente.com', '232335', 'Pablo'),
	(8, 'clara.mendez@docente.com', '412147', 'Clara'),
	(9, 'martin.vega@docente.com', '787456', 'Martín'),
	(10, 'raul.lopez@docente.com', '361239', 'Raúl'),
	(11, 'veronica.castro@docente.com', '142787', 'Verónica'),
	(12, 'ricardo.morales@docente.com', '252568', 'Ricardo'),
	(13, 'patricia.rios@docente.com', '223302', 'Patricia'),
	(14, 'juan.garcia@estudiante.com', '456567', 'Juan'),
	(15, 'laura.hernandez@estudiante.com', '453767', 'Laura'),
	(16, 'carlos.jimenez@estudiante.com', '121988', 'Carlos'),
	(17, 'ana.morales@estudiante.com', '533223', 'Ana'),
	(18, 'jorge.ruiz@estudiante.com', '212543', 'Jorge'),
	(19, 'elena.martin@estudiante.com', '124343', 'Elena'),
	(20, 'felipe.diaz@estudiante.com', '564932', 'Felipe'),
	(21, 'beatriz.sanchez@estudiante.com', '354678', 'Beatriz'),
	(22, 'david.torres@estudiante.com', '435878', 'David'),
	(23, 'mercedes.jimenez@estudiante.com', '5432256', 'Mercedes'),
	(27, 'carteaga7126', '104419', 'ARTEAGA TORO CARLOS LUIS'),
	(38, 'mgiler2846', '73146', 'GILER MENENDEZ MARCO TULIO'),
	(39, 'vicedecano', '12342', 'KATTY GARCIA BARREIRO VERA'),
	(40, 'tutor', '56709', 'CARLOS MANICHO VENEZUELO MANGIZO'),
	(41, 'carlos', '19360', 'ANA GABRIELA YUKATAN SLOVAKY'),
	(43, 'tribunal', '12351', 'PEDRO MANOLO ANESTECIO ONETWO'),
	(44, 'estudiante', '19351', 'TAMIÑAWI SUMI SUMIWKA MANIKO'),
	(47, 'alumno', '19359', 'JAIME ENRIQUYE ALMIGUEZ GONZALEZ'),
	(48, 'cubillus2854', '165344', 'UBILLUS BUSTAMANTE CRISTOPHER ALEXANDER');

-- Volcando estructura para tabla gestion_titulacion.usuario_carrera
CREATE TABLE IF NOT EXISTS `usuario_carrera` (
  `id_usuario` int(11) NOT NULL,
  `id_carrera` int(11) NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_carrera`),
  KEY `id_carrera_FK` (`id_carrera`),
  CONSTRAINT `id_carrera_FK` FOREIGN KEY (`id_carrera`) REFERENCES `sistema_carrera` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `id_usuario_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.usuario_carrera: ~8 rows (aproximadamente)
INSERT INTO `usuario_carrera` (`id_usuario`, `id_carrera`) VALUES
	(27, 4),
	(38, 4),
	(39, 4),
	(40, 4),
	(41, 4),
	(43, 4),
	(44, 4),
	(47, 4),
	(48, 4);

-- Volcando estructura para tabla gestion_titulacion.usuario_rol
CREATE TABLE IF NOT EXISTS `usuario_rol` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_rol`),
  KEY `FK_id_usuario` (`id_usuario`),
  KEY `FK_id_rol` (`id_rol`),
  CONSTRAINT `FK_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `sistema_rol` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla gestion_titulacion.usuario_rol: ~11 rows (aproximadamente)
INSERT INTO `usuario_rol` (`id_usuario`, `id_rol`) VALUES
	(8, 3),
	(14, 3),
	(21, 3),
	(27, 1),
	(38, 9),
	(39, 10),
	(40, 4),
	(41, 1),
	(43, 3),
	(44, 3),
	(47, 4),
	(48, 4);

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
) ENGINE=MyISAM;

-- Volcando estructura para vista gestion_titulacion.vista_roles_usuario
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_roles_usuario` (
	`id_usuario` INT(11) NOT NULL,
	`id` INT(11) NOT NULL,
	`nombre` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci'
) ENGINE=MyISAM;

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
) ENGINE=MyISAM;

-- Volcando estructura para vista gestion_titulacion.vista_rutas_rol
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_rutas_rol` (
	`rol` INT(11) NULL,
	`ruta` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci'
) ENGINE=MyISAM;

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
