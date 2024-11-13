// controllers/facultadController.js
const Facultad = require('../models/facultad');

// Crear nueva Facultad
const createFacultad = async (req, res) => {
    try {
        const { NombreFacultad, Descripcion, FechaCreacion } = req.body;
        const nuevaFacultad = await Facultad.create({
            NombreFacultad,
            Descripcion,
            FechaCreacion,
        });
        res.status(201).json(nuevaFacultad);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la facultad', error });
    }
};

// Obtener todas las Facultades
const getFacultades = async (req, res) => {
    try {
        const facultades = await Facultad.findAll();
        res.status(200).json(facultades);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las facultades', error });
    }
};

// Obtener una Facultad por ID
const getFacultadById = async (req, res) => {
    try {
        const facultad = await Facultad.findByPk(req.params.id);
        if (!facultad) {
            return res.status(404).json({ message: 'Facultad no encontrada' });
        }
        res.status(200).json(facultad);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la facultad', error });
    }
};

// Actualizar Facultad
const updateFacultad = async (req, res) => {
    try {
        const { NombreFacultad, Descripcion, FechaCreacion } = req.body;
        const facultad = await Facultad.update(
            { NombreFacultad, Descripcion, FechaCreacion },
            { where: { FacultadID: req.params.id }, returning: true }
        );
        if (!facultad[0]) {
            return res.status(404).json({ message: 'Facultad no encontrada' });
        }
        res.status(200).json(facultad[1][0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la facultad', error });
    }
};

// Eliminar Facultad
const deleteFacultad = async (req, res) => {
    try {
        const facultad = await Facultad.destroy({ where: { FacultadID: req.params.id } });
        if (!facultad) {
            return res.status(404).json({ message: 'Facultad no encontrada' });
        }
        res.status(200).json({ message: 'Facultad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la facultad', error });
    }
};

module.exports = {
    createFacultad,
    getFacultades,
    getFacultadById,
    updateFacultad,
    deleteFacultad,
};
