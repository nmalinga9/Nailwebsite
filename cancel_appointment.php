<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

// Check if the user is logged in
if (!isset($_SESSION['userId'])) {
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

// Handle DELETE request for canceling appointment
$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? mysqli_real_escape_string($conn, $data['id']) : null;
if ($id === null) {
    http_response_code(400);
    echo json_encode(array("error" => "Appointment ID is missing."));
    exit;
}

// Delete the appointment for the logged-in user
$deleteUserQuery = "DELETE FROM users WHERE ID = '$userId' AND ID = '$id'";
if (mysqli_query($conn, $deleteUserQuery)) {
    // Appointment deleted successfully
    echo json_encode(array("success" => "Appointment canceled successfully."));
} else {
    // Error deleting appointment
    http_response_code(500);
    echo json_encode(array("error" => "Failed to cancel appointment: " . mysqli_error($conn)));
}

// Close database connection
mysqli_close($conn);
?>
