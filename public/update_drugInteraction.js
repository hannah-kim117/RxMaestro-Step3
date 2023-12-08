
let updateInteractionButton = document.getElementById('UPDATE-button');

updateInteractionButton.addEventListener("click", function (e){
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputInteractionID = document.getElementById("input-interactionID-UPDATE");
    let inputSource = document.getElementById("input-sourceName-UPDATE");
    let inputSideEffectDescription = document.getElementById("input-sideEffectDescription-UPDATE");
    let inputSideEffectSeverity = document.getElementById("input-sideEffectSeverity-UPDATE");

    if (isNaN(inputInteractionID.value)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        interactionID: inputInteractionID.value,
        source: inputSource.value,
        sideEffectDescription: inputSideEffectDescription.value,
        sideEffectSeverity: inputSideEffectSeverity.value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-drug-interaction", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, inputInteractionID.value);

            console.log('Emptying values')
            inputInteractionID.value = "";
            inputSource.value = "";
            inputSideEffectDescription.value = "";
            inputSideEffectSeverity.value = "";

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});

function updateRow(data, interactionID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("drug-interaction-table");
    
    for (let i = 1, row; row = table.rows[i]; i++) {
        console.log(row)

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