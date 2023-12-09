// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Functions modified from the starter code for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Add event listener to add-button
let addInteractionButton = document.getElementById('add-button');

addInteractionButton.addEventListener("click", function (e){

    // Prevents default button action
    e.preventDefault();

    // Extract data from form
    let inputDrugID1 = document.getElementById("input-drugID1-ADD");
    let inputDrugID2 = document.getElementById("input-drugID2-ADD");
    let inputSource = document.getElementById("input-sourceName-ADD");
    let inputSideEffectDescription = document.getElementById("input-sideEffectDescription-ADD");
    let inputSideEffectSeverity = document.getElementById("input-sideEffectSeverity-ADD");

    // Stops add action if some values were not filled out
    if (isNaN(parseInt(inputDrugID1.value))) { return; }
    if (isNaN(parseInt(inputDrugID2.value))) { return; }
    
    // Create data object to pass to backend route
    let data = {
        drugID1: inputDrugID1.value,
        drugID2: inputDrugID2.value,
        source: inputSource.value,
        sideEffectDescription: inputSideEffectDescription.value,
        sideEffectSeverity: inputSideEffectSeverity.value
    }

    // Define request for backend route
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-drug-interaction", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDrugID1.value = '';
            inputDrugID2.value = '';
            inputSource.value = '';
            inputSideEffectDescription.value = '';
            inputSideEffectSeverity.value = '';
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
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("drug-interaction-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let drugID1Cell = document.createElement("TD");
    let drugName1Cell = document.createElement("TD");
    let drugID2Cell = document.createElement("TD");
    let drugName2Cell = document.createElement("TD");
    let sideEffectDescriptionCell = document.createElement("TD");
    let sideEffectSeverityCell = document.createElement("TD");
    let sourceCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.interactionID;
    drugID1Cell.innerText = newRow.RXCUI_1;
    drugName1Cell.innerText = newRow.drugName1;
    drugID2Cell.innerText = newRow.RXCUI_2;
    drugName2Cell.innerText = newRow.drugName2;
    sideEffectDescriptionCell.innerText = newRow.sideEffectDescription;
    sideEffectSeverityCell.innerText = newRow.sideEffectSeverity;
    sourceCell.innerText = newRow.source;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(drugID1Cell);
    row.appendChild(drugName1Cell);
    row.appendChild(drugID2Cell);
    row.appendChild(drugName2Cell);
    row.appendChild(sideEffectDescriptionCell);
    row.appendChild(sideEffectSeverityCell);
    row.appendChild(sourceCell);
    
    // Create attribute for row that can be looked up for DELETE or UPDATE operations
    row.setAttribute('data-value', newRow.interactionID);

    // Add the row to the table
    currentTable.appendChild(row);
}
