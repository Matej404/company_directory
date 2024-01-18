let dataFound = [];

$(document).ready(function() {
    
    $("#searchInp").on("keyup", function () {
  
    let searchText = $(this).val().trim();

    if(searchText !== "") {
  
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
            
            refreshPersonnelTable(dataFound);
            refreshDepartmentTable(dataFound);
            refreshLocationTable(dataFound);
          } else {

            console.log("Error: ", response.status.success);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
          console.error("AJAX Error:", textStatus, errorThrown);
        }
      })
    } 
    
  });
  
  $("#refreshBtn").click(function () {
    
    if ($("#personnelBtn").hasClass("active")) {
      // Refresh personnel table
      refreshPersonnelTable(dataFound);

    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        refreshDepartmentTable(dataFound);
        
      } else {
        
        // Refresh location table
        refreshLocationTable();
        
      }
      
    }
    
  });

  function refreshPersonnelTable(dataFound) {
    if (dataFound.length > 0) {
      let personId = dataFound[0].id;

      $.ajax({
        url: "libs/php/getPersonnelByID.php", 
        type: "GET",
        dataType: "json",
        data: {
          id: personId, 
        },
        success: function (result) {

            if (result.status.code === "200") {
                let personnelData = result.data.personnel;

                $('#personnel-tab-pane table tbody').html(''); // Clear the table body

                personnelData.forEach(function (person) {
                    // Append rows to the table with fetched personnel data
                    $('#personnel-tab-pane table tbody').append(
                        '<tr>' +
                        '<td class="align-middle text-nowrap">' + person.firstName + ', ' + person.lastName + '</td>' +
                        '<td class="align-middle text-nowrap d-none d-md-table-cell">' + dataFound[0].departmentName + '</td>' +
                        '<td class="align-middle text-nowrap d-none d-md-table-cell">' + dataFound[0].locationName + '</td>' +
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




  function refreshDepartmentTable(dataFound) {
    //console.log("DATA FOUND DEPARTMENT: ", dataFound)
    if(dataFound.length > 0) {
      let departmentId = dataFound[0].departmentID;

      $.ajax({
        url: "libs/php/getDepartmentByID.php", 
        type: "GET",
        dataType: "json",
        data: {
          id: departmentId
        },
        success: function (result) {
  
            if (result.status.code === "200") {
                let departmentData = result.data;
  
                $('#departments-tab-pane table tbody').html(''); // Clear the table body
  
                departmentData.forEach(function (department) {
    
                    // Append rows to the table with fetched department data
                    $('#departments-tab-pane table tbody').append(
                        '<tr>' +
                        '<td class="align-middle text-nowrap">' + department.name + '</td>' +
                        '<td class="align-middle text-nowrap d-none d-md-table-cell">' + dataFound[0].locationName + '</td>' +
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
  }

  function refreshLocationTable(dataFound) {
    if(dataFound.length > 0) {
      let locationId = dataFound[0].locationID;

      $.ajax({
        url: "libs/php/getLocationById.php",
        type: "GET",
        dataType: "json",
        data: {
          id: locationId
        },
        success: function(result) {

          if(result.status.code === "200") {
            let locationData = result.data.location;
          

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
  }
  
  $("#filterBtn").click(function () {
    console.log("trigger personnal table!!!!!")
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
  $("#addBtn").click(function () {
    
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  });
  
  $("#personnelBtn").click(function () {
    // Call function to refresh personnel table
    refreshPersonnelTable(dataFound);
    
  });
  
  $("#departmentsBtn").click(function () {
    
    // Call function to refresh department table
    refreshDepartmentTable(dataFound);
    
  });
  
  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    refreshLocationTable(dataFound);
    
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


  