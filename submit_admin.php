<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

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

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the JSON data sent from the client
    $json_data = file_get_contents("php://input");
    
    // Decode JSON data to associative array
    $formData = json_decode($json_data, true);

    // Retrieve form data
    $username = $formData['username'];
    $password = $formData['password'];

    // Query the admins table to verify credentials
    $sql = "SELECT * FROM admins WHERE username = '$username' AND password = '$password'";
    $result = mysqli_query($conn, $sql);

    if ($result && mysqli_num_rows($result) > 0) {
        // Authentication successful
        $response = array(
            "success" => true,
            "message" => "Authentication successful"
        );
    } else {
        // Check if the admin is not found
        $sql = "SELECT * FROM admins WHERE username = '$username'";
        $result = mysqli_query($conn, $sql);

        if ($result && mysqli_num_rows($result) == 0) {
            // Admin not found
            $response = array(
                "success" => false,
                "message" => "Admin not found"
            );
        } else {
            // Invalid username or password
            $response = array(
                "success" => false,
                "message" => "Invalid username or password"
            );
        }
    }

    // Return the response as JSON
    echo json_encode($response);
}

// Close database connection
mysqli_close($conn);
?>



