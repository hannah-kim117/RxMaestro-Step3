-- Rx Maestro
-- Hannah Kim
-- Alexander Freddo

-- disable foreign key checks and auto-commit
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


-- Create Manufacturers table
CREATE OR REPLACE TABLE Manufacturers (
    manufacturerID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    phoneNumber varchar(255),
    CONSTRAINT UNIQUE (name),
    PRIMARY KEY (manufacturerID)
);

-- Create Drugs Table
CREATE OR REPLACE TABLE Drugs (
    drugID int(11) NOT NULL,
    drugName varchar(255) NOT NULL,
    manufacturerID int,
    CONSTRAINT UNIQUE (drugName),
    FOREIGN KEY (manufacturerID) REFERENCES Manufacturers
    ON DELETE SET NULL,
    PRIMARY KEY (drugID)
    
);

-- Create DrugInteractionSources Table
CREATE OR REPLACE TABLE DrugInteractionSources (
    sourceName varchar(255) NOT NULL,
    url varchar(255) NOT NULL,
    CONSTRAINT UNIQUE (sourceName),
    PRIMARY KEY (sourceName)
);

-- Create Interactions Table
CREATE OR REPLACE TABLE DrugInteractions (
    interactionID int(11) NOT NULL AUTO_INCREMENT,
    drugID1 int(11) NOT NULL,
    drugID2 int(11) NOT NULL,
    source varchar(255) NULL,
    sideEffectDescription text,
    sideEffectSeverity text,
    CONSTRAINT combination UNIQUE(drugID1, drugID2),
    CONSTRAINT reverseCombination UNIQUE(drugID2, drugID1),
    FOREIGN KEY (drugID1) REFERENCES Drugs(drugID)
    ON DELETE CASCADE,
    FOREIGN KEY (drugID2) REFERENCES Drugs(drugID)
    ON DELETE CASCADE,
    FOREIGN KEY (source) REFERENCES DrugInteractionSources(sourceName)
    ON DELETE SET NULL,
    PRIMARY KEY (interactionID)
);

-- Create Patients Table
CREATE OR REPLACE TABLE Patients (
    patientID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    phoneNumber varchar(255) NOT NULL,
    CONSTRAINT UNIQUE (name),
    PRIMARY KEY (patientID)
);

-- Create PatientPrescriptions Table
CREATE OR REPLACE TABLE PatientPrescriptions (
    patientPrescriptionID int NOT NULL AUTO_INCREMENT,
    patientID int NOT NULL,
    drugID int NOT NULL,
    dosage text NOT NULL,
    CONSTRAINT prescription UNIQUE (patientID, drugID),
    FOREIGN KEY (patientID) REFERENCES Patients(patientID)
    ON DELETE CASCADE,
    FOREIGN KEY (drugID) REFERENCES Drugs(drugID)
    ON DELETE CASCADE,
    PRIMARY KEY (patientPrescriptionID)
);

-- insert data into Manufacturers table
INSERT INTO Manufacturers (
    name,
    phoneNumber
)
VALUES 
(
    "Pfizer", 
    '111-1111-1111'
),
(
    "Johnson & Johnson", 
    '222-2222-2222'
),
(
    "Zoetis", 
    '333-3333-3333'
);

-- Insert data into Patients table
INSERT INTO Patients (
    name,
    phoneNumber
)
VALUES
(
    "Bob White",
    "121-212-1212"
),
(
    "John Smith",
    "123-456-7890"
),
(
    "Anne Ko",
    "000-111-2222"
);

-- Insert data into DrugInteractionSources
INSERT INTO DrugInteractionSources (
    sourceName,
    url
)
VALUES
(
    "ONCHigh",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3422823/"
),
(
    "DrugBank",
    "https://go.drugbank.com/"

);

-- Insert data into Drugs
INSERT INTO Drugs (
    drugID,
    drugName,
    manufacturerID
)
VALUES
(
    153008,
    "Ibuprofen",
    (SELECT manufacturerID from Manufacturers where name = "Pfizer")
),
(
    1546056,
    "Furosemide",
    (SELECT manufacturerID from Manufacturers where name = "Johnson & Johnson")
),
(
    7646,
    "Omeprazole",
    (SELECT manufacturerID from Manufacturers where name = "Zoetis")
),
(
    3827,
    "Enalapril",
    (SELECT manufacturerID from Manufacturers where name = "Zoetis")
);

-- Insert data into PatientPrescriptions
INSERT INTO PatientPrescriptions (
    dosage,
    drugID,
    patientID
)
VALUES
(
    "50mg",
    (SELECT drugID from Drugs where Drugs.drugName = "Omeprazole"),
    (SELECT patientID from Patients where Patients.name = "Bob White")
),
(
    "2ml",
    (SELECT drugID from Drugs where Drugs.drugName = "Ibuprofen"),
    (SELECT patientID from Patients where Patients.name = "John Smith")
),
(
    "35mg",
    (SELECT drugID from Drugs where Drugs.drugName = "Furosemide"),
    (SELECT patientID from Patients where Patients.name = "Anne Ko")
);

-- Insert data into Interactions
INSERT INTO DrugInteractions (
    drugID1,
    drugID2,
    sideEffectDescription,
    sideEffectSeverity,
    source
)
VALUES
(
    (SELECT drugID from Drugs where Drugs.drugName = "Ibuprofen"),
    (SELECT drugID from Drugs where Drugs.drugName = "Omeprazole"),
    "The metabolism of Ibuprofen can be decreased when combined with Omeprazole.",
    "N/A",
    (SELECT sourceName from DrugInteractionSources where DrugInteractionSources.sourceName = "DrugBank")
),
(
    (SELECT drugID from Drugs where Drugs.drugName = "Ibuprofen"),
    (SELECT drugID from Drugs where Drugs.drugName = "Furosemide"),
    "The therapeutic efficacy of Furosemide can be decreased when used in combination with Ibuprofen",
    "N/A",
    (SELECT sourceName from DrugInteractionSources where DrugInteractionSources.sourceName = "DrugBank")
),
(
    (SELECT drugID from Drugs where Drugs.drugName = "Furosemide"),
    (SELECT drugID from Drugs where Drugs.drugName = "Enalapril"),
    "The risk or severity of renal failure and hypotension can be increased when Furosemide is combined with Enalapril.",
    "Moderate",
    (SELECT sourceName from DrugInteractionSources where DrugInteractionSources.sourceName = "DrugBank")
);






-- enable foreign key checks and commit
SET FOREIGN_KEY_CHECKS=1;
COMMIT;