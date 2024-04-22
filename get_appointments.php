<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start the session
session_start();

// Check if the user is logged in
if (!isset($_SESSION['userId'])) {
    http_response_code(401);
    echo json_encode(array("error" => "User not logged in"));
    exit;
}

$userId = $_SESSION['userId'];

// Database connection settings
$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "booking";

// Connect to the database
$conn = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);
if (!$conn) {
    http_response_code(500);
    echo json_encode(array("error" => "Connection failed: " . mysqli_connect_error()));
    exit;
}

$sql = "SELECT ID, SelectedDate AS date, SelectedTime AS time, SelectedService AS service FROM users WHERE ID = '$userId'";
$result = mysqli_query($conn, $sql);

// Check if there are appointments for the user
$appointments = [];
if (mysqli_num_rows($result) > 0) {
    // Fetch appointment data and store it in an array
    while ($row = mysqli_fetch_assoc($result)) {
        $appointments[] = array(
            "id" => $row['ID'],
            "date" => $row['date'],
            "time" => $row['time'],
            "service" => $row['service']
        );
    }
}

// Send the appointments data as a JSON response
echo json_encode(array("appointments" => $appointments));

// Close database connection
mysqli_close($conn);
?>






