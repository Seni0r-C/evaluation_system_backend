SELECT * FROM rubrica_evaluacion;



-- 'CON TRIBUNAL'
-- 'DEFENDIDO'
SELECT te.id FROM trabajo_estado te WHERE te.nombre = 'CON TRIBUNAL';
-- Change state of thesis work to regradement of tribunal members
UPDATE trabajo_titulacion 
SET estado_id = (SELECT te.id 
						FROM trabajo_estado te 
						WHERE te.nombre = 'CON TRIBUNAL') 
						WHERE id = 10 AND estado_id = (
												SELECT te.id 
												FROM trabajo_estado te 
												WHERE te.nombre = 'DEFENDIDO'
												);
-- removes records of grades on thesis work
DELETE FROM rubrica_evaluacion WHERE trabajo_id = 10;

