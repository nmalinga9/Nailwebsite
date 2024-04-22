<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// If this is a preflight request, return early with a 200 status
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

//  session
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

// Function to fetch appointments for a given email
function fetchAppointmentsByEmail($conn, $email) {
    $email = mysqli_real_escape_string($conn, $email);

    // Query to fetch appointments associated with the user's email
    $sql = "SELECT ID, SelectedDate AS date, SelectedTime AS time, SelectedService AS service FROM users WHERE Email = '$email'";
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
    return $appointments;
}

// Handle POST request for logging in
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($data['email']) ? mysqli_real_escape_string($conn, $data['email']) : '';
    $password = isset($data['password']) ? mysqli_real_escape_string($conn, $data['password']) : '';

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(array("error" => "Email and password are required."));
        exit;
    }

    // Check if the user exists and password matches
    $userQuery = mysqli_query($conn, "SELECT ID FROM users WHERE Email = '$email' AND Password = '$password'");
    if (mysqli_num_rows($userQuery) > 0) {
        // User exists and login successful
        // Fetch appointments for the logged-in user
        $appointments = fetchAppointmentsByEmail($conn, $email);
        echo json_encode(array("success" => "Login successful", "appointments" => $appointments)); // Include appointments data in response
    } else {
        // User does not exist or invalid credentials
        http_response_code(401);
        echo json_encode(array("error" => "Invalid email or password"));
    }
    exit;
}

// Handle GET request for fetching appointments
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $email = isset($_GET['email']) ? $_GET['email'] : '';

    if (!$email) {
        http_response_code(400);
        echo json_encode(array("error" => "Email is required."));
        exit;
    }

    // Fetch appointments for the specified email
    $appointments = fetchAppointmentsByEmail($conn, $email);
    echo json_encode(array("appointments" => $appointments));
    exit;
}

// Handle DELETE request for canceling appointment
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
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
    exit;
}

// Handle other request methods if needed
http_response_code(405); // Method Not Allowed
echo json_encode(array("error" => "Method Not Allowed"));

// Close database connection
mysqli_close($conn);
?>











