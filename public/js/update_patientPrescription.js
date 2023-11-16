
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-patientPrescription-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatientPrescriptionID = document.getElementById("input-patientPrescriptionID");
    let inputDosage = document.getElementById("input-dosage");
    let inputDrugID = document.getElementById("input-drugID-update");
    let inputPatientID = document.getElementById("input-patientID-update");

    // Get the values from the form fields
    let patientPrescriptionIDValue = inputPatientPrescriptionID.value;
    let dosageValue = inputDosage.value;
    let drugIDValue = inputDrugID.value;
    let patientIDValue = inputPatientID.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(patientPrescriptionIDValue)) 
    {
        return;
    }
    if (isNaN(dosageValue)) 
    {
        return;
    }
    if (isNaN(drugIDValue)) 
    {
        return;
    }
    if (isNaN(patientIDValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        patientPrescriptionID: patientPrescriptionIDValue,
        dosage: dosageValue,
        drugID: drugIDValue,
        patientID: patientIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-patient-prescription", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, patientPrescriptionIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});
