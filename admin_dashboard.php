<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection parameters
$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "booking";

// Create db connection
$conn = new mysqli($hostName, $dbUser, $dbPassword, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch booking information
$sql = "SELECT * FROM users";

$result = $conn->query($sql);

$bookings = array();

if ($result->num_rows > 0) {
    // Fetch 
    while ($row = $result->fetch_assoc()) {
    
        $bookings[] = $row;
    }
}

// Close connection
$conn->close();

// Send the bookings data as JSON response
header('Content-Type: application/json');
echo json_encode($bookings);
?>



