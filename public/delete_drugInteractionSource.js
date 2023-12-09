// Citation for this file:
// Date: 11/13/2023
// Based on Node.js starter code for this course
// Functions modified from the starter code for our project
// Source of starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Function that creates an AJAX function to perform a delete operation on the row with the provided PK
function deleteDrugInteractionSource(sourceName) {
    console.log(`Deleting ID: ${sourceName}`);
    // Define route to call
    let link = '/delete-drug-interaction-source';

    // Set up data object to pass to backend route
    let data = {
      name: sourceName
    };
    
    // Conduct AJAX call for DELETE
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        // DELETE was successful so call deleteRow operation
        deleteRow(sourceName);
      }
    });
  }
  
  // Function that removes row from table with matching PK
  function deleteRow(sourceName){
      let table = document.getElementById("drug-interaction-source-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == sourceName) {
              table.deleteRow(i);
              break;
         }
      }
  }