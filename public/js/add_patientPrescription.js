let addPatientPrescriptionForm = document.getElementByID('add-patientPrescription-form-ajax');

addPatientPrescriptionForm.addEventListener("submit", function (e){

    e.preventDefault();

    let inputDosage = document.getElementById("input-dosage");
    let inputDrugName = document.getElementById("input-drugName");
    let inputPatientName = document.getElementById("input-patientName");

    let dosageValue = inputDosage.value;
    let drugNameValue = inputDrugName.value;
    let patientNameValue = inputPatientName.value;

    let data = {
        dosage: dosageValue,
        drugName: drugNameValue,
        patientName: patientNameValue
    }

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
            inputDrugName.value = '';
            inputPatientName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));

});

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("prescription-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dosageCell = document.createElement("TD");
    let drugIDCell = document.createElement("TD");
    let patientIDCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.patientPrescriptionID;
    dosageCell.innerText = newRow.dosage;
    drugIDCell.innerText = newRow.drugID;
    patientIDCell.innerText = newRow.patientID;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(dosageCell);
    row.appendChild(drugIDCell);
    row.appendChild(patientIDCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
