<?php
// cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Check if the request method is OPTIONS and handle it
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); 
}


$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "booking";

// Connect to the database
$conn = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);

// Check connection
if (!$conn) {
    $response = array(
        "success" => false,
        "error" => "Connection failed: " . mysqli_connect_error()
    );
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Handle GET request to fetch available times
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Check if the required parameter (selectedDate) is provided
    if (!isset($_GET['selectedDate'])) {
        $response = array(
            "success" => false,
            "error" => "selectedDate parameter is missing"
        );
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }

    //  the selectedDate parameter
    $selectedDate = mysqli_real_escape_string($conn, $_GET['selectedDate']);

    // Fetch available times for the selected date from the database
    $sql = "SELECT time_slot FROM available_times WHERE date = '$selectedDate' AND available = 1";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        $response = array(
            "success" => false,
            "error" => "Error fetching available times: " . mysqli_error($conn)
        );
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }

    // Process the query result 
    $availableTimes = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $availableTimes[] = $row['time_slot'];
    }

    // Return as JSON response
    $response = array(
        "success" => true,
        "availableTimes" => $availableTimes
    );
    header('Content-Type: application/json');
    echo json_encode($response);
}


mysqli_close($conn);
?>






