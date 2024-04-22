<?php
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
    // Retrieve form data
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $selectedDate = $_POST['selectedDate'];
    $selectedTime = $_POST['selectedTime'];
    $selectedService = $_POST['selectedService'];

    // Ensure consistent date and time format
    $formattedDate = date('Y-m-d', strtotime($selectedDate));
    $formattedTime = date('H:i:s', strtotime($selectedTime));

    // Insert form data into the users table
    $sql = "INSERT INTO users (Firstname, Lastname, PhoneNumber, Email, SelectedDate, SelectedTime, SelectedService) 
            VALUES ('$firstName', '$lastName', '$phone', '$email', '$formattedDate', '$formattedTime', '$selectedService')";
    if (mysqli_query($conn, $sql)) {
        // Data inserted successfully
        echo json_encode(array("success" => true));

        // Update the corresponding record in the available_times table to mark it as unavailable
        $updateSql = "UPDATE available_times 
                      SET available = 0 
                      WHERE date = '$formattedDate' AND time_slot = '$formattedTime' AND available = 1";
        if (mysqli_query($conn, $updateSql)) {
            // Available times updated
        } else {
            echo json_encode(array("success" => false, "error" => mysqli_error($conn)));
        }
    } else {
        // Error occurred
        echo json_encode(array("success" => false, "error" => mysqli_error($conn)));
    }
}

// Close database connection
mysqli_close($conn);
?>














