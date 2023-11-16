function deletePatientPrescription(patientPrescriptionID) {
    let link = '/delete-patient-prescription/';
    let data = {
      id: patientPrescriptionID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(patientPrescriptionID);
      }
    });
  }
  
  function deleteRow(patientPrescriptionID){
      let table = document.getElementById("prescription-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == patientPrescriptionID) {
              table.deleteRow(i);
              break;
         }
      }
  }