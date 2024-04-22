<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start session
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

// Handle POST request for signing up
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $email = isset($data['email']) ? mysqli_real_escape_string($conn, $data['email']) : null;
    $password = isset($data['password']) ? mysqli_real_escape_string($conn, $data['password']) : null;

    // Autheticate form data
    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(array("error" => "Email and password are required."));
        exit;
    }

    // Check if the user already exists
    $existingUserQuery = mysqli_query($conn, "SELECT ID FROM users WHERE Email = '$email'");
    if (mysqli_num_rows($existingUserQuery) > 0) {
        // Update the password for existing user
        $updateQuery = "UPDATE users SET Password = '$password' WHERE Email = '$email'";
        if (mysqli_query($conn, $updateQuery)) {
            echo json_encode(array("success" => "Password updated successfully for existing user"));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to update password for existing user"));
        }
    } else {
        // Insert new user
        $insertQuery = "INSERT INTO users (Email, Password) VALUES ('$email', '$password')";
        if (mysqli_query($conn, $insertQuery)) {
            echo json_encode(array("success" => "User signed up successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Failed to sign up user: " . mysqli_error($conn)));
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request for fetching appointments
    if (!isset($_GET['email'])) {
        http_response_code(400);
        echo json_encode(array("error" => "Email parameter is missing."));
        exit;
    }

    $email = mysqli_real_escape_string($conn, $_GET['email']);

    // Query to fetch appointments associated with the user's email
    $sql = "SELECT ID, SelectedDate AS date, SelectedTime AS time, SelectedService AS service FROM users WHERE Email = '$email'";
    $result = mysqli_query($conn, $sql);

    // Checks if there are appointments for the user
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
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // DELETE request for canceling appointment
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
        echo json_encode(array("success" => "Appointment cancelled successfully."));
    } else {
        // Error deleting appointment notification
        http_response_code(500);
        echo json_encode(array("error" => "Failed to cancel appointment: " . mysqli_error($conn)));
    }
} else {
    
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Method Not Allowed"));
}

// Close database connection
mysqli_close($conn);
?>


























