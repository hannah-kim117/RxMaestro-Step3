// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Functions modified from the starter code for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Add event listener to add-button
let addDrugInteractionSourceButton = document.getElementById('add-button');

addDrugInteractionSourceButton.addEventListener("click", function (e){

    // Prevents default button action
    e.preventDefault();

    // Extract data from form
    let inputSourceName = document.getElementById("input-sourceName-ADD");
    let inputUrl = document.getElementById("input-url-ADD");
    
    // Create data object to pass to backend route
    let data = {
        sourceName: inputSourceName.value,
        url: inputUrl.value
    }

    // Define request for backend route
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-drug-interaction-source", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response, inputSourceName.value);

            // Clear the input fields for another transaction
            inputSourceName.value = '';
            inputUrl.value = '';
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
addRowToTable = (data, name) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("drug-interaction-source-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    // Find the target row
    rowIndex = 0;
    for (let i = 0; i < parsedData.length; i++) {
        currentRow = parsedData[i];
        if (currentRow.sourceName == name) {
            rowIndex = i
            break;
        }
    }

    let newRow = parsedData[rowIndex]

    // Create a row
    let row = document.createElement("TR");
    let sourceName = document.createElement("TD");
    let url = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    
    // Fill the cells with correct data
    sourceName.innerText = newRow.sourceName;
    url.innerText = newRow.url;

    // Add a delete button to the end of the row with onClick functionality
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteDrugInteractionSource(newRow.sourceName)
    }
    
    // Add the cells to the row 
    row.appendChild(sourceName);
    row.appendChild(url);
    row.appendChild(deleteCell);
    
    // Create attribute for row that can be looked up for DELETE or UPDATE operations
    row.setAttribute('data-value', newRow.sourceName);

    // Add the row to the table
    currentTable.appendChild(row);
}
