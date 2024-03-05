<?php

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

if (
    !isset($_POST['editDepartmentID']) ||
    !isset($_POST['editDepartment']) ||
    !isset($_POST['editDepartmentLocationName'])
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

$departmentID = $_POST['editDepartmentID'];
$department = $_POST['editDepartment'];
$locationID = $_POST['editDepartmentLocationName'];


$query = $conn->prepare('UPDATE department SET name=?, locationID=? WHERE id=?');
$query->bind_param("sii", $department, $locationID, $departmentID);
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

function fetchUpdatedData($conn, $departmentID) {
    $query = $conn->prepare('SELECT * FROM department WHERE id = ?');
    $query->bind_param("i", $departmentID);
    $query->execute();

    $result = $query->get_result();

    $updatedData = $result->fetch_assoc();

    $result->free_result();

    return $updatedData;
}

$updatedData = fetchUpdatedData($conn, $departmentID);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $updatedData;

mysqli_close($conn);

echo json_encode($output);

?>
