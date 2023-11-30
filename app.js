// Setup
var express = require('express');
var app = express();
PORT = 9617;

var db = require('./database/db-connector');

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public')); 


// Routes

app.get('/', function(req, res){
    res.render('index');
});

app.get('/drug-interactions', function(req, res){
    let query1 = "SELECT interactionID, drugID1, Drugs1.drugName AS drugName1, drugID2, Drugs2.drugName AS drugName2, sideEffectDescription, sideEffectSeverity, source FROM DrugInteractions JOIN Drugs AS Drugs1 ON DrugInteractions.drugID1 = Drugs1.drugID JOIN Drugs AS Drugs2 ON DrugInteractions.drugID2 = Drugs2.drugID ORDER BY interactionID";
    let query2 = "SELECT drugName, drugID FROM Drugs";
    let query3 = "SELECT sourceName FROM DrugInteractionSources";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let drugs = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let sources = rows;
                return res.render('DrugInteractions', {data: data, drugs: drugs, sources: sources});
            }); 
        });
    });
});

app.get('/drug-interaction-sources', function(req, res){
    let query1 = "SELECT sourceName, url FROM DrugInteractionSources";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        return res.render('DrugInteractionSources', {data: data});
    });
});

app.get('/drugs', function(req, res){
    let query1 = "SELECT drugID, drugName, Drugs.manufacturerID, Manufacturers.name AS manufacturerName FROM Drugs JOIN Manufacturers ON Drugs.manufacturerID = Manufacturers.manufacturerID";
    let query2 = "SELECT * FROM Manufacturers";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let manufacturers = rows;
            return res.render('Drugs', {data: data, manufacturers: manufacturers});
        });     
    });
});

app.get('/manufacturers', function(req, res){
    let query1 = "SELECT manufacturerID, name, phoneNumber FROM Manufacturers";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        return res.render('Manufacturers', {data: data});
    });
});

app.get('/patient-prescriptions', function(req, res){

    let query1 = "SELECT patientPrescriptionID, dosage, PatientPrescriptions.drugID, PatientPrescriptions.patientID, drugName, name FROM PatientPrescriptions JOIN Drugs ON PatientPrescriptions.drugID = Drugs.drugID JOIN Patients ON PatientPrescriptions.patientID = Patients.patientID;";
    let query2 = "SELECT * FROM Patients";
    let query3 = "SELECT * FROM Drugs";

    db.pool.query(query1, function(error, rows, fields) {
        let patientPrescriptions = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let patients = rows;

            db.pool.query(query3, (error, rows, fields) => {
                let drugs = rows;
                return res.render('PatientPrescriptions', {data: patientPrescriptions, patients: patients, drugs: drugs});
            });
        });
    });
});

app.get('/patients', function(req, res){
    let query1 = "SELECT patientID, name, phoneNumber FROM Patients";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        return res.render('Patients', {data: data});
    });
});

/* CRUD Operations */

/* PatientPrescripitons */

app.post('/add-patient-prescription', function(req, res) 
{
    console.log("Entered Patient Prescriptions ADD");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(`Add req: ${req.body}`);
    console.log(`Add res: ${res.body}`);

    // Capture NULL values
    let dosage = data.dosage;
    if (!dosage)
    {
        dosage = 'NULL'
    }

    let drugID = parseInt(data.drugID);
    let patientID = parseInt(data.patientID);
    console.log(`patientID, drugID, dosage: '${drugID}', '${patientID}', '${dosage}'`);
    // Create the query and run it on the database
    query1 = `INSERT INTO PatientPrescriptions (patientID, drugID, dosage) VALUES ('${patientID}', '${drugID}', '${dosage}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = "SELECT patientPrescriptionID, dosage, PatientPrescriptions.drugID, PatientPrescriptions.patientID, drugName, name FROM PatientPrescriptions JOIN Drugs ON PatientPrescriptions.drugID = Drugs.drugID JOIN Patients ON PatientPrescriptions.patientID = Patients.patientID;";
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-patient-prescription', function(req,res,next){
    let data = req.body;
    let patientPrescriptionID = parseInt(data.id);
    let deletePatientPrescription = `DELETE FROM PatientPrescriptions
    WHERE patientPrescriptionID = '${patientPrescriptionID}'`;
    
    db.pool.query(deletePatientPrescription, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

app.put('/update-patient-prescription', function(req,res,next){
    console.log("Updating prescription");
    console.log(`Update req: ${req.body}`);
    console.log(`Update res: ${res.body}`);
    let data = req.body;
  
    // Capture NULL values
    let dosage = data.dosage;
    if (!dosage)
    {
        dosage = 'NULL'
    }

    let drugID = parseInt(data.drugID);
    let patientID = parseInt(data.patientID);
    let patientPrescriptionID = parseInt(data.patientPrescriptionID);
  
    let queryUpdatePrescription = `UPDATE PatientPrescriptions SET patientID = '${patientID}', drugID = '${drugID}', dosage = '${dosage}' WHERE patientPrescriptionID = '${patientPrescriptionID}'`;
    let query2 = "SELECT patientPrescriptionID, dosage, PatientPrescriptions.drugID, PatientPrescriptions.patientID, drugName, name FROM PatientPrescriptions JOIN Drugs ON PatientPrescriptions.drugID = Drugs.drugID JOIN Patients ON PatientPrescriptions.patientID = Patients.patientID;";
  
    // Run the 1st query
    db.pool.query(queryUpdatePrescription, function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(query2, function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                console.log(`Sending rows: ${rows}`);
                    res.send(rows);
                }
            })
        }
})});

/*                              Drugs Sources                               */

app.post('/add-drug', function(req, res) { 
    console.log("Adding drug");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(`Add req: ${req.body}`);
    console.log(`Add res: ${res.body}`);

    // Capture NULL values
    let manufacturerID = data.manufacturerID;
    if (!manufacturerID) {
        manufacturerID = 'NULL'
    } else {
        manufacturerID = parseInt(manufacturerID)
    }

    let drugID = parseInt(data.drugID);
    let drugName = data.drugName;
    console.log(`drugID, manufacturerID, drugName: '${drugID}', '${manufacturerID}', '${drugName}'`);
    // Create the query and run it on the database
    query1 = `INSERT INTO Drugs (drugID, drugName, manufacturerID) VALUES ('${drugID}', '${drugName}', '${manufacturerID}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = "SELECT drugID, drugName, Drugs.manufacturerID, Manufacturers.name AS manufacturerName FROM Drugs JOIN Manufacturers ON Drugs.manufacturerID = Manufacturers.manufacturerID";
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*                              Drug Interaction Sources                      */

app.post('/add-drug-interaction-source', function(req, res) { 
    console.log("Adding drug interaction source");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(`Add req: ${req.body}`);
    console.log(`Add res: ${res.body}`);

    

    let sourceName = data.sourceName;
    let url = data.url;
    console.log(`sourceName, url: '${sourceName}', '${url}'`);
    // Create the query and run it on the database
    query1 = `INSERT INTO DrugInteractionSources (sourceName, url) VALUES ('${sourceName}', '${url}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = "SELECT * FROM DrugInteractionSources";
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});



/*                              Drug Interactions                             */

app.post('/add-drug-interaction', function(req, res) { 
    console.log("Adding drug-interaction");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(`Add req: ${req.body}`);
    console.log(`Add res: ${res.body}`);

    // Capture NULL values
    let source = data.source;
    if (!source) {
        source = 'NULL'
    }
    let sideEffectDescription = data.sideEffectDescription;
    if (!sideEffectDescription) {
        sideEffectDescription = 'NULL'
    }
    let sideEffectSeverity = data.sideEffectSeverity;
    if (!sideEffectSeverity) {
        sideEffectSeverity = 'NULL'
    }

    let drugID1 = parseInt(data.drugID1);
    let drugID2 = parseInt(data.drugID2);
    console.log(`drugID1, drugID2, source, description, severity: '${drugID1}', '${drugID2}', '${source}, ${sideEffectDescription}, ${sideEffectSeverity}'`);
    // Create the query and run it on the database
    query1 = `INSERT INTO DrugInteractions (drugID1, drugID2, source, sideEffectDescription, sideEffectSeverity) VALUES ('${drugID1}', '${drugID2}', '${source}', '${sideEffectDescription}', '${sideEffectSeverity}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = "SELECT interactionID, drugID1, Drugs1.drugName AS drugName1, drugID2, Drugs2.drugName AS drugName2, sideEffectDescription, sideEffectSeverity, source FROM DrugInteractions JOIN Drugs AS Drugs1 ON DrugInteractions.drugID1 = Drugs1.drugID JOIN Drugs AS Drugs2 ON DrugInteractions.drugID2 = Drugs2.drugID ORDER BY interactionID";
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/update-drug-interaction', function(req,res,next) {
    console.log("Updating drug-interaction");
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(`Add req: ${req.body}`);
    console.log(`Add res: ${res.body}`);

    // Capture NULL values
    let source = data.source;
    if (!source) {
        source = 'NULL'
    }
    let sideEffectDescription = data.sideEffectDescription;
    if (!sideEffectDescription) {
        sideEffectDescription = 'NULL'
    }
    let sideEffectSeverity = data.sideEffectSeverity;
    if (!sideEffectSeverity) {
        sideEffectSeverity = 'NULL'
    }

    let interactionID = parseInt(data.interactionID);
    console.log(`interactionID, source, description, severity: '${interactionID}', '${source}, ${sideEffectDescription}, ${sideEffectSeverity}'`);
    // Create the query and run it on the database
    query1 = `UPDATE DrugInteractions SET source = '${source}', sideEffectDescription = '${sideEffectDescription}', sideEffectSeverity = '${sideEffectSeverity}' WHERE interactionID = '${interactionID}'`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = "SELECT interactionID, drugID1, Drugs1.drugName AS drugName1, drugID2, Drugs2.drugName AS drugName2, sideEffectDescription, sideEffectSeverity, source FROM DrugInteractions JOIN Drugs AS Drugs1 ON DrugInteractions.drugID1 = Drugs1.drugID JOIN Drugs AS Drugs2 ON DrugInteractions.drugID2 = Drugs2.drugID ORDER BY interactionID";
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*                              Manufacturers                                 */

app.post('/add-manufacturer', function(req, res) { 
    console.log("Adding manufacturer");
});

app.delete('/delete-manufacturer', function(req,res,next) {
    console.log("Deleting manufacturer");
});

app.put('/update-manufacturer', function(req,res,next) {
    console.log("Updating manufacturer");
});

/*                              Patients                                    */

app.post('/add-patient', function(req, res) { 
    console.log("Adding patient");
});

app.delete('/delete-patient', function(req,res,next) {
    console.log("Deleting patient");
});

app.put('/update-patient', function(req,res,next) {
    console.log("Updating patient");
});
    
// Listener
app.listen(PORT, function(){
    console.log("Express started on http://localhost:" + PORT + "; press Ctrl-C to terminate.");
});