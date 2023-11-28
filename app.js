// Setup
var express = require('express');
var app = express();
PORT = 9843;

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
    let query1 = "SELECT drugID1, drugID2, sideEffectDescription, sideEffectSeverity, source FROM DrugInteractions";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        return res.render('DrugInteractions', {data: data});
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
    let query1 = "SELECT drugID, drugName, manufacturerID FROM Drugs";

    db.pool.query(query1, (error, rows, fields) => {
        let data = rows;
        return res.render('Drugs', {data: data});
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
});

app.delete('/delete-drug', function(req,res,next) {
    console.log("Deleting drug");
});

app.put('/update-drug', function(req,res,next) {
    console.log("Updating drug");
});

/*                              Drug Interaction Sources                      */

app.post('/add-drug-interaction-source', function(req, res) { 
    console.log("Adding drug interaction source");
});

app.delete('/delete-drug-interaction-source', function(req,res,next) {
    console.log("Deleting drug interaction source");
});

app.put('/update-drug-interaction-source', function(req,res,next) {
    console.log("Updating drug interaction source");
});

/*                              Drug Interactions                             */

app.post('/add-drug-interaction', function(req, res) { 
    console.log("Adding drug-interaction");
});

app.delete('/delete-drug-interaction', function(req,res,next) {
    console.log("Deleting drug-interaction");
});

app.put('/update-drug-interaction', function(req,res,next) {
    console.log("Updating drug-interaction");
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