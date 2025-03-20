SELECT     
    docente.id AS id_docente,
    docente.nombre AS docente,
    estudiante.id AS est_id,
    estudiante.id AS cedula,
    estudiante.nombre AS estudiante,
    te.nombre AS tipo_evaluacion, 
    r.tipo_evaluacion_id AS eval_type,
    rc.nombre AS nombre,
    re.puntaje_obtenido AS nota,
    rc.puntaje_maximo AS base,
    te_hijo.nombre AS componente
FROM 
    rubrica_evaluacion re
INNER JOIN 
    rubrica_criterio rc ON re.rubrica_criterio_id = rc.id
INNER JOIN 
    usuario docente ON re.docente_id = docente.id
INNER JOIN 
    usuario estudiante ON re.estudiante_id = estudiante.id
INNER JOIN  
    rubrica r ON rc.rubrica_id = r.id
INNER JOIN 
    sistema_tipo_evaluacion te ON r.tipo_evaluacion_id = te.id
INNER JOIN 
    sistema_modalidad_titulacion m ON r.modalidad_id = m.id
INNER JOIN 
    trabajo_titulacion tt ON re.trabajo_id = tt.id
LEFT JOIN 
    acta_notas_scheme ans ON te.id = ans.comp_parent_id
LEFT JOIN 
    sistema_tipo_evaluacion te_hijo ON ans.comp_id = te_hijo.id
WHERE 
    tt.id = 10 
ORDER BY 
    estudiante, tipo_evaluacion;
