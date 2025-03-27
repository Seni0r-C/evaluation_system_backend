-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.22-MariaDB - mariadb.org binary distribution
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
CREATE DATABASE IF NOT EXISTS `gestion_titulacion` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
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
  `fecha_hora_verbose` text NOT NULL,
  `ciudad` varchar(150) NOT NULL,
  `lugar` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trabajo_id` (`trabajo_id`),
  KEY `secretaria_id` (`secretaria_id`),
  KEY `vicedecano_id` (`vicedecano_id`),
  KEY `asesor_juridico_id` (`asesor_juridico_id`),
  CONSTRAINT `FK_acta_trabajo_titulacion` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`),
  CONSTRAINT `acta_ibfk_3` FOREIGN KEY (`vicedecano_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.acta: ~1 rows (aproximadamente)
INSERT INTO `acta` (`id`, `year`, `num_year_count`, `trabajo_id`, `secretaria_id`, `vicedecano_id`, `asesor_juridico_id`, `fecha_hora_verbose`, `ciudad`, `lugar`) VALUES
	(5, 2025, 0, 10, 0, 61, 0, '0000-00-00 00:00:00', '', '');

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.acta_notas_scheme: ~8 rows (aproximadamente)
INSERT INTO `acta_notas_scheme` (`id`, `comp_id`, `comp_parent_id`, `trabajo_modalidad_id`) VALUES
	(1, 2, 3, 1),
	(2, 1, 3, 1),
	(3, 3, NULL, 1),
	(4, 7, NULL, 1),
	(5, 1, NULL, 2),
	(6, 2, NULL, 2),
	(7, 1, NULL, 3),
	(8, 2, NULL, 3);

-- Volcando estructura para tabla gestion_titulacion.registro_accion
CREATE TABLE IF NOT EXISTS `registro_accion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `registro_accion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.registro_accion: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.rubrica: ~8 rows (aproximadamente)
INSERT INTO `rubrica` (`id`, `tipo_evaluacion_id`, `modalidad_id`) VALUES
	(1, 2, 3),
	(2, 1, 3),
	(3, 1, 2),
	(4, 2, 2),
	(5, 3, 1),
	(7, 7, 1),
	(8, 1, 1),
	(9, 2, 1);

-- Volcando estructura para tabla gestion_titulacion.rubrica_criterio
CREATE TABLE IF NOT EXISTS `rubrica_criterio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rubrica_id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `puntaje_maximo` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rubrica_id` (`rubrica_id`),
  CONSTRAINT `rubrica_criterio_ibfk_1` FOREIGN KEY (`rubrica_id`) REFERENCES `rubrica` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.rubrica_criterio: ~24 rows (aproximadamente)
INSERT INTO `rubrica_criterio` (`id`, `rubrica_id`, `nombre`, `puntaje_maximo`) VALUES
	(20, 8, 'Calidad de la exposición	', 30.00),
	(21, 7, 'Puntaje de prueba evirtual', 40.00),
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
	(33, 4, 'APLICACIÓN DEL MÉTODO CIENTIFICO EN EL ANÁLISIS Y SOLUCIÓN DEL PROBLEMA (El método es idóneo para atender la necesidad detectada)', 40.00),
	(34, 4, 'RIGOR CIENTÍFICO (Implica un control coherente de la planificación, el desarrollo y el análisis de la investigación. Definición adecuada de los contenidos en el objeto de estudio y que se explique y aplique con exactitud la metodología de trabajo).', 10.00),
	(35, 4, 'METODOLOGÍA UTILIZADA (Coherencia entre el tipo de estudio, diseño, métodos y técnicas se recogida y procesamiento de la información que lleven al alcance de los objetivos propuestos).', 10.00),
	(36, 4, 'ORIGINALIDAD (Incluye ideas o fragmentos de otros autores, siempre y debidamente citados y referenciados que se verifican en los resultados de la aplicación de la herramienta antiplagio).', 10.00),
	(37, 4, 'CAPACIDAD CREADORA (la forma en que se presenta la solución del problema tiene un enfoque innovador)', 10.00),
	(38, 4, 'PRESENTACIÓN DEL INFORME FINAL: (cuenta con los aspectos descritos en el reglamento y de desarrollan de manera coherente)', 20.00),
	(39, 3, 'CONTENIDO::>Calidad de la exposición de la sustentación tomando en cuenta la organización y contenido. (Presenta los aspectos más relevantes de la investigación de manera sistemática y coherente).', 30.00),
	(40, 3, 'CONTENIDO::>Dominio demostrado en el tema y sobre otros aspectos de la especialidad durante la exposición (utiliza lenguaje técnico propio de la profesión, demuestra dominio en los procesos, describe adecuadamente los resultados).', 20.00),
	(41, 3, 'PRESENTACIÓN::>Elaboración y uso de la ayuda de equipos en apoyo de la disertación (las diapositivas son claras, concretas direccionan adecuadamente la disertación).', 10.00),
	(42, 3, 'PRESENTACIÓN::>Manejo de la presentación y dominio del auditorio (demostró seguridad, centró la atención del tribunal).', 10.00),
	(43, 3, 'DISCUSIÓN::>Contenido y coherencia de la respuestas y explicaciones solicitadas por el tribunal (las respuestas responden a la inquietud del tribunal en función de la investigación y la experiencia del estudiante).', 30.00);

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
) ENGINE=InnoDB AUTO_INCREMENT=408 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.rubrica_evaluacion: ~99 rows (aproximadamente)
INSERT INTO `rubrica_evaluacion` (`id`, `trabajo_id`, `rubrica_id`, `rubrica_criterio_id`, `docente_id`, `estudiante_id`, `puntaje_obtenido`) VALUES
	(276, 10, 1, 22, 58, 3, 33.00),
	(277, 10, 1, 23, 58, 3, 10.00),
	(278, 10, 1, 24, 58, 3, 10.00),
	(279, 10, 1, 25, 58, 3, 10.00),
	(280, 10, 1, 26, 58, 3, 10.00),
	(281, 10, 1, 27, 58, 3, 20.00),
	(282, 10, 2, 28, 58, 3, 30.00),
	(283, 10, 2, 29, 58, 3, 20.00),
	(284, 10, 2, 30, 58, 3, 10.00),
	(285, 10, 2, 31, 58, 3, 10.00),
	(286, 10, 2, 32, 58, 3, 30.00),
	(287, 10, 1, 22, 58, 4, 33.00),
	(288, 10, 1, 23, 58, 4, 10.00),
	(289, 10, 1, 24, 58, 4, 10.00),
	(290, 10, 1, 25, 58, 4, 10.00),
	(291, 10, 1, 26, 58, 4, 10.00),
	(292, 10, 1, 27, 58, 4, 20.00),
	(293, 10, 2, 28, 58, 4, 30.00),
	(294, 10, 2, 29, 58, 4, 20.00),
	(295, 10, 2, 30, 58, 4, 10.00),
	(296, 10, 2, 31, 58, 4, 10.00),
	(297, 10, 2, 32, 58, 4, 30.00),
	(298, 10, 1, 22, 43, 3, 40.00),
	(299, 10, 1, 23, 43, 3, 10.00),
	(300, 10, 1, 24, 43, 3, 10.00),
	(301, 10, 1, 25, 43, 3, 10.00),
	(302, 10, 1, 26, 43, 3, 10.00),
	(303, 10, 1, 27, 43, 3, 11.00),
	(304, 10, 2, 28, 43, 3, 30.00),
	(305, 10, 2, 29, 43, 3, 20.00),
	(306, 10, 2, 30, 43, 3, 10.00),
	(307, 10, 2, 31, 43, 3, 10.00),
	(308, 10, 2, 32, 43, 3, 30.00),
	(309, 10, 1, 22, 43, 4, 40.00),
	(310, 10, 1, 23, 43, 4, 10.00),
	(311, 10, 1, 24, 43, 4, 10.00),
	(312, 10, 1, 25, 43, 4, 10.00),
	(313, 10, 1, 26, 43, 4, 10.00),
	(314, 10, 1, 27, 43, 4, 11.00),
	(315, 10, 2, 28, 43, 4, 22.00),
	(316, 10, 2, 29, 43, 4, 11.00),
	(317, 10, 2, 30, 43, 4, 10.00),
	(318, 10, 2, 31, 43, 4, 10.00),
	(319, 10, 2, 32, 43, 4, 30.00),
	(320, 10, 1, 22, 44, 3, 40.00),
	(321, 10, 1, 23, 44, 3, 10.00),
	(322, 10, 1, 24, 44, 3, 10.00),
	(323, 10, 1, 25, 44, 3, 10.00),
	(324, 10, 1, 26, 44, 3, 10.00),
	(325, 10, 1, 27, 44, 3, 20.00),
	(326, 10, 2, 28, 44, 3, 22.00),
	(327, 10, 2, 29, 44, 3, 20.00),
	(328, 10, 2, 30, 44, 3, 10.00),
	(329, 10, 2, 31, 44, 3, 10.00),
	(330, 10, 2, 32, 44, 3, 30.00),
	(331, 10, 1, 22, 44, 4, 40.00),
	(332, 10, 1, 23, 44, 4, 10.00),
	(333, 10, 1, 24, 44, 4, 10.00),
	(334, 10, 1, 25, 44, 4, 10.00),
	(335, 10, 1, 26, 44, 4, 10.00),
	(336, 10, 1, 27, 44, 4, 20.00),
	(337, 10, 2, 28, 44, 4, 29.00),
	(338, 10, 2, 29, 44, 4, 20.00),
	(339, 10, 2, 30, 44, 4, 10.00),
	(340, 10, 2, 31, 44, 4, 10.00),
	(341, 10, 2, 32, 44, 4, 30.00),
	(375, 19, 3, 39, 44, 47, 15.00),
	(376, 19, 3, 40, 44, 47, 20.00),
	(377, 19, 3, 41, 44, 47, 10.00),
	(378, 19, 3, 42, 44, 47, 10.00),
	(379, 19, 3, 43, 44, 47, 30.00),
	(380, 19, 4, 33, 44, 47, 24.00),
	(381, 19, 4, 34, 44, 47, 6.00),
	(382, 19, 4, 35, 44, 47, 6.00),
	(383, 19, 4, 36, 44, 47, 6.00),
	(384, 19, 4, 37, 44, 47, 6.00),
	(385, 19, 4, 38, 44, 47, 12.00),
	(386, 19, 3, 39, 43, 47, 30.00),
	(387, 19, 3, 40, 43, 47, 20.00),
	(388, 19, 3, 41, 43, 47, 10.00),
	(389, 19, 3, 42, 43, 47, 10.00),
	(390, 19, 3, 43, 43, 47, 30.00),
	(391, 19, 4, 33, 43, 47, 24.00),
	(392, 19, 4, 34, 43, 47, 6.00),
	(393, 19, 4, 35, 43, 47, 6.00),
	(394, 19, 4, 36, 43, 47, 6.00),
	(395, 19, 4, 37, 43, 47, 6.00),
	(396, 19, 4, 38, 43, 47, 12.00),
	(397, 19, 3, 39, 58, 47, 20.00),
	(398, 19, 3, 40, 58, 47, 20.00),
	(399, 19, 3, 41, 58, 47, 10.00),
	(400, 19, 3, 42, 58, 47, 10.00),
	(401, 19, 3, 43, 58, 47, 30.00),
	(402, 19, 4, 33, 58, 47, 24.00),
	(403, 19, 4, 34, 58, 47, 6.00),
	(404, 19, 4, 35, 58, 47, 6.00),
	(405, 19, 4, 36, 58, 47, 6.00),
	(406, 19, 4, 37, 58, 47, 6.00),
	(407, 19, 4, 38, 58, 47, 12.00);

-- Volcando estructura para tabla gestion_titulacion.sistema_carrera
CREATE TABLE IF NOT EXISTS `sistema_carrera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.sistema_carrera: ~2 rows (aproximadamente)
INSERT INTO `sistema_carrera` (`id`, `nombre`) VALUES
	(4, 'INGENIERIA EN SISTEMAS INFORMATICOS'),
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.sistema_menu: ~13 rows (aproximadamente)
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
	(15, 'Menu', 21, 2, 5, 0, ''),
	(20, 'Manuxi', NULL, NULL, 8, 0, '');

-- Volcando estructura para tabla gestion_titulacion.sistema_modalidad_titulacion
CREATE TABLE IF NOT EXISTS `sistema_modalidad_titulacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `max_participantes` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.sistema_modalidad_titulacion: ~3 rows (aproximadamente)
INSERT INTO `sistema_modalidad_titulacion` (`id`, `nombre`, `max_participantes`) VALUES
	(1, 'Examen Complexivo', 1),
	(2, 'Artículo Científico', 1),
	(3, 'Propuesta Tecnológica', 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

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
  CONSTRAINT `FK_rol_id` FOREIGN KEY (`rol_id`) REFERENCES `sistema_rol` (`id`),
  CONSTRAINT `FK_ruta_id` FOREIGN KEY (`ruta_id`) REFERENCES `sistema_ruta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.sistema_tipo_evaluacion: ~4 rows (aproximadamente)
INSERT INTO `sistema_tipo_evaluacion` (`id`, `nombre`) VALUES
	(1, 'DEFENSA'),
	(2, 'INFORME FINAL'),
	(3, 'EXAMEN PRACTICO'),
	(7, 'EXAMEN TEORICO');

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
  CONSTRAINT `FK_estudiante_excepcion_id` FOREIGN KEY (`estudiante_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FK_trabajo_excepcion_id` FOREIGN KEY (`trabajo_id`) REFERENCES `trabajo_titulacion` (`id`),
  CONSTRAINT `FK_vicedecano_is` FOREIGN KEY (`vicedecano_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.solicitud_excepcion: ~0 rows (aproximadamente)

-- Volcando estructura para tabla gestion_titulacion.trabajo_estado
CREATE TABLE IF NOT EXISTS `trabajo_estado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.trabajo_estudiante: ~10 rows (aproximadamente)
INSERT INTO `trabajo_estudiante` (`id`, `trabajo_id`, `estudiante_id`, `intentos`, `resultado`) VALUES
	(1, 10, 4, 0, 'Pendiente'),
	(2, 10, 3, 0, 'Pendiente'),
	(3, 11, 3, 0, 'Pendiente'),
	(4, 11, 4, 0, 'Pendiente'),
	(5, 12, 27, 0, 'Pendiente'),
	(6, 13, 27, 0, 'Pendiente'),
	(7, 18, 27, 0, 'Pendiente'),
	(8, 19, 47, 0, 'Pendiente'),
	(9, 20, 47, 0, 'Pendiente'),
	(10, 21, 48, 0, 'Pendiente');

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
  CONSTRAINT `FK_cotutor_id` FOREIGN KEY (`cotutor_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_estado_id` FOREIGN KEY (`estado_id`) REFERENCES `trabajo_estado` (`id`),
  CONSTRAINT `FK_modlaiad_titulacion_id` FOREIGN KEY (`modalidad_id`) REFERENCES `sistema_modalidad_titulacion` (`id`),
  CONSTRAINT `FK_trabajo_titulacion_sistema_carrera` FOREIGN KEY (`carrera_id`) REFERENCES `sistema_carrera` (`id`),
  CONSTRAINT `FK_tutor_id` FOREIGN KEY (`tutor_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.trabajo_titulacion: ~8 rows (aproximadamente)
INSERT INTO `trabajo_titulacion` (`id`, `carrera_id`, `modalidad_id`, `tutor_id`, `cotutor_id`, `estado_id`, `fecha_defensa`, `titulo`, `link_anteproyecto`, `link_final`) VALUES
	(10, 4, 3, 2, NULL, 4, '2025-03-07 07:50:00', '	Aplicación web para la medición del nivel de transformación digital para Instituciones de Educación Superior (IES)', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view', ''),
	(11, 4, 3, 2, NULL, 2, '2025-02-15 08:11:00', 'Desarrollo de una plataforma para enseñanza de la física universitaria desde dispositivo multisensorial', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view', 'google.com'),
	(12, 4, 3, 14, 21, 3, '2025-02-01 10:46:00', 'Redes neuronales convulucionales para mejorar la resolución de imágenes medicas', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view', ''),
	(13, 4, 3, 21, 14, 1, NULL, 'Word Embedding en documentos médicos através dela aplicación de Word2Vec y Doc2Vec', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view', ''),
	(18, 4, 3, 21, 21, 1, NULL, 'Aplicación de Técnicas de Aprendizaje Automático para predecir áreas en riesgo de incendio forestal', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view', ''),
	(19, 4, 2, 8, NULL, 4, '2025-03-05 08:16:00', 'Diseño de un esquema arquitectónico para integrar sistemas monolíticos con arquitecturas emergentes', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view', ''),
	(20, 4, 1, 14, NULL, 2, '2025-02-14 09:00:00', 'Caso de estudio: App bibliotecaria', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view'),
	(21, 4, 3, 21, NULL, 2, NULL, 'Artificial intelligence (AI) applications for marketing: A literature-based study', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view', 'https://drive.google.com/file/d/17U6Pn-8IpUmS6pDc2VSR7T9Rm4tsNd7b/view');

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
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.trabajo_tribunal: ~15 rows (aproximadamente)
INSERT INTO `trabajo_tribunal` (`id`, `trabajo_id`, `docente_id`, `tribunal_rol_id`) VALUES
	(40, 11, 58, 2),
	(41, 11, 43, 3),
	(42, 11, 44, 4),
	(43, 12, 44, 2),
	(44, 12, 43, 3),
	(45, 12, 58, 4),
	(49, 20, 58, 2),
	(50, 20, 14, 3),
	(51, 20, 44, 4),
	(52, 10, 58, 2),
	(53, 10, 43, 3),
	(54, 10, 44, 4),
	(55, 19, 58, 2),
	(56, 19, 43, 3),
	(57, 19, 44, 4);

-- Volcando estructura para tabla gestion_titulacion.tribunal_rol
CREATE TABLE IF NOT EXISTS `tribunal_rol` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

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
  `usuario` varchar(100) NOT NULL,
  `id_personal` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `id_personal` (`id_personal`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.usuario: ~37 rows (aproximadamente)
INSERT INTO `usuario` (`id`, `usuario`, `id_personal`, `nombre`) VALUES
	(2, 'vargas', '235657', 'JUAN SILVO VARGAS VERDES'),
	(3, 'xd', '104421', 'JOSTON JARZTA HICENBERZ GEORGEOUS'),
	(4, 'sfdfsdf', '104420', 'DANIELA VICTORIA MENDOZA PEREZ'),
	(5, 'luis.torres', '542562', 'JOSE LUIS FRANCHEZCO TORRES'),
	(6, 'sofia.gonzalez', '565425', 'MARIA SOFIA GONZALES BENAVIDES'),
	(7, 'pablo.fernandez', '232335', 'PABLO MONTALVO MERA ALCIVAR'),
	(8, 'clara.mendez', '412147', 'CLARA BONELLA DIMATRIZ CUZCO'),
	(9, 'martin.vega', '787456', 'MARTIN JUDAS VEGA NIKOLO'),
	(10, 'raul.lopez', '361239', 'RAUL HECTOR REINA DENADA'),
	(11, 'veronica.castro', '142787', 'VERONICA MANCILLO CASTRO MERA'),
	(12, 'ricardo.morales', '252568', 'RICARDO FABIAN GUILLEN MORA'),
	(13, 'patricia.rios', '223302', 'PATRICIA BRIONES DE POGUI'),
	(14, 'juan.garcia@estudiante.com', '456567', 'JUAN FERNANDO VERLASQUEZ SANTOS'),
	(15, 'laura.hernandez@estudiante.com', '453767', 'LAURA MARLENE MATINEZ POSLIGUA'),
	(16, 'carlos.jimenez@estudiante.com', '121988', 'CARLOS JIMENEZ ESTUDI ANTEUTM'),
	(17, 'ana.morales@estudiante.com', '533223', 'ANA LUCIA FERNANDEZ BERNARDA'),
	(18, 'jorge.ruiz@estudiante.com', '212543', 'JOGUE AUGUSTO NEVER KRAKEN'),
	(19, 'elena.martin@estudiante.com', '124343', 'ELENA MARIA SUPLEMACIA ZAMBRANO'),
	(20, 'felipe.diaz@estudiante.com', '564932', 'FELIPE FILOMENO PERCEDEZ HUAVILIO'),
	(21, 'beatriz.sanchez@estudiante.com', '354678', 'BEATRIZ SALAZAR FENANDEZ GARCIA'),
	(22, 'david.torres@estudiante.com', '435878', 'DAVID FERNANDO FILOMENO ALCIVAR'),
	(23, 'mercedes.jimenez@estudiante.com', '5432256', 'GEMA JULIETA MERCEDES CHAVEZ'),
	(27, 'carteaga7126', '104419', 'ARTEAGA TORO CARLOS LUIS'),
	(38, 'mgiler2846', '73146', 'GILER MENENDEZ MARCO TULIO'),
	(39, 'vicedecano', '12342', 'KATTY GARCIA BARREIRO VERA'),
	(40, 'tutor', '56709', 'CARLOS MANICHO VENEZUELO MANGIZO'),
	(41, 'carlos', '19360', 'ANA GABRIELA YUKATAN SLOVAKY'),
	(43, 'tribunal', '12351', 'PEDRO MANOLO ANESTECIO ONETWO'),
	(44, 'estudiante', '19351', 'TAMIÑAWI SUMI SUMIWKA MANIKO'),
	(47, 'alumno', '19359', 'JAIME ENRIQUYE ALMIGUEZ GONZALEZ'),
	(48, 'cubillus2854', '165344', 'UBILLUS BUSTAMANTE CRISTOPHER ALEXANDER'),
	(49, 'jrodriguez7603', '106916', 'RODRIGUEZ ZAMBRANO JOSTIN ANDRES'),
	(54, 'admin', '15390', 'VERGAS ANTONIO RESABALA CHICUNGUNYIA'),
	(58, 'tutora', '22360', 'ANA GABRIELA YUKATAN SLOVAKY'),
	(61, 'preside', '12382', 'HAROLD OMAR GARCIA VILLANUEVA'),
	(62, 'alumna', '19355', 'AGUINALDA GUISELLE VALIVIEZO JILIWE'),
	(63, 'pupilo', '34351', 'SANTIAGO SEGUNDO PACHECO VEREDICTO');

-- Volcando estructura para tabla gestion_titulacion.usuario_carrera
CREATE TABLE IF NOT EXISTS `usuario_carrera` (
  `id_usuario` int(11) NOT NULL,
  `id_carrera` int(11) NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_carrera`),
  KEY `id_carrera_FK` (`id_carrera`),
  CONSTRAINT `id_carrera_FK` FOREIGN KEY (`id_carrera`) REFERENCES `sistema_carrera` (`id`),
  CONSTRAINT `id_usuario_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.usuario_carrera: ~15 rows (aproximadamente)
INSERT INTO `usuario_carrera` (`id_usuario`, `id_carrera`) VALUES
	(27, 4),
	(38, 4),
	(39, 4),
	(40, 4),
	(41, 4),
	(43, 4),
	(44, 4),
	(47, 4),
	(48, 4),
	(49, 4),
	(54, 4),
	(58, 4),
	(61, 4),
	(62, 4),
	(63, 4);

-- Volcando estructura para tabla gestion_titulacion.usuario_rol
CREATE TABLE IF NOT EXISTS `usuario_rol` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_rol`),
  KEY `FK_id_usuario` (`id_usuario`),
  KEY `FK_id_rol` (`id_rol`),
  CONSTRAINT `FK_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `sistema_rol` (`id`),
  CONSTRAINT `FK_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla gestion_titulacion.usuario_rol: ~18 rows (aproximadamente)
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
	(48, 4),
	(49, 1),
	(54, 1),
	(58, 3),
	(61, 3),
	(62, 4),
	(63, 4);

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
