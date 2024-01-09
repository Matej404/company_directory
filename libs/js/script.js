$(document).ready(function() {
    console.log("jQuery is working!");
    // You can add more code here to test jQuery functionality
    $("#searchInp").on("keyup", function () {
  
    // your code
    
  });
  
  $("#refreshBtn").click(function () {
    
    if ($("#personnelBtn").hasClass("active")) {
      
      // Refresh personnel table
      refreshPersonnelTable()
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        refreshDepartmentTable();
        
      } else {
        
        // Refresh location table
        
      }
      
    }
    
  });

  function refreshPersonnelTable() {
    $.ajax({
        url: "libs/php/getPersonnelByID.php", 
        type: "GET",
        dataType: "json",
        data: {
            id: 24 // Example ID, you should dynamically pass the ID based on your scenario
        },
        success: function (result) {
            console.log("Success! Result:", result); // Log the fetched result

            if (result.status.code === "200") {
                let personnelData = result.data.personnel;
                console.log(personnelData)

                //let departmentData = result.data.department;
                //console.log(departmentData);

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
            console.error("Error fetching personnel data: " + errorThrown);
        }
    });
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
          console.error("Error fetching personnel data: " + errorThrown);
      }
  });
  }

  function refreshLocationTable() {
      // Logic to refresh the location table
      // Fetch updated location data via AJAX and update the displayed location data
  }
  
  $("#filterBtn").click(function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
  $("#addBtn").click(function () {
    
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  });
  
  $("#personnelBtn").click(function () {
    
    // Call function to refresh personnel table
    
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


  