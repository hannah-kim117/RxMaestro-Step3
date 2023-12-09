// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Functions modified from the starter code for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Add event listener to update form
let updatePersonForm = document.getElementById('update-patientPrescription-form-ajax');

updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent default submit action
    e.preventDefault();

    // Get data from the form
    let inputPatientPrescriptionID = document.getElementById("input-patientPrescriptionID-UPDATE");
    let inputDosage = document.getElementById("input-dosage-UPDATE");
    let inputDrugID = document.getElementById("input-drugID-UPDATE");
    let inputPatientID = document.getElementById("input-patientID-UPDATE");

    // Extract values from each of the row elements
    let patientPrescriptionIDValue = inputPatientPrescriptionID.value;
    let dosageValue = inputDosage.value;
    let drugIDValue = inputDrugID.value;
    let patientIDValue = inputPatientID.value;

    // Check if critical values are empty and end update if so
    if (isNaN(patientPrescriptionIDValue)) 
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

    // Create data object to pass to backend
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

            // Reset values in the form
            inputPatientPrescriptionID.value = "";
            inputDosage.value = "";
            inputDrugID.value = "";
            inputPatientID.value = "";

        }
        // Backend sent back an error -> print error to console
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});

// Function that take the data that was passed back from the backend along with the PK for the target row and replaces the old values for that row with the new values
function updateRow(data, patientPrescriptionID){

    // Parse data from backend and store in parsedData
    let parsedData = JSON.parse(data);
    
    // Find table and loop through rows until the target row is found
    let table = document.getElementById("prescription-table");
    for (let i = 1, row; row = table.rows[i]; i++) {

        // If the PK value matches the target PK value -> update row with parsed values
        if (table.rows[i].getElementsByTagName("td")[0].innerHTML == patientPrescriptionID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Adjust columns
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            td1.innerHTML = parsedData[i-1].dosage; 

            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            td2.innerHTML = parsedData[i-1].drugID; 

            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            td3.innerHTML = parsedData[i-1].patientID; 

            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            td4.innerHTML = parsedData[i-1].drugName; 

            let td5 = updateRowIndex.getElementsByTagName("td")[5];
            td5.innerHTML = parsedData[i-1].name; 
       }
    }
}
