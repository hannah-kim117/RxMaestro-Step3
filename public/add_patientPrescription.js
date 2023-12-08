let addPatientButton = document.getElementById('add-button');

addPatientButton.addEventListener("click", function (e){

    e.preventDefault();

    let inputDosage = document.getElementById("input-dosage-ADD");
    let inputDrugID = document.getElementById("input-drugID-ADD");
    let inputPatientID = document.getElementById("input-patientID-ADD");
    
    if (isNaN(parseInt(inputDrugID.value))) { return; }
    if (isNaN(parseInt(inputPatientID.value))) { return; }
    if (!inputDosage.value) { return; }

    let data = {
        dosage: inputDosage.value,
        drugID: inputDrugID.value,
        patientID: inputPatientID.value
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
            inputDrugID.value = '';
            inputPatientID.value = '';
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
    
    row.setAttribute('data-value', newRow.patientPrescriptionID);

    // Add the row to the table
    currentTable.appendChild(row);
}
