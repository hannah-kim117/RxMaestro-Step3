
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-patientPrescription-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatientPrescriptionID = document.getElementById("input-patientPrescriptionID-UPDATE");
    let inputDosage = document.getElementById("input-dosage-UPDATE");
    let inputDrugID = document.getElementById("input-drugID-UPDATE");
    let inputPatientID = document.getElementById("input-patientID-UPDATE");

    // Get the values from the form fields
    let patientPrescriptionIDValue = inputPatientPrescriptionID.value;
    let dosageValue = inputDosage.value;
    let drugIDValue = inputDrugID.value;
    let patientIDValue = inputPatientID.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for dosage

    if (isNaN(patientPrescriptionIDValue)) 
    {
        return;
    }
    if (isNaN(drugIDValue)) 
    {
        return;
    }
    if (isNaN(patientIDValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        patientPrescriptionID: patientPrescriptionIDValue,
        dosage: dosageValue,
        drugID: drugIDValue,
        patientID: patientIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-patient-prescription", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, patientPrescriptionIDValue);

            console.log('Emptying values')
            inputPatientPrescriptionID.value = "";
            inputDosage.value = "";
            inputDrugID.value = "";
            inputPatientID.value = "";

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});

function updateRow(data, patientPrescriptionID){
    console.log(`Updating row ID=${patientPrescriptionID}`);
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("prescription-table");
    console.log('Found table');
    
    for (let i = 1, row; row = table.rows[i]; i++) {
        console.log(row)

        if (table.rows[i].getElementsByTagName("td")[0].innerHTML == patientPrescriptionID) {
            console.log(`parsedRow: ${parsedData[i-1].dosage}, ${parsedData[i-1].drugID}, ${parsedData[i-1].patientID}, ${parsedData[i-1].drugName}, ${parsedData[i-1].name}`);
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Adjust dosage
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            td1.innerHTML = parsedData[i-1].dosage; 

            // Adjust dosage
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            td2.innerHTML = parsedData[i-1].drugID; 

            // Adjust dosage
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            td3.innerHTML = parsedData[i-1].patientID; 

            // Adjust dosage
            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            td4.innerHTML = parsedData[i-1].drugName; 

            // Adjust dosage
            let td5 = updateRowIndex.getElementsByTagName("td")[5];
            td5.innerHTML = parsedData[i-1].name; 
       }
    }
}