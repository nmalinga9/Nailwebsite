<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5181");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// If this is a preflight request, return early with a 200 status
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read and parse the incoming JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Check if the required id parameter is provided
if (!isset($data['id'])) {
    http_response_code(400); // Bad request
    die("Error: ID parameter is missing.");
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

// Sanitize and validate the id parameter
$id = mysqli_real_escape_string($conn, $data['id']);
// Additional validation can be performed here if needed

// Delete the appointment from the users table
$sqlDeleteAppointment = "DELETE FROM users WHERE id = '$id'";

if (mysqli_query($conn, $sqlDeleteAppointment)) {
    // Success
    echo json_encode(['success' => true]);
} else {
    // Error
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Failed to cancel appointment']);
}

// Close database connection
mysqli_close($conn);
?>




