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

            console.log("Error: ", response.status.description);
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
        refreshLocationTable(dataFound);
        
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
          //console.log("Get person by ID: ", result);

            if (result.status.code === "200") {
                let personnelData = result.data.personnel;
                //console.log("Personnel Data: ", personnelData)

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
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    openFilterModal();
  });

      // Add event listener for when the user applies the filter
      $("#applyFilterBtn").click(function () {
        // Get selected filter criteria
        let selectedDepartments = getSelectedDepartments();
        let selectedLocations = getSelectedLocations();

        // Perform the filter operation based on selected criteria
        filterTable(selectedDepartments, selectedLocations);

        // Close the filter modal
        $("#filterModal").modal("hide");
    });

  function openFilterModal() {

    $("#filterModal").modal("show");


}

function getSelectedDepartments() {

    return $(".departmentCheckbox:checked").map(function () {
        return $(this).val();
    }).get();
}

function getSelectedLocations() {

    return $(".locationCheckbox:checked").map(function () {
        return $(this).val();
    }).get();
}

function filterTable(selectedDepartments, selectedLocations) {
  console.log("Filtering with departments:", selectedDepartments);
  console.log("Filtering with locations:", selectedLocations);

    $.ajax({
        url: "libs/php/filterPersonnel.php",
        type: "GET",
        dataType: "json",
        data: {
            departments: selectedDepartments,
            locations: selectedLocations
        },
        success: function (response) {
          console.log("AJAX response:", response);

            if (response.status.code === "200") {
                let filteredData = response.data;
                console.log("Filter data found: ", filteredData)
                refreshPersonnelTable(filteredData);
                refreshDepartmentTable(filteredData);
                refreshLocationTable(filteredData);
            } else {
                console.error("Error filtering data:", response.status.description);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
          console.error("AJAX Error:", textStatus, errorThrown);
        }
    });
}

  
  $("#addBtn").click(function () {
    
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display

    if ($("#personnelBtn").hasClass("active")) {
      // Open the add modal for personnel
      openAddPersonnelModal();

    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Open the add modal for departments
        openAddDepartmentModal();
        
      } else {
        
        // Open the add modal for locations
        openAddLocationModal();
        
      }
      
    }
  });

  function openAddPersonnelModal() {
    // Clear any existing values in the add personnel modal inputs
    $("#addPersonnelFirstName").val("");
    $("#addPersonnelLastName").val("");
    $("#addPersonnelJobTitle").val("");
    $("#addPersonnelEmailAddress").val("");
    $("#addPersonnelDepartment").empty(); // Clear existing dropdown options

    // Fetch the list of departments from the server
    $.ajax({
        url: "libs/php/getAllDepartments.php", // Replace with the actual URL to fetch departments
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.status.code === "200") {
                let departments = response.data;

                // Populate the department dropdown with fetched data
                departments.forEach(function (department) {
                    $("#addPersonnelDepartment").append(
                        $("<option>", {
                            value: department.id,
                            text: department.name
                        })
                    );
                });

                // Open the add personnel modal
                $("#addPersonnelModal").modal("show");
            } else {
                console.error("Error fetching departments:", response.status.description);
                // Display an error message or take appropriate action
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            console.error("AJAX Error:", textStatus, errorThrown);
        }
    });
}


// Execute when the form button with type="submit" is clicked in the add personnel modal
$("#addPersonnelForm").on("submit", function (e) {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Serialize form data
  let formData = $(this).serialize();
  console.log("Add Personnel Form Data:", formData);

  // Perform AJAX call to submit form data
  $.ajax({
      url: $(this).attr("action"),
      type: $(this).attr("method"),
      data: formData,
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
          // Handle success response
          if (response.status.code === "200") {
              console.log("Personnel added successfully:", response);

              // Close the add personnel modal
              $("#addPersonnelModal").modal("hide");

              // You might want to refresh the personnel table after adding a new entry
              refreshPersonnelTable(dataFound);
          } else {
              console.error("Personnel addition error:", response.status.description);
              // Display an error message or take appropriate action
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
          console.error("AJAX error:", textStatus, errorThrown);
      }
  });
});




function openAddDepartmentModal() {
  console.log("Open the add modal for department")
}

function openAddLocationModal() {
  console.log("Open the add modal for location")
}

  
/*


  $("#personnelBtn").click(function () {
    // Activate the Personnel tab
    $('#myTab a[href="#personnel-tab-pane"]').tab('show');

    // Call function to refresh personnel table
    refreshPersonnelTable(dataFound);
    
  });
  
  $("#departmentsBtn").click(function () {
    // Activate the Departments tab
    $('#myTab a[href="#departments-tab-pane"]').tab('show');
    
    // Call function to refresh department table
    refreshDepartmentTable(dataFound);
    
  });
  
  $("#locationsBtn").click(function () {
    // Activate the Locations tab
    $('#myTab a[href="#locations-tab-pane"]').tab('show');
    
    // Call function to refresh location table
    refreshLocationTable(dataFound);
    
  });
  */
  
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
          console.log("Employee ID:", $("#editPersonnelEmployeeID").val());
  
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          console.log("First Name:", $("#editPersonnelFirstName").val());
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          console.log("Last Name:", $("#editPersonnelLastName").val());
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          console.log("Job Title:", $("#editPersonnelJobTitle").val());
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
          console.log("Email Address:", $("#editPersonnelEmailAddress").val());
          
  
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
          console.log("Personnel Department:", $("#editPersonnelDepartment").val());
          
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
    
    // stop the default browser behviour
  
    e.preventDefault();

    // Serialize form data
    let formData = $(this).serialize();
    console.log("Form Data:", formData);

 
    // Perform AJAX call to submit form data
    $.ajax({
       url: $(this).attr("action"),
       type: $(this).attr("method"),
       data: formData,
       contentType: "application/json",
       dataType: "json",
       success: function (response) {
          // Handle success response
          //console.log("Form submitted successfully:", response);

          // Close the modal or perform any other actions as needed
          //$("#editPersonnelModal").modal("hide");
                      // Check if the status code is 200 for a successful response
                      if (response.status.code === "200") {
                        // Handle success response
                        console.log("Form submitted successfully:", response);

        
                        // Close the modal or perform any other actions as needed
                        $("#editPersonnelModal").modal("hide");
                    } else {
                        // Handle the case where the server returns an error
                        console.error("Form submission error:", response.status.description);
                        // Display an error message or take appropriate action
                    }
       },
       error: function (jqXHR, textStatus, errorThrown) {
          // Handle error response
          console.error("Form submission error:", textStatus, errorThrown);
          // Display an error message or take appropriate action
       }
    });
    
  });
});


  