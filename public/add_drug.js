let addDrugButton = document.getElementById('add-button');

addDrugButton.addEventListener("click", function (e){

    e.preventDefault();

    let inputDrugID = document.getElementById("input-drugID-ADD");
    let inputDrugName = document.getElementById("input-drugName-ADD");
    let inputManufacturerID = document.getElementById("input-manufacturerID-ADD");

    if (isNaN(parseInt(inputDrugID.value))) { return; }
    if (!inputDrugName.value) { return; }
    
    let data = {
        drugID: inputDrugID.value,
        drugName: inputDrugName.value,
        manufacturerID: inputManufacturerID.value
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-drug", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response, parseInt(inputDrugID.value));

            // Clear the input fields for another transaction
            inputDrugID.value = '';
            inputDrugName.value = '';
            inputManufacturerID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));

});

addRowToTable = (data, drugID) => {
    console.log(data)

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("drug-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);

    // Find the target row
    rowIndex = 0;
    for (let i = 0; i < parsedData.length; i++) {
        currentRow = parsedData[i];
        if (currentRow.drugID == drugID) {
            rowIndex = i
            break;
        }
    }

    let newRow = parsedData[rowIndex]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let drugNameCell = document.createElement("TD");
    let manufacturerIDCell = document.createElement("TD");
    let nameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.drugID;
    drugNameCell.innerText = newRow.drugName;
    manufacturerIDCell.innerText = newRow.manufacturerID;
    nameCell.innerText = newRow.name;


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(drugNameCell);
    row.appendChild(manufacturerIDCell);
    row.appendChild(nameCell);
    
    row.setAttribute('data-value', newRow.drugID);

    // Add the row to the table
    currentTable.appendChild(row);
}
