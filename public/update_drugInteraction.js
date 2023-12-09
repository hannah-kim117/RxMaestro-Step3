// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Functions modified from the starter code for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Add event listener to UPDATE-button
let updateInteractionButton = document.getElementById('UPDATE-button');

updateInteractionButton.addEventListener("click", function (e){
   
    // Prevents default button action
    e.preventDefault();

    // Extract data from form
    let inputInteractionID = document.getElementById("input-interactionID-UPDATE");
    let inputSource = document.getElementById("input-sourceName-UPDATE");
    let inputSideEffectDescription = document.getElementById("input-sideEffectDescription-UPDATE");
    let inputSideEffectSeverity = document.getElementById("input-sideEffectSeverity-UPDATE");

    // Ends update operation if essential values are empty
    if (isNaN(inputInteractionID.value)) 
    {
        return;
    }

    // Create data objecct to pass to backend route
    let data = {
        interactionID: inputInteractionID.value,
        source: inputSource.value,
        sideEffectDescription: inputSideEffectDescription.value,
        sideEffectSeverity: inputSideEffectSeverity.value
    }
    
    // Define request for backend route
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-drug-interaction", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, inputInteractionID.value);

            // Clear the input fields for another transaction
            inputInteractionID.value = "";
            inputSource.value = "";
            inputSideEffectDescription.value = "";
            inputSideEffectSeverity.value = "";

        }
        // The backend sent back an error -> log it to the console
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send request to backend with the data
    xhttp.send(JSON.stringify(data));
});

// Function that take the data that was passed back from the backend along with the PK for the target row and replaces the old values for that row with the new values
function updateRow(data, interactionID){

    // Parse data from backend and store in parsedData
    let parsedData = JSON.parse(data);
    
    // Find table and loop through rows until the target row is found
    let table = document.getElementById("drug-interaction-table");
    for (let i = 1, row; row = table.rows[i]; i++) {
        
        // If the PK value matches the target PK value -> update row with parsed values
        if (table.rows[i].getElementsByTagName("td")[0].innerHTML == interactionID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Adjust columns
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            td1.innerHTML = parsedData[i-1].RXCUI_1; 

            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            td2.innerHTML = parsedData[i-1].drugName1; 

            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            td3.innerHTML = parsedData[i-1].RXCUI_2; 

            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            td4.innerHTML = parsedData[i-1].drugName2; 

            let td5 = updateRowIndex.getElementsByTagName("td")[5];
            td5.innerHTML = parsedData[i-1].sideEffectDescription; 

            let td6 = updateRowIndex.getElementsByTagName("td")[6];
            td6.innerHTML = parsedData[i-1].sideEffectSeverity; 

            let td7 = updateRowIndex.getElementsByTagName("td")[7];
            td7.innerHTML = parsedData[i-1].source; 
       }
    }
}
