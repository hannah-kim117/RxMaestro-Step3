-- Data Manipulation Queries for RxMaestro
-- ":" character used to denote variables
-- that will have data from backend

------------------------------------------------------------
------------------------------------------------------------
------------------Manufacturers Table-----------------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO Manufacturers (name, phoneNumber)
VALUES (:nameInput, :phoneNumberInput);


-- READ all attributes
SELECT manufacturerID, name, phoneNumber FROM Manufacturers;

------------------------------------------------------------
------------------------------------------------------------
------------------Drugs Table-------------------------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO Drugs (drugID, drugName, manufacturerID)
VALUES (:drugIDInput, :drugNameInput, (SELECT manufacturerID FROM Manufacturers WHERE name = :manufacturerNameInput));

-- get all attributes needed for Drugs Table
SELECT drugID, drugName, Manufacturers.name FROM Drugs
JOIN Manufacturers ON Drugs.manufacturerID = Manufacturers.manufacturerID
ORDER BY drugName;

------------------------------------------------------------
------------------------------------------------------------
------------------PatientPrescriptions Table----------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO PatientPrescriptions (patientID, drugID, dosage)
VALUES 
(
    (SELECT patientID FROM Patients WHERE name = :nameInput),
    (SELECT drugID FROM Drugs WHERE drugName = :drugNameInput),
    :dosageInput
);

-- READ all attributes
SELECT Patients.name, PatientPrescriptions.drugID, Drugs.drugName, dosage FROM PatientPrescriptions
JOIN Patients ON PatientPrescriptions.patientID = Patients.patientID
JOIN Drugs ON PatientPrescriptions.drugID = Drugs.drugID
ORDER BY Patients.name;

------------------------------------------------------------
------------------------------------------------------------
------------------DrugInteractions Table--------------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO DrugInteractions (drugID1, drugID2, source, sideEffectDescription, sideEffectSeverity)
VALUES
(
    (SELECT drugID FROM Drugs WHERE drugName = :drugNameInput),
    (SELECT drugID FROM Drugs WHERE drugName = :drugNameInput),
    (SELECT sourceName FROM DrugInteractionSources WHERE sourceName = :sourceNameInput),
    :descriptionInput,
    :severityInput
);

-- UPDATE entry
UPDATE DrugInteractions
SET drugID1 = :drugIDInput, drugID2 = :drugIDInput, source = :sourceNameInput, sideEffectDescription = :descriptionInput, sideEffectSeverity = :severityInput
WHERE interactionID = :interactionIDInput;

-- READ all attributes
SELECT interactionID, drugID1, Drugs1.drugName, drugID2, Drugs2.drugName, sideEffectDescription, sideEffectSeverity, source FROM DrugInteractions
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
VALUES (:nameInput, :phoneNumberInput);

-- UPDATE entry
UPDATE Patients
SET name = :nameInput, phoneNumber = :phoneNumberInput
WHERE patientID = :idInput;

-- DELETE entry
DELETE FROM Patients
WHERE patientID = :idInput;

-- READ all attributes
SELECT patientID, name, phoneNumber FROM Patients;

------------------------------------------------------------
------------------------------------------------------------
------------------DrugInteractionSources Table--------------
------------------------------------------------------------
------------------------------------------------------------
-- CREATE entry
INSERT INTO DrugInteractionSources (sourceName, url)
VALUES (:sourceNameInput, :urlInput);

-- READ all attributes
SELECT sourceName, url FROM DrugInteractionSources;
