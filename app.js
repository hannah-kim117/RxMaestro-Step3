// Setup
var express = require('express');
var app = express();
PORT = 9613;
var db = require('./database/db-connector');
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');


// Routes

app.get('/', function(req, res){
    res.render('index');
});

app.get('/drug-interaction-sources', function(req, res){
    res.render('DrugInteractionSources');
});

app.get('/drugs', function(req, res){
    res.render('Drugs');
});

app.get('/manufacturers', function(req, res){
    res.render('Manufacturers');
});

app.get('/patient-prescriptions', function(req, res){
    let query1 = "SELECT patientPrescriptionID, dosage, drugID, patientID FROM PatientPrescriptions;";
    db.pool.query(query1, function(error, rows, fields) {
        res.render('PatientPrescriptions', {data: rows});
    });
});

app.get('/patients', function(req, res){
    res.render('Patients');
});

/* CRUD Operations */

/* PatientPrescripitons */

app.post('/add-patient-prescription', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let dosage = data.inputDosage;
    if (!dosage)
    {
        dosage = 'NULL'
    }

    let drugName = data.inputDrugName;
    let patientName = data.inputPatientName

    // Create the query and run it on the database
    query1 = `INSERT INTO PatientPrescriptions (patientID, drugID, dosage)
    VALUES 
    (
        (SELECT patientID FROM Patients WHERE name = ${patientName}),
        (SELECT drugID FROM Drugs WHERE drugName = ${drugName}),
        ${dosage}
    )`;
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
            query2 = "SELECT patientPrescriptionID, dosage, drugID, patientID FROM PatientPrescriptions;";
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

// Listener
app.listen(PORT, function(){
    console.log("Express started on http://localhost:" + PORT + "; press Ctrl-C to terminate.");
});