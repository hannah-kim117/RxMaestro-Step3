// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Functions modified from the starter code for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Add event listener to add-button
let addDrugButton = document.getElementById('add-button');

addDrugButton.addEventListener("click", function (e){

    // Prevents default button action
    e.preventDefault();

    // Extract data from form
    let inputDrugID = document.getElementById("input-drugID-ADD");
    let inputDrugName = document.getElementById("input-drugName-ADD");
    let inputManufacturerID = document.getElementById("input-manufacturerID-ADD");

    // Stops add action if some values were not filled out
    if (isNaN(parseInt(inputDrugID.value))) { return; }
    if (!inputDrugName.value) { return; }
    
    // Create data object to pass to backend route
    let data = {
        drugID: inputDrugID.value,
        drugName: inputDrugName.value,
        manufacturerID: inputManufacturerID.value
    }

    // Define request for backend route
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
        // The backend sent back an error -> log it to the console
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send request to backend with data
    xhttp.send(JSON.stringify(data));
});

// Function that takes the data passed back by the backend route and appends the new data to the bottom of the table
addRowToTable = (data, drugID) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("drug-table");

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

    // Create a row and new cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let drugNameCell = document.createElement("TD");
    let manufacturerIDCell = document.createElement("TD");
    let nameCell = document.createElement("TD");

    // Fill the cells with new data
    idCell.innerText = newRow.drugID;
    drugNameCell.innerText = newRow.drugName;
    manufacturerIDCell.innerText = newRow.manufacturerID;
    nameCell.innerText = newRow.manufacturerName;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(drugNameCell);
    row.appendChild(manufacturerIDCell);
    row.appendChild(nameCell);
    
    // Create attribute for row that can be looked up for DELETE or UPDATE operations
    row.setAttribute('data-value', newRow.drugID);

    // Add the row to the table
    currentTable.appendChild(row);
}
