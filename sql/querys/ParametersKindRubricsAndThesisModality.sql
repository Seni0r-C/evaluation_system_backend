     SELECT

                te.id, 
                        CASE 
                    WHEN te_padre.nombre IS NOT NULL AND ans.trabajo_modalidad_id=r.modalidad_id
                    THEN CONCAT(te.nombre, ' (', te_padre.nombre, ')') 
                    ELSE te.nombre 
                END AS nombre,
                    smt.nombre AS modaliad                    
            FROM sistema_tipo_evaluacion te
            JOIN rubrica r ON te.id = r.tipo_evaluacion_id
            LEFT JOIN acta_notas_scheme ans ON te.id = ans.comp_id 
            LEFT JOIN sistema_tipo_evaluacion te_padre ON ans.comp_parent_id = te_padre.id 
            LEFT JOIN sistema_modalidad_titulacion smt ON smt.id = r.modalidad_id
            WHERE r.modalidad_id = 1
            AND te.id  NOT IN (SELECT DISTINCT comp_parent_id FROM acta_notas_scheme WHERE comp_parent_id IS NOT NULL)
            GROUP BY te.id