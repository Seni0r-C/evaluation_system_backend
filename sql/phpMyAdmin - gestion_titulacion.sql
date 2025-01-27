-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-01-2025 a las 10:40:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestiongimnasio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `ID_Asistencia` int(11) NOT NULL,
  `Fecha` datetime NOT NULL,
  `ID_Miembro` int(11) NOT NULL,
  `ID_Horario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`ID_Asistencia`, `Fecha`, `ID_Miembro`, `ID_Horario`) VALUES
(1, '2025-01-20 09:00:00', 1, 1),
(2, '2025-01-20 10:00:00', 2, 2),
(3, '2025-01-21 11:00:00', 3, 3),
(4, '2025-01-22 12:00:00', 4, 4),
(5, '2025-01-23 13:00:00', 5, 5),
(6, '2025-01-24 14:00:00', 6, 6),
(7, '2025-01-25 15:00:00', 7, 7),
(8, '2025-01-26 16:00:00', 8, 8),
(9, '2025-01-27 17:00:00', 9, 9),
(10, '2025-01-28 18:00:00', 10, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clase`
--

CREATE TABLE `clase` (
  `ID_Clase` int(11) NOT NULL,
  `Nombre_Clase` varchar(50) NOT NULL,
  `Descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clase`
--

INSERT INTO `clase` (`ID_Clase`, `Nombre_Clase`, `Descripcion`) VALUES
(1, 'Yoga', 'Clase de yoga para todos los niveles'),
(2, 'Crossfit', 'Entrenamiento de alta intensidad'),
(3, 'Zumba', 'Baile fitness para mejorar la resistencia'),
(4, 'Pilates', 'Ejercicios de fortalecimiento y flexibilidad'),
(5, 'Kickboxing', 'Defensa personal y cardio'),
(6, 'Spinning', 'Ciclismo bajo techo'),
(7, 'HIIT', 'Entrenamiento por intervalos de alta intensidad'),
(8, 'Natación', 'Clases en piscina para todas las edades'),
(9, 'Boxeo', 'Entrenamiento de boxeo recreativo'),
(10, 'Body Pump', 'Entrenamiento con pesas al ritmo de la música');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clase_entrenador`
--

CREATE TABLE `clase_entrenador` (
  `ID_Clase` int(11) NOT NULL,
  `ID_Entrenador` int(11) NOT NULL,
  `Estado` varchar(50) NOT NULL,
  `Valoracion` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clase_entrenador`
--

INSERT INTO `clase_entrenador` (`ID_Clase`, `ID_Entrenador`, `Estado`, `Valoracion`) VALUES
(1, 1, 'Activa', 4.5),
(2, 2, 'Activa', 4.7),
(3, 3, 'Activa', 4.6),
(4, 4, 'Activa', 4.8),
(5, 5, 'Activa', 4.9),
(6, 6, 'Activa', 4.4),
(7, 7, 'Activa', 4.3),
(8, 8, 'Activa', 4.2),
(9, 9, 'Activa', 4.1),
(10, 10, 'Activa', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrenador`
--

CREATE TABLE `entrenador` (
  `ID_Entrenador` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entrenador`
--

INSERT INTO `entrenador` (`ID_Entrenador`, `Nombre`, `Apellido`, `Email`) VALUES
(1, 'Carlos', 'López', 'carlos.lopez@gym.com'),
(2, 'Ana', 'García', 'ana.garcia@gym.com'),
(3, 'Luis', 'Martínez', 'luis.martinez@gym.com'),
(4, 'María', 'Fernández', 'maria.fernandez@gym.com'),
(5, 'Pedro', 'González', 'pedro.gonzalez@gym.com'),
(6, 'Laura', 'Hernández', 'laura.hernandez@gym.com'),
(7, 'Jorge', 'Ruiz', 'jorge.ruiz@gym.com'),
(8, 'Sofía', 'Pérez', 'sofia.perez@gym.com'),
(9, 'Diego', 'Torres', 'diego.torres@gym.com'),
(10, 'Lucía', 'Ramírez', 'lucia.ramirez@gym.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `ID_Horario` int(11) NOT NULL,
  `Hora_Inicio` datetime NOT NULL,
  `Hora_Fin` datetime NOT NULL,
  `ID_Clase` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`ID_Horario`, `Hora_Inicio`, `Hora_Fin`, `ID_Clase`) VALUES
(1, '2025-01-20 09:00:00', '2025-01-20 10:00:00', 1),
(2, '2025-01-20 10:00:00', '2025-01-20 11:00:00', 2),
(3, '2025-01-20 11:00:00', '2025-01-20 12:00:00', 3),
(4, '2025-01-20 12:00:00', '2025-01-20 13:00:00', 4),
(5, '2025-01-20 13:00:00', '2025-01-20 14:00:00', 5),
(6, '2025-01-20 14:00:00', '2025-01-20 15:00:00', 6),
(7, '2025-01-20 15:00:00', '2025-01-20 16:00:00', 7),
(8, '2025-01-20 16:00:00', '2025-01-20 17:00:00', 8),
(9, '2025-01-20 17:00:00', '2025-01-20 18:00:00', 9),
(10, '2025-01-20 18:00:00', '2025-01-20 19:00:00', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `membresia`
--

CREATE TABLE `membresia` (
  `ID_Membresia` int(11) NOT NULL,
  `ID_Miembro` int(11) NOT NULL,
  `Fecha_Inicio` date NOT NULL,
  `Fecha_Fin` date NOT NULL,
  `Monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `membresia`
--

INSERT INTO `membresia` (`ID_Membresia`, `ID_Miembro`, `Fecha_Inicio`, `Fecha_Fin`, `Monto`) VALUES
(1, 1, '2025-01-01', '2025-01-31', 50.00),
(2, 2, '2025-01-01', '2025-01-31', 60.00),
(3, 3, '2025-01-01', '2025-01-31', 55.00),
(4, 4, '2025-01-01', '2025-01-31', 70.00),
(5, 5, '2025-01-01', '2025-01-31', 50.00),
(6, 6, '2025-01-01', '2025-01-31', 65.00),
(7, 7, '2025-01-01', '2025-01-31', 60.00),
(8, 8, '2025-01-01', '2025-01-31', 75.00),
(9, 9, '2025-01-01', '2025-01-31', 50.00),
(10, 10, '2025-01-01', '2025-01-31', 80.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `miembro`
--

CREATE TABLE `miembro` (
  `ID_Miembro` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Fecha_Nacimiento` date NOT NULL,
  `Email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `miembro`
--

INSERT INTO `miembro` (`ID_Miembro`, `Nombre`, `Apellido`, `Fecha_Nacimiento`, `Email`) VALUES
(1, 'Andrés', 'Pérez', '1990-05-14', 'andres.perez@mail.com'),
(2, 'Beatriz', 'Ramírez', '1985-08-22', 'beatriz.ramirez@mail.com'),
(3, 'Carlos', 'Gómez', '1992-12-01', 'carlos.gomez@mail.com'),
(4, 'Diana', 'Martínez', '1995-04-17', 'diana.martinez@mail.com'),
(5, 'Elena', 'Sánchez', '1998-09-10', 'elena.sanchez@mail.com'),
(6, 'Fernando', 'Torres', '1987-03-23', 'fernando.torres@mail.com'),
(7, 'Gabriela', 'Hernández', '1993-07-29', 'gabriela.hernandez@mail.com'),
(8, 'Héctor', 'López', '1991-11-15', 'hector.lopez@mail.com'),
(9, 'Isabel', 'García', '1989-02-05', 'isabel.garcia@mail.com'),
(10, 'Jorge', 'Rodríguez', '1996-06-08', 'jorge.rodriguez@mail.com');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`ID_Asistencia`),
  ADD KEY `ID_Miembro` (`ID_Miembro`),
  ADD KEY `ID_Horario` (`ID_Horario`);

--
-- Indices de la tabla `clase`
--
ALTER TABLE `clase`
  ADD PRIMARY KEY (`ID_Clase`);

--
-- Indices de la tabla `clase_entrenador`
--
ALTER TABLE `clase_entrenador`
  ADD PRIMARY KEY (`ID_Clase`,`ID_Entrenador`),
  ADD KEY `ID_Entrenador` (`ID_Entrenador`);

--
-- Indices de la tabla `entrenador`
--
ALTER TABLE `entrenador`
  ADD PRIMARY KEY (`ID_Entrenador`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`ID_Horario`),
  ADD UNIQUE KEY `idx_Horario` (`Hora_Inicio`,`Hora_Fin`) USING BTREE,
  ADD KEY `FK_id_clase` (`ID_Clase`);

--
-- Indices de la tabla `membresia`
--
ALTER TABLE `membresia`
  ADD PRIMARY KEY (`ID_Membresia`),
  ADD KEY `ID_Miembro` (`ID_Miembro`);

--
-- Indices de la tabla `miembro`
--
ALTER TABLE `miembro`
  ADD PRIMARY KEY (`ID_Miembro`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `ID_Asistencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `clase`
--
ALTER TABLE `clase`
  MODIFY `ID_Clase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `entrenador`
--
ALTER TABLE `entrenador`
  MODIFY `ID_Entrenador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `horario`
--
ALTER TABLE `horario`
  MODIFY `ID_Horario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `membresia`
--
ALTER TABLE `membresia`
  MODIFY `ID_Membresia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `miembro`
--
ALTER TABLE `miembro`
  MODIFY `ID_Miembro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`ID_Miembro`) REFERENCES `miembro` (`ID_Miembro`),
  ADD CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`ID_Horario`) REFERENCES `horario` (`ID_Horario`);

--
-- Filtros para la tabla `clase_entrenador`
--
ALTER TABLE `clase_entrenador`
  ADD CONSTRAINT `clase_entrenador_ibfk_1` FOREIGN KEY (`ID_Clase`) REFERENCES `clase` (`ID_Clase`),
  ADD CONSTRAINT `clase_entrenador_ibfk_2` FOREIGN KEY (`ID_Entrenador`) REFERENCES `entrenador` (`ID_Entrenador`);

--
-- Filtros para la tabla `horario`
--
ALTER TABLE `horario`
  ADD CONSTRAINT `FK_id_clase` FOREIGN KEY (`ID_Clase`) REFERENCES `clase` (`ID_Clase`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `membresia`
--
ALTER TABLE `membresia`
  ADD CONSTRAINT `membresia_ibfk_1` FOREIGN KEY (`ID_Miembro`) REFERENCES `miembro` (`ID_Miembro`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
