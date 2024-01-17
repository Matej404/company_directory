//let dataFound = [];

$(document).ready(function() {
    //console.log("jQuery is working!");
    
    $("#searchInp").on("keyup", function () {
      console.log('Search input keyup event triggered.');
  
    let searchText = $(this).val().trim();
    console.log('Search text:', searchText);

    if(searchText !== "") {
      console.log('Making AJAX request to search for:', searchText);

      $.ajax({
        url: "libs/php/SearchAll.php",
        type: "GET",
        dataType: "json",
        data: {
          txt: searchText
        },
        success: function(response) {
          console.log("Full Response: ", response);
          
          if(response.status.code === "200") {

            let dataFound = response.data.found;
            console.log("Data Found: ", dataFound)
            
            refreshPersonnelTable(dataFound);
          } else {

            console.log("Error: ", response.status.success);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
          console.error("AJAX Error:", textStatus, errorThrown);
        }
      })
    } else {
      dataFound = [];
      refreshPersonnelTable(dataFound);
    }
    
  });
  
  $("#refreshBtn").click(function () {
    
    if ($("#personnelBtn").hasClass("active")) {
      // Refresh personnel table
      
      if (dataFound.length > 0) {
        let personId = dataFound[0].id;
        
        // Refresh personnel table with the person's ID
        refreshPersonnelTable(dataFound);
    }
    
    //refreshPersonnelTable(dataFound);
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        refreshDepartmentTable();
        
      } else {
        
        // Refresh location table
        refreshLocationTable();
        
      }
      
    }
    
  });

  function refreshPersonnelTable(dataFound) {
    console.log("DATA FOUND: ", dataFound)
    if (dataFound.length > 0) {
      let personId = dataFound[0].id;

      $.ajax({
        url: "libs/php/getPersonnelByID.php", 
        type: "GET",
        dataType: "json",
        data: {
          id: personId, 
          //id: 1
        },
        success: function (result) {
            console.log("Success! Result:", result); // Log the fetched result

            if (result.status.code === "200") {
                let personnelData = result.data.personnel;
                console.log(personnelData)

                $('#personnel-tab-pane table tbody').html(''); // Clear the table body

                personnelData.forEach(function (person) {
                    // Append rows to the table with fetched personnel data
                    $('#personnel-tab-pane table tbody').append(
                        '<tr>' +
                        '<td class="align-middle text-nowrap">' + person.firstName + ', ' + person.lastName + '</td>' +
                        '<td class="align-middle text-nowrap d-none d-md-table-cell">' + person.jobTitle + '</td>' +
                        '<td class="align-middle text-nowrap d-none d-md-table-cell">' + person.location + '</td>' +
                        '<td class="align-middle text-nowrap d-none d-md-table-cell">' + person.email + '</td>' +
                        '<td class="text-end text-nowrap">' +
                        '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + person.id + '">' +
                        '<i class="fa-solid fa-pencil fa-fw"></i>' +
                        '</button>' +
                        '<button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="' + person.id + '">' +
                        '<i class="fa-solid fa-trash fa-fw"></i>' +
                        '</button>' +
                        '</td>' +
                        '</tr>'
                    );
                });
                // Update any other UI elements or actions as required
            } else {
                console.error("Error: " + result.status.description);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            console.error("AJAX Error:", textStatus, errorThrown);
        }
    });
  }
}




  function refreshDepartmentTable() {
    $.ajax({
      url: "libs/php/getDepartmentByID.php", 
      type: "GET",
      dataType: "json",
      data: {
          id: 1 // Example ID, you should dynamically pass the ID based on your scenario
      },
      success: function (result) {
          console.log("Success! Result:", result); // Log the fetched result

          if (result.status.code === "200") {
              let departmentData = result.data;
              console.log(departmentData);

              $('#departments-tab-pane table tbody').html(''); // Clear the table body

              departmentData.forEach(function (department) {
                console.log(department.name);
                  // Append rows to the table with fetched department data
                  $('#departments-tab-pane table tbody').append(
                      '<tr>' +
                      '<td class="align-middle text-nowrap">' + department.name + '</td>' +
                      '<td class="align-middle text-nowrap d-none d-md-table-cell">' + department.location + '</td>' +
                      '<td class="align-middle text-end text-nowrap">' +
                      '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="' + department.id + '">' +
                      '<i class="fa-solid fa-pencil fa-fw"></i>' +
                      '</button>' +
                      '<button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="' + department.id + '">' +
                      '<i class="fa-solid fa-trash fa-fw"></i>' +
                      '</button>' +
                      '</td>' +
                      '</tr>'
                  );
              });
              
              // Update any other UI elements or actions as required
          } else {
              console.error("Error: " + result.status.description);
          }
          
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
        console.error("AJAX Error:", textStatus, errorThrown);
      }
  });
  }

  function refreshLocationTable() {
      $.ajax({
        url: "libs/php/getLocationById.php",
        type: "GET",
        dataType: "json",
        data: {
          id: 2
        },
        success: function(result) {
          console.log("Success! Result: ", result);

          if(result.status.code === "200") {
            let locationData = result.data.location;
            console.log(locationData);

            $("#locations-tab-pane table tbody").html('');

            locationData.forEach(function(location) {
              $("#locations-tab-pane table tbody").append(
                '<tr>' +
                '<td class="align-middle text-nowrap">' + location.name + '</td>' +
                '<td class="align-middle text-end text-nowrap">' +
                '<button type="button" class="btn btn-primary btn-sm">' +
                '<i class="fa-solid fa-pencil fa-fw"></i>' +
                '</button>' +
                '<button type="button" class="btn btn-primary btn-sm">' +
                '<i class="fa-solid fa-trash fa-fw"></i>' +
                '</button>' +
                '</td>' +
                '</tr>'
              )
            })

          } else {
            console.log("Error: ", result.status.description);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
          console.error("AJAX Error:", textStatus, errorThrown);
        }
      })
  }
  
  $("#filterBtn").click(function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
  $("#addBtn").click(function () {
    
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  });
  
  $("#personnelBtn").click(function () {
    
    // Call function to refresh personnel table
    //refreshPersonnelTable()
    
  });
  
  $("#departmentsBtn").click(function () {
    
    // Call function to refresh department table
    //refreshDepartmentTable()
    
  });
  
  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    //refreshLocationTable()
    
  });
  
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    
    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
  
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
          
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });
  
  // Executes when the form button with type="submit" is clicked
  
  $("#editPersonnelForm").on("submit", function (e) {
    
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behviour
  
    e.preventDefault();
  
    // AJAX call to save form data
    
  });
});


  