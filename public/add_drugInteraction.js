let addInteractionButton = document.getElementById('add-button');

addInteractionButton.addEventListener("click", function (e){

    e.preventDefault();

    let inputDrugID1 = document.getElementById("input-drugID1-ADD");
    let inputDrugID2 = document.getElementById("input-drugID2-ADD");
    let inputSource = document.getElementById("input-sourceName-ADD");
    let inputSideEffectDescription = document.getElementById("input-sideEffectDescription-ADD");
    let inputSideEffectSeverity = document.getElementById("input-sideEffectSeverity-ADD");

    if (isNaN(parseInt(inputDrugID1.value))) { return; }
    if (isNaN(parseInt(inputDrugID2.value))) { return; }
    
    let data = {
        drugID1: inputDrugID1.value,
        drugID2: inputDrugID2.value,
        source: inputSource.value,
        sideEffectDescription: inputSideEffectDescription.value,
        sideEffectSeverity: inputSideEffectSeverity.value
    }

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
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));

});

addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("drug-interaction-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
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
    drugID1Cell.innerText = newRow.drugID1;
    drugName1Cell.innerText = newRow.drugName1;
    drugID2Cell.innerText = newRow.drugID2;
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
    
    row.setAttribute('data-value', newRow.interactionID);

    // Add the row to the table
    currentTable.appendChild(row);
}
