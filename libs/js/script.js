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
          //console.log("Full Response: ", response);
          
          if(response.status.code === "200") {

            let dataFound = response.data.found;
            //console.log("Data Found", dataFound);

            listPersonnelTable(dataFound);
            listDepartmentTable(dataFound);
            listLocationTable(dataFound);
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
  
  
  //_______listing_personnel_departments_personnel_functions_for_searchInp_event listener_____________//

  function listPersonnelTable(dataFound) {
    if (dataFound.length > 0) {
        $('#personnel-tab-pane table tbody').html(''); 

        dataFound.forEach(function (person) {
            $('#personnel-tab-pane table tbody').append(
              '<tr>' +
              '<td class="align-middle text-nowrap">' + person.firstName + ', ' + person.lastName + '</td>' +
              '<td class="align-middle text-nowrap d-none d-md-table-cell">' + person.departmentName + '</td>' +
              '<td class="align-middle text-nowrap d-none d-md-table-cell">' + person.locationName + '</td>' +
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
    } else {
        console.log("No data found for personnel.");
    }
}


function listDepartmentTable(dataFound) {
  if (dataFound.length > 0) {
      $('#departments-tab-pane table tbody').html(''); 

      dataFound.forEach(function (department) {
          $('#departments-tab-pane table tbody').append(
            '<tr>' +
            '<td class="align-middle text-nowrap">' + department.departmentName + '</td>' +
            '<td class="align-middle text-nowrap d-none d-md-table-cell">' + department.locationName + '</td>' +
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

  } else {

      console.log("No data found for department.");
  }
}

function listLocationTable(dataFound) {
  if (dataFound.length > 0) {
      $('#locations-tab-pane table tbody').html(''); 

      dataFound.forEach(function (location) {
          $("#locations-tab-pane table tbody").append(
            '<tr>' +
            '<td class="align-middle text-nowrap">' + location.locationName + '</td>' +
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
      });

  } else {
 
      console.log("No data found for department.");
  }
}
//______________________________________________________________________________________________//
  
  
  $("#refreshBtn").click(function () {
    //console.log("Refresh Button")
    
    if ($("#personnelBtn").hasClass("active")) {
      
      // Refresh personnel table
      refreshPersonnelTable();
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {        

        // Refresh department table
        
      } else {
        
        // Refresh location table
        
      }
      
    }
    
  });


//________refresh-personnel_department_location_functions_____________________________________//
function refreshPersonnelTable() {
  $.ajax({
    url: "libs/php/refreshPersonnel.php",
    type: "GET",
    dataType: "json",
    success: function(response) {
        if (response.status.code === "200") {
            let refreshedData = response.data; 
            console.log("Refreshed personnel data: ", refreshedData);
            listPersonnelTable(refreshedData);
        } else {
            console.error("Error refreshing personnel data:", response.status.description);
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
      console.error("AJAX Error: ", textStatus, errorThrown);
    }
  });
}


//_____________________________________________________________________________________________//


//________get-personnel_department_location_by_id_functions_____________________________________//
function getPersonneById(dataFound) {
  if(dataFound.length > 0) {
    let personId = dataFound[0].id;

    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      type: "GET",
      dataType: "json",
      data: {
        id: personId
      },
      success: function(response) {
        //console.log("Get person by ID: ", response);
        if(response.status.code === "200") {
          let personnelData = response.data.personnel;
          //console.log("Get Person", personnelData)

          $('#personnel-tab-pane table tbody').html("");

          personnelData.forEach(function(person) {
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
            )
          })


        } else {
          console.log("Error: ", response.status.description);

        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
        console.error("AJAX Error: ", textStatus, errorThrown);
      }
    })
  }
}

function getDepartmentById(dataFound) {
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

              $('#departments-tab-pane table tbody').html(''); 

              departmentData.forEach(function (department) {
  
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


function getLocationById(dataFound) {
  if(dataFound.length > 0) {
    let locationId = dataFound[0].locationID;

    $.ajax({
      url: "libs/php/getLocationByID.php",
      type: "GET",
      dataType: "json",
      data: {
        id: locationId
      },
      success: function(response) {
        if(response.status.code === "200") {
          let locationData = response.data.location;

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
          console.log("Error: ", response.status.description);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
        console.error("AJAX Error: ", textStatus, errorThrown);
      }
    })
  }
}

//___________________________________________________________________________________________________

  
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
          console.log("FILTER AJAX response:", response);

            if (response.status.code === "200") {
                let filteredData = response.data;
                //console.log("Filter data found: ", filteredData)

                listPersonnelTable(filteredData);
                listDepartmentTable(filteredData);
                listLocationTable(filteredData);
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
  //console.log("Add Personnel Form Data:", formData);

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
              //console.log("Personnel added successfully:", response);

              // Close the add personnel modal
              $("#addPersonnelModal").modal("hide");

              // You might want to refresh the personnel table after adding a new entry
              //refreshPersonnelTable(dataFound);
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


$("#personnelBtn").click(function () {
    
  // Call function to refresh personnel table
  refreshPersonnelTable();
  
});

$("#departmentsBtn").click(function () {
  
  // Call function to refresh department table
  
});

$("#locationsBtn").click(function () {
  
  // Call function to refresh location table
  
});

  
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    
    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") 
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


  