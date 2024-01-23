<?php

// Remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Include the login details
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
    !isset($_POST['editPersonnelEmployeeID']) ||
    !isset($_POST['editPersonnelFirstName']) ||
    !isset($_POST['editPersonnelLastName']) ||
    !isset($_POST['editPersonnelJobTitle']) ||
    !isset($_POST['editPersonnelEmailAddress']) ||
    !isset($_POST['editPersonnelDepartment'])
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
$employeeID = $_POST['editPersonnelEmployeeID'];
$firstName = $_POST['editPersonnelFirstName'];
$lastName = $_POST['editPersonnelLastName'];
$jobTitle = $_POST['editPersonnelJobTitle'];
$emailAddress = $_POST['editPersonnelEmailAddress'];
$departmentID = $_POST['editPersonnelDepartment'];

// Validate the form data (add your own validation logic here)

// Update the database
$query = $conn->prepare('UPDATE personnel SET firstName=?, lastName=?, jobTitle=?, email=?, departmentID=? WHERE id=?');
$query->bind_param("ssssii", $firstName, $lastName, $jobTitle, $emailAddress, $departmentID, $employeeID);
$query->execute();

if (false === $query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Function to fetch updated personnel data
function fetchUpdatedData($conn, $employeeID) {
    $query = $conn->prepare('SELECT * FROM personnel WHERE id = ?');
    $query->bind_param("i", $employeeID);
    $query->execute();

    $result = $query->get_result();

    // Fetch the data as an associative array
    $updatedData = $result->fetch_assoc();

    // Free the result set
    $result->free_result();

    return $updatedData;
}

// Fetch the updated personnel data
$updatedData = fetchUpdatedData($conn, $employeeID);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $updatedData;

mysqli_close($conn);

echo json_encode($output);

?>
