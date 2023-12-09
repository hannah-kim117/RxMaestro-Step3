function deleteDrugInteractionSource(sourceName) {
    console.log(`Deleting ID: ${sourceName}`);
    let link = '/delete-drug-interaction-source';
    let data = {
      name: sourceName
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(sourceName);
      }
    });
  }
  
  function deleteRow(sourceName){
      let table = document.getElementById("drug-interaction-source-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == sourceName) {
              table.deleteRow(i);
              break;
         }
      }
  }