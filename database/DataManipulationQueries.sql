-- Data Manipulation Queries for RxMaestro
-- "${}" used to denote variables
-- that will have data from backend

------------------------------------------------------------
------------------------------------------------------------
------------------Manufacturers Table-----------------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO Manufacturers (name, phoneNumber)
VALUES ('${manufacturerName}', '${phoneNumber}');


-- READ all attributes
SELECT manufacturerID, name, phoneNumber FROM Manufacturers;

------------------------------------------------------------
------------------------------------------------------------
------------------Drugs Table-------------------------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO Drugs (drugID, drugName, manufacturerID) 
VALUES ('${drugID}', '${drugName}', '${manufacturerID}');

-- get all attributes needed for Drugs Table
SELECT drugID, drugName, Drugs.manufacturerID, Manufacturers.name AS manufacturerName FROM Drugs JOIN Manufacturers ON Drugs.manufacturerID = Manufacturers.manufacturerID;

------------------------------------------------------------
------------------------------------------------------------
------------------PatientPrescriptions Table----------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO PatientPrescriptions (patientID, drugID, dosage) 
VALUES ('${patientID}', '${drugID}', '${dosage}');

-- UPDATE entry
UPDATE PatientPrescriptions 
SET patientID = '${patientID}', drugID = '${drugID}', dosage = '${dosage}' WHERE patientPrescriptionID = '${patientPrescriptionID}';

-- DELETE entry
DELETE FROM PatientPrescriptions
WHERE patientPrescriptionID = '${patientPrescriptionID}';

-- READ all attributes
SELECT patientPrescriptionID, dosage, PatientPrescriptions.drugID, PatientPrescriptions.patientID, drugName, name FROM PatientPrescriptions 
JOIN Drugs ON PatientPrescriptions.drugID = Drugs.drugID 
JOIN Patients ON PatientPrescriptions.patientID = Patients.patientID;;

------------------------------------------------------------
------------------------------------------------------------
------------------DrugInteractions Table--------------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO DrugInteractions (drugID1, drugID2, source, sideEffectDescription, sideEffectSeverity) 
VALUES ('${drugID1}', '${drugID2}', '${source}', '${sideEffectDescription}', '${sideEffectSeverity}');

-- UPDATE entry
UPDATE DrugInteractions 
SET source = '${source}', sideEffectDescription = '${sideEffectDescription}', sideEffectSeverity = '${sideEffectSeverity}' 
WHERE interactionID = '${interactionID}';

-- READ all attributes
SELECT interactionID, drugID1 AS RXCUI_1, Drugs1.drugName AS drugName1, drugID2 AS RXCUI_2, Drugs2.drugName AS drugName2, sideEffectDescription, sideEffectSeverity, source FROM DrugInteractions 
JOIN Drugs AS Drugs1 ON DrugInteractions.drugID1 = Drugs1.drugID 
JOIN Drugs AS Drugs2 ON DrugInteractions.drugID2 = Drugs2.drugID 
ORDER BY interactionID; 

------------------------------------------------------------
------------------------------------------------------------
------------------Patients Table----------------------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO Patients (name, phoneNumber)
VALUES ('${patientName}', '${phoneNumber}');

-- READ all attributes
SELECT patientID, name, phoneNumber FROM Patients;

------------------------------------------------------------
------------------------------------------------------------
------------------DrugInteractionSources Table--------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO DrugInteractionSources (sourceName, url)
VALUES ('${sourceName}', '${url}');

-- DELETE entry
DELETE FROM DrugInteractionSources
WHERE sourceName='${sourceName}';

-- READ all attributes
SELECT sourceName, url FROM DrugInteractionSources;
