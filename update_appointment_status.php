<?php
// update_appointment_status.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT"); 
header("Access-Control-Allow-Headers: Content-Type");

// Database connection parameters
$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "booking";

// Get the user ID and new status from the request
$userId = $_GET['userId'];
$newStatus = $_GET['status'];

// Connect to the database
$conn = new mysqli($hostName, $dbUser, $dbPassword, $dbName);

//  SQL statement
$stmt = $conn->prepare("UPDATE users SET appointment_status = ? WHERE id = ?");
$stmt->bind_param("si", $newStatus, $userId);

// Execute statement
if ($stmt->execute()) {
    // success response
    http_response_code(200);
    echo json_encode(array("message" => "Appointment status updated successfully"));
} else {
    // error response
    http_response_code(500);
    echo json_encode(array("message" => "Error updating appointment status"));
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>

