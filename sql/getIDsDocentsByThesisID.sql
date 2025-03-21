SELECT     
		    docente.id
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
		    trabajo_titulacion tt ON re.trabajo_id = tt.id
		WHERE tt.id = 10 
		GROUP BY docente.id