// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Layout and routes are based on routes
// in the starter code. Queries and code conversions and customized for our 
// database
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Setup
var express = require('express');
var app = express();
PORT = 9897;

var db = require('./database/db-connector');

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));


// Rendering routes. These routes perform the intitial READ operation for each entity and are adapted from the starter code
app.get('/', function (req, res) {
    // Renders hbs file called index.hbs
    res.render('index');
});

app.get('/drug-interactions', function (req, res) {
    // Query for building table
    let query1 = "SELECT interactionID, drugID1 AS RXCUI_1, Drugs1.drugName AS drugName1, drugID2 AS RXCUI_2, Drugs2.drugName AS drugName2, sideEffectDescription, sideEffectSeverity, source FROM DrugInteractions JOIN Drugs AS Drugs1 ON DrugInteractions.drugID1 = Drugs1.drugID JOIN Drugs AS Drugs2 ON DrugInteractions.drugID2 = Drugs2.drugID ORDER BY interactionID";

    // Queries for populating dropdowns on page
    let query2 = "SELECT drugName, drugID FROM Drugs";
    let query3 = "SELECT sourceName FROM DrugInteractionSources";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let drugs = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let sources = rows;

                // Renders DrugInteractions.hbs and passes it the data from the 3 database queries
                return res.render('DrugInteractions', { data: data, drugs: drugs, sources: sources });
            });
        });
    });
});

app.get('/drug-interaction-sources', function (req, res) {
    // Query for building table
    let query1 = "SELECT sourceName, url FROM DrugInteractionSources";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        
        // Renders DrugInteractionSources.hbs and passes it the data from the database query
        return res.render('DrugInteractionSources', { data: data });
    });
});

app.get('/drugs', function (req, res) {
    // Query for building talbe
    let query1 = "SELECT drugID AS RXCUI, drugName, Drugs.manufacturerID, Manufacturers.name AS manufacturerName FROM Drugs JOIN Manufacturers ON Drugs.manufacturerID = Manufacturers.manufacturerID";

    // Query for populating dropdown
    let query2 = "SELECT * FROM Manufacturers";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let manufacturers = rows;

            // Renders Drugs.hbs and passes data from database query
            return res.render('Drugs', { data: data, manufacturers: manufacturers });
        });
    });
});

app.get('/manufacturers', function (req, res) {
    // Query for building table
    let query1 = "SELECT manufacturerID, name, phoneNumber FROM Manufacturers";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;

        // Renders Manufacturers.hbs and passes data from database query
        return res.render('Manufacturers', { data: data });
    });
});

app.get('/patient-prescriptions', function (req, res) {
    // Query for building table
    let query1 = "SELECT patientPrescriptionID, dosage, PatientPrescriptions.drugID, PatientPrescriptions.patientID, drugName, name FROM PatientPrescriptions JOIN Drugs ON PatientPrescriptions.drugID = Drugs.drugID JOIN Patients ON PatientPrescriptions.patientID = Patients.patientID;";

    // Queries for populating dropdowns
    let query2 = "SELECT * FROM Patients";
    let query3 = "SELECT * FROM Drugs";

    db.pool.query(query1, function (error, rows, fields) {
        let patientPrescriptions = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let patients = rows;

            db.pool.query(query3, (error, rows, fields) => {
                let drugs = rows;

                // Renders PatientPrescriptions.hbs and passes data from queries
                return res.render('PatientPrescriptions', { data: patientPrescriptions, patients: patients, drugs: drugs });
            });
        });
    });
});

app.get('/patients', function (req, res) {
    // Query for building table
    let query1 = "SELECT patientID, name, phoneNumber FROM Patients";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;

        // Renders Patients.hbs and passes data from database query
        return res.render('Patients', { data: data });
    });
});

/* CRUD Operations: The following routes handle ADD, DELETE, and UPDATE funcitonality for each of the entities */

/*                              PatientPrescripitons                        */

// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query, queries the database, and if successful, performs a SELECT operation on the database and returns the values to the AJAX function
app.post('/add-patient-prescription', function (req, res) {
    console.log("Entered Patient Prescriptions ADD");

    let data = req.body;

    // Capture NULL values
    let dosage = data.dosage;
    if (!dosage) { dosage = null }

    // convert string to int
    let drugID = parseInt(data.drugID);
    let patientID = parseInt(data.patientID);

    // Create the query and run it on the database
    query1 = `INSERT INTO PatientPrescriptions (patientID, drugID, dosage) VALUES ('${patientID}', '${drugID}', '${dosage}')`;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // Creation was successful so query database for new table
            query2 = "SELECT patientPrescriptionID, dosage, PatientPrescriptions.drugID, PatientPrescriptions.patientID, drugName, name FROM PatientPrescriptions JOIN Drugs ON PatientPrescriptions.drugID = Drugs.drugID JOIN Patients ON PatientPrescriptions.patientID = Patients.patientID;";
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    // Sends new data from database back to AJAX function
                    res.send(rows);
                }
            })
        }
    })
});

// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query and queries the database
app.delete('/delete-patient-prescription', function (req, res, next) {
    let data = req.body;
    
    // Convert id into int from string
    let patientPrescriptionID = parseInt(data.id);
    let deletePatientPrescription = `DELETE FROM PatientPrescriptions
    WHERE patientPrescriptionID = '${patientPrescriptionID}'`;

    // Query database with DELETE query either send back status signal and log error message if query is unsuccessful
    db.pool.query(deletePatientPrescription, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query, queries the database, and if successful, performs a SELECT operation on the database and returns the values to the AJAX function
app.put('/update-patient-prescription', function (req, res, next) {
    console.log("Updating prescription");
    let data = req.body;

    // Capture NULL values
    let dosage = data.dosage;
    if (!dosage) { dosage = 'NULL'; }

    // Convert strings to ints
    let drugID = parseInt(data.drugID);
    let patientID = parseInt(data.patientID);
    let patientPrescriptionID = parseInt(data.patientPrescriptionID);

    let queryUpdatePrescription = `UPDATE PatientPrescriptions SET patientID = '${patientID}', drugID = '${drugID}', dosage = '${dosage}' WHERE patientPrescriptionID = '${patientPrescriptionID}'`;
    let query2 = "SELECT patientPrescriptionID, dosage, PatientPrescriptions.drugID, PatientPrescriptions.patientID, drugName, name FROM PatientPrescriptions JOIN Drugs ON PatientPrescriptions.drugID = Drugs.drugID JOIN Patients ON PatientPrescriptions.patientID = Patients.patientID;";

    // Query database with UPDATE
    db.pool.query(queryUpdatePrescription, function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // Update was successful so query database with SELECT for new data
            db.pool.query(query2, function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // SELECT was successful -> send data back to AJAX function
                    console.log(`Sending rows: ${rows}`);
                    res.send(rows);
                }
            })
        }
    })
});

/*                              Drugs Sources                               */

// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query, queries the database, and if successful, performs a SELECT operation on the database and returns the values to the AJAX function
app.post('/add-drug', function (req, res) {
    console.log("Adding drug");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let manufacturerID = data.manufacturerID;
    if (!manufacturerID) {
        manufacturerID = 'NULL'
    } else {
        manufacturerID = parseInt(manufacturerID)
    }

    let drugID = parseInt(data.drugID);
    let drugName = data.drugName;

    query1 = `INSERT INTO Drugs (drugID, drugName, manufacturerID) VALUES ('${drugID}', '${drugName}', '${manufacturerID}')`;

    // Query DB with INSERT operation
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // INSERT was successful -> SELECT query database for new data
            query2 = "SELECT drugID, drugName, Drugs.manufacturerID, Manufacturers.name AS manufacturerName FROM Drugs JOIN Manufacturers ON Drugs.manufacturerID = Manufacturers.manufacturerID";
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    // Select was succesful -> pass data back to AJAX function
                    res.send(rows);
                }
            })
        }
    })
});

/*                              Drug Interaction Sources                      */
// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query, queries the database, and if successful, performs a SELECT operation on the database and returns the values to the AJAX function
app.post('/add-drug-interaction-source', function (req, res) {
    console.log("Adding drug interaction source");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let sourceName = data.sourceName;
    let url = data.url;

    query1 = `INSERT INTO DrugInteractionSources (sourceName, url) VALUES ('${sourceName}', '${url}')`;

    // Query database with INSERT query
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // INSERT was successful, now query database for new data
            query2 = "SELECT sourceName, url FROM DrugInteractionSources";
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    // Query successful -> pass data back to calling AJAX function
                    res.send(rows);
                }
            })
        }
    })
});

// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query and queries the database.
app.delete('/delete-drug-interaction-source', function (req, res, next) {
    let data = req.body;
    let sourceName = data.name;
    let deleteDrugInteractionSource = `DELETE FROM DrugInteractionSources
    WHERE sourceName = '${sourceName}'`;

    // Query database with DELETE operation and send success status back to caller. Logs error to console if there is an error
    db.pool.query(deleteDrugInteractionSource, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});


/*                              Drug Interactions                             */
// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query, queries the database, and if successful, performs a SELECT operation on the database and returns the values to the AJAX function
app.post('/add-drug-interaction', function (req, res) {
    console.log("Adding drug-interaction");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values and convert to inserts for database
    let source = !data.source ? null : `'${data.source}'`;

    let sideEffectDescription = !data.sideEffectDescription ? null : `'${data.sideEffectDescription}'`;

    let sideEffectSeverity = !data.sideEffectSeverity ? null : `'${data.sideEffectSeverity}'`;

    let drugID1 = `'${parseInt(data.drugID1)}'`;
    let drugID2 = `'${parseInt(data.drugID2)}'`;

    query1 = `INSERT INTO DrugInteractions (drugID1, drugID2, source, sideEffectDescription, sideEffectSeverity) VALUES (${drugID1}, ${drugID2}, ${source}, ${sideEffectDescription}, ${sideEffectSeverity})`;

    // Query database with INSERT query
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // INSERT was successful -> query database with SELECT to obtain new table values
            query2 = "SELECT interactionID, drugID1 AS RXCUI_1, Drugs1.drugName AS drugName1, drugID2 AS RXCUI_2, Drugs2.drugName AS drugName2, sideEffectDescription, sideEffectSeverity, source FROM DrugInteractions JOIN Drugs AS Drugs1 ON DrugInteractions.drugID1 = Drugs1.drugID JOIN Drugs AS Drugs2 ON DrugInteractions.drugID2 = Drugs2.drugID ORDER BY interactionID";
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    // SELECT was a success -> pass data back to AJAX function
                    res.send(rows);
                }
            })
        }
    })
});

// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query, queries the database, and if successful, performs a SELECT operation on the database and returns the values to the AJAX function
app.put('/update-drug-interaction', function (req, res, next) {
    console.log("Updating drug-interaction");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values and convert to inserts for database
    let source = !data.source ? null : `'${data.source}'`;

    let sideEffectDescription = !data.sideEffectDescription ? null : `'${data.sideEffectDescription}'`;

    let sideEffectSeverity = !data.sideEffectSeverity ? null : `'${data.sideEffectSeverity}'`;

    let interactionID = `'${parseInt(data.interactionID)}'`;

    query1 = `UPDATE DrugInteractions SET source = ${source}, sideEffectDescription = ${sideEffectDescription}, sideEffectSeverity = ${sideEffectSeverity} WHERE interactionID = ${interactionID}`;

    // Query database with UPDATE query
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // UPDATE was a success -> Query database with SELECT to obtain new data
            query2 = "SELECT interactionID, drugID1 AS RXCUI_1, Drugs1.drugName AS drugName1, drugID2 AS RXCUI_2, Drugs2.drugName AS drugName2, sideEffectDescription, sideEffectSeverity, source FROM DrugInteractions JOIN Drugs AS Drugs1 ON DrugInteractions.drugID1 = Drugs1.drugID JOIN Drugs AS Drugs2 ON DrugInteractions.drugID2 = Drugs2.drugID ORDER BY interactionID";
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    // SELECT was a success -> pass data back to AJAX function
                    res.send(rows);
                }
            })
        }
    })
});

/*                              Manufacturers                                 */

// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query, queries the database, and if successful, performs a SELECT operation on the database and returns the values to the AJAX function
app.post('/add-manufacturer', function (req, res) {
    console.log("Adding manufacturer");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let name = data.name;
    let phoneNumber = data.phoneNumber;

    query1 = `INSERT INTO Manufacturers (name, phoneNumber) VALUES ('${name}', '${phoneNumber}')`;
    // Query the database with an INSERT operation
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // INSERT was successful -> query database with SELECT to obtain new data
            query2 = "SELECT manufacturerID, name, phoneNumber FROM Manufacturers";
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    // SELECT was successful -> pass data back to AJAX function
                    res.send(rows);
                }
            })
        }
    })
});


/*                              Patients                                    */

// Adapted from the starter code, this function captures incoming form values, converts them to values that can be used in a SQL query, queries the database, and if successful, performs a SELECT operation on the database and returns the values to the AJAX function
app.post('/add-patient', function (req, res) {
    console.log("Adding patient");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let name = data.name;
    let phoneNumber = data.phoneNumber;


    query1 = `INSERT INTO Patients (name, phoneNumber) VALUES ('${name}', '${phoneNumber}')`;

    // Query database with INSERT query
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // INSERT was successful -> query database with SELECT to obtain new data
            query2 = "SELECT patientID, name, phoneNumber FROM Patients";
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    // SELECT was successful -> pass data back to AJAX function
                    res.send(rows);
                }
            })
        }
    })
});



// Listener copied from starter code
// Listener makes app listen to selected PORT for incoming HTTP requests
app.listen(PORT, function () {
    console.log("Express started on http://localhost:" + PORT + "; press Ctrl-C to terminate.");
});