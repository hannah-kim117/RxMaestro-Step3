let addPatientButton = document.getElementById('add-button');

addPatientButton.addEventListener("click", function (e){

    e.preventDefault();

   
    let inputPatientName = document.getElementById("input-patientName-ADD");
    let inputPhoneNumber = document.getElementById("input-phoneNumber-ADD");
    
    let data = {
        
        name: inputPatientName.value,
        phoneNumber: inputPhoneNumber.value
    }

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
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));

});

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("patient-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
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
    
    row.setAttribute('data-value', newRow.patientID);

    // Add the row to the table
    currentTable.appendChild(row);
}
