<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Check if the required parameter (selectedDate) is provided
if (!isset($_GET['selectedDate'])) {
    http_response_code(400); // Bad request
    die("Error: selectedDate parameter is missing.");
}

// Database connection parameters
$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "booking";

// Connect to the database
$conn = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Sanitize and validate the selectedDate parameter
$selectedDate = mysqli_real_escape_string($conn, $_GET['selectedDate']);
// Additional validation can be performed here if needed

// Fetch available times for the selected date from the database
$sql = "SELECT time_slot FROM available_times WHERE date = '$selectedDate' AND available = 1";
$result = mysqli_query($conn, $sql);

if (!$result) {
    http_response_code(500); // Internal server error
    die("Error fetching available times: " . mysqli_error($conn));
}

// Process the query result and format the response
$availableTimes = [];
while ($row = mysqli_fetch_assoc($result)) {
    $availableTimes[] = $row['time_slot'];
}

// Return the available times as JSON response
header('Content-Type: application/json');
echo json_encode(['availableTimes' => $availableTimes]);

// Close database connection
mysqli_close($conn);
?>

