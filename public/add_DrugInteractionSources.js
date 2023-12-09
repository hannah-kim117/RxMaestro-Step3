let addDrugInteractionSourceButton = document.getElementById('add-button');

addDrugInteractionSourceButton.addEventListener("click", function (e){

    e.preventDefault();

    let inputSourceName = document.getElementById("input-sourceName-ADD");
    let inputUrl = document.getElementById("input-url-ADD");
    
    let data = {
        sourceName: inputSourceName.value,
        url: inputUrl.value
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-drug-interaction-source", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSourceName.value = '';
            inputUrl.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));

});

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("drug-interaction-source-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let sourceName = document.createElement("TD");
    let url = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    
    // Fill the cells with correct data
    sourceName.innerText = newRow.sourceName;
    url.innerText = newRow.url;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteDrugInteractionSource(newRow.sourceName)
    }
    
    // Add the cells to the row 
    row.appendChild(sourceName);
    row.appendChild(url);
    row.appendChild(deleteCell);
    
    
    row.setAttribute('data-value', newRow.sourceName);

    // Add the row to the table
    currentTable.appendChild(row);
}
