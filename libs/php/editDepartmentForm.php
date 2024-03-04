<?php

// example use from the browser
// http://localhost/companydirectory/libs/php/editDepartmentForm.php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Check if the required parameters are present
if (
    !isset($_POST['editDepartmentID']) ||
    !isset($_POST['editDepartmentLocationName']) ||
    !isset($_POST['editDepartment'])
) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "missing parameters";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Extract form data
$departmentID = $_POST['editDepartmentID'];
$locationName = $_POST['editDepartmentLocationName'];
$selectedDepartmentID = $_POST['editDepartment'];

// Fetch the selected department name based on the ID
$query = $conn->prepare('SELECT name FROM department WHERE id=?');
$query->bind_param("i", $departmentID);

$query->execute();
$result = $query->get_result();

if (!$result) {
        $output['status']['code'] = "500"; 
        $output['status']['name'] = "error";
        $output['status']['description'] = "Error fetching department name";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        mysqli_close($conn);
    
        echo json_encode($output);
    
        exit;
}

$selectedDepartment = $result->fetch_assoc()['name'];

// Fetch the selected location name based on the provided location name
$query = $conn->prepare('SELECT id FROM location WHERE name=?');
$query->bind_param("s", $locationName);
$query->execute();
$result = $query->get_result();

if (!$result) {
        $output['status']['code'] = "500"; 
        $output['status']['name'] = "error";
        $output['status']['description'] = "Error fetching location ID";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];
    
        mysqli_close($conn);
    
        echo json_encode($output);
    
        exit;
}

$selectedLocationID = $result->fetch_assoc()['id'];

// Update the department name and location ID in the database
$query = $conn->prepare('UPDATE department SET name=?, locationID=? WHERE id=?');
$query->bind_param("sii", $selectedDepartment, $selectedLocationID, $departmentID);
$query->execute();

// Validate the form data (add your own validation logic here)

// Fetch all id and name from department
$query = 'SELECT id, name FROM department ORDER BY name';
$result = $conn->query($query);

if (!$result) {
    $output['status']['code'] = "500"; // Internal Server Error
    $output['status']['name'] = "error";
    $output['status']['description'] = "Error updating department information";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

$allDepartments = [];

while ($row = mysqli_fetch_assoc($result)) {
    array_push($allDepartments, $row);
}

// Function to fetch updated department data
function fetchUpdatedData($conn, $departmentID)
{
    $query = $conn->prepare('SELECT d.id, d.name, d.locationID, l.name AS locationName 
                             FROM department d 
                             LEFT JOIN location l ON d.locationID = l.id 
                             WHERE d.id = ?');
    $query->bind_param("i", $departmentID);
    $query->execute();

    $result = $query->get_result();

    // Fetch the data as an associative array
    $updatedData = $result->fetch_assoc();

    // Free the result set
    $result->free_result();

    return $updatedData;
}

// Fetch the updated department data
$updatedData = fetchUpdatedData($conn, $departmentID);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $updatedData;
$output['data']['allDepartments'] = $allDepartments;

mysqli_close($conn);

echo json_encode($output);
?>

