<?php


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

// first query
$query = "SELECT * from personnel WHERE lastName  LIKE'%" . $_POST['lastName']."%'";

$result = $conn->query($query);


   $employee = [];

while ($row = mysqli_fetch_assoc($result)) {

    array_push($employee, $row);

}

// second query
$query = "SELECT * from personnel WHERE firstName  LIKE'%" . $_POST['firstName']."%'";

$result = $conn->query($query);


while ($row = mysqli_fetch_assoc($result)) {

    array_push($employee, $row);

}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $employee;


mysqli_close($conn);

echo json_encode($output); 

?>