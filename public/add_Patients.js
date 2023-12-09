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
    let inputPatientName = document.getElementById("input-patientName-ADD");
    let inputPhoneNumber = document.getElementById("input-phoneNumber-ADD");
    
    // Create data object to pass to backend route
    let data = {
        name: inputPatientName.value,
        phoneNumber: inputPhoneNumber.value
    }

    // Define request for backend route
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-patient", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPatientName.value = '';
            inputPhoneNumber.value = '';
        }
        // The backend sent back an error -> log it to the console
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send request to the backend with data
    xhttp.send(JSON.stringify(data));

});

// Function that takes the data passed back by the backend route and appends the new data to the bottom of the table
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("patient-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let patientNameCell = document.createElement("TD");
    let phoneNumberCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.patientID;
    patientNameCell.innerText = newRow.name;
    phoneNumberCell.innerText = newRow.phoneNumber;
    
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(patientNameCell);
    row.appendChild(phoneNumberCell);
    
    // Create attribute for row that can be looked up for DELETE or UPDATE operations
    row.setAttribute('data-value', newRow.patientID);

    // Add the row to the table
    currentTable.appendChild(row);
}
