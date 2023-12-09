// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Functions modified from the starter code for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Add event listener to add-button
let addManufacturerButton = document.getElementById('add-button');

addManufacturerButton.addEventListener("click", function (e){

    // Prevents default button action
    e.preventDefault();

    // Extract data from form
    let inputManufacturerName = document.getElementById("input-manufacturerName-ADD");
    let inputPhoneNumber = document.getElementById("input-phoneNumber-ADD");
    
    // Create data object to pass to backend route
    let data = {
        name: inputManufacturerName.value,
        phoneNumber: inputPhoneNumber.value
    }

    // Define request for backend route
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-manufacturer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputManufacturerName.value = '';
            inputPhoneNumber.value = '';
        }
        // The backend sent back an error -> log it to the console
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send request to backend with data
    xhttp.send(JSON.stringify(data));
});

// Function that takes the data passed back by the backend route along with the new PK and appends the new data to the bottom of the table
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("manufacturer-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let manufacturerNameCell = document.createElement("TD");
    let phoneNumberCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.manufacturerID;
    manufacturerNameCell.innerText = newRow.name;
    phoneNumberCell.innerText = newRow.phoneNumber;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(manufacturerNameCell);
    row.appendChild(phoneNumberCell);
    
    row.setAttribute('data-value', newRow.manufacturerID);

    // Add the row to the table
    currentTable.appendChild(row);
}
