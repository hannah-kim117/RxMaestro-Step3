// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Functions modified from the starter code for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Add event listener to add-button
let addPatientButton = document.getElementById('add-button');

addPatientButton.addEventListener("click", function (e){

    // Prevents default button action
    e.preventDefault();

    // Extract data from form
    let inputDosage = document.getElementById("input-dosage-ADD");
    let inputDrugID = document.getElementById("input-drugID-ADD");
    let inputPatientID = document.getElementById("input-patientID-ADD");
    
    // Stops add action if some values were not filled out
    if (isNaN(parseInt(inputDrugID.value))) { return; }
    if (isNaN(parseInt(inputPatientID.value))) { return; }
    if (!inputDosage.value) { return; }

    // Create data object to pass to backend route
    let data = {
        dosage: inputDosage.value,
        drugID: inputDrugID.value,
        patientID: inputPatientID.value
    }

    // Define request for backend route
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-patient-prescription", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDosage.value = '';
            inputDrugID.value = '';
            inputPatientID.value = '';
        }
        // The backend sent back and error -> log it to the console
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send request to backend with data
    xhttp.send(JSON.stringify(data));
});

// Function that takes the data passed back by the backend route and appends the new data to the bottom of the table
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("prescription-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dosageCell = document.createElement("TD");
    let drugIDCell = document.createElement("TD");
    let patientIDCell = document.createElement("TD");
    let drugNameCell = document.createElement("TD");
    let patientNameCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.patientPrescriptionID;
    dosageCell.innerText = newRow.dosage;
    drugIDCell.innerText = newRow.drugID;
    patientIDCell.innerText = newRow.patientID;
    drugNameCell.innerText = newRow.drugName;
    patientNameCell.innerText = newRow.name

    // Appends delete button to end of the row with DELETE functionality
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePatientPrescription(newRow.patientPrescriptionID)
    }

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(dosageCell);
    row.appendChild(drugIDCell);
    row.appendChild(patientIDCell);
    row.appendChild(drugNameCell);
    row.appendChild(patientNameCell);
    row.appendChild(deleteCell);
    
    // Create attribute for row that can be looked up for DELETE or UPDATE operations
    row.setAttribute('data-value', newRow.patientPrescriptionID);

    // Add the row to the table
    currentTable.appendChild(row);
}
