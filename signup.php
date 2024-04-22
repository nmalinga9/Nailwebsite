<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // Add this line

// If this is a preflight request, return early with a 200 status
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialize session
session_start();

// Log the request data
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);
error_log("Received data: " . json_encode($data));

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

// Handle POST request for logging in
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Your existing code for handling login POST requests...

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request for fetching appointments
    if (!isset($_GET['email'])) {
        http_response_code(400);
        echo json_encode(array("error" => "Email parameter is missing."));
        exit;
    }

    $email = mysqli_real_escape_string($conn, $_GET['email']);

    // Query to fetch appointments associated with the user's email
    $sql = "SELECT ID, SelectedDate, SelectedTime, SelectedService FROM users WHERE Email = '$email'";
    $result = mysqli_query($conn, $sql);

    // Check if there are appointments for the user
    $appointments = [];
    if (mysqli_num_rows($result) > 0) {
        // Fetch appointment data and store it in an array
        while ($row = mysqli_fetch_assoc($result)) {
            $appointments[] = array(
                "id" => $row['ID'], // Include the ID field
                "date" => $row['SelectedDate'],
                "time" => $row['SelectedTime'],
                "service" => $row['SelectedService']
            );
        }
    }

    // Send the appointments data as a JSON response
    echo json_encode(array("appointments" => $appointments));
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Handle DELETE request for canceling appointment
    $id = isset($data['id']) ? mysqli_real_escape_string($conn, $data['id']) : null;

    if ($id === null) {
        http_response_code(400);
        echo json_encode(array("error" => "Appointment ID is missing."));
        exit;
    }

    // Delete the appointment only from the 'users' table
    $deleteUserQuery = "DELETE FROM users WHERE ID = '$id'";

    if (mysqli_query($conn, $deleteUserQuery)) {
        // Appointment deleted successfully
        echo json_encode(array("success" => "Appointment canceled successfully."));
    } else {
        // Error deleting appointment
        http_response_code(500);
        echo json_encode(array("error" => "Failed to cancel appointment: " . mysqli_error($conn)));
    }
} else {
    // Handle other request methods if needed
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Method Not Allowed"));
}

// Close database connection
mysqli_close($conn);
?>





















