<?php
// Display PHP errors and warnings
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Disable output buffering
while (ob_get_level()) {
    ob_end_clean();
}

// Disable PHP output compression
ini_set('zlib.output_compression', 'Off');

// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Include PHPMailer autoloader
// Adjust the require statements to point to the PHPMailer files in the specified directory
require 'C:\xampp\htdocs\PHPMailer-master\src\PHPMailer.php';
require 'C:\xampp\htdocs\PHPMailer-master\src\SMTP.php';
require 'C:\xampp\htdocs\PHPMailer-master\src\Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Database connection parameters
$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "booking";

// Connect to the database
$conn = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);

// Check connection
if (!$conn) {
    $response = array("success" => false, "message" => "Connection failed: " . mysqli_connect_error());
    echo json_encode($response);
    exit;
}

// Handle form submission or appointment fetch
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Handle form submission
    // Get the JSON data sent from the client
    $json_data = file_get_contents("php://input");
    $formDataWithDateTime = json_decode($json_data, true);

    // Retrieve form data
    $firstName = $formDataWithDateTime['firstName'];
    $lastName = $formDataWithDateTime['lastName'];
    $email = $formDataWithDateTime['email'];
    $phone = $formDataWithDateTime['phone'];
    $selectedDate = date('Y-m-d', strtotime($formDataWithDateTime['selectedDate']));
    $selectedTime = $formDataWithDateTime['selectedTime'];
    $selectedService = $formDataWithDateTime['selectedService'];

    // Insert form data into the database with SelectedService field
    $sql = "INSERT INTO users (Firstname, Lastname, Email, PhoneNumber, SelectedDate, SelectedTime, SelectedService) VALUES ('$firstName', '$lastName', '$email', '$phone', '$selectedDate', '$selectedTime', '$selectedService')";

    if (mysqli_query($conn, $sql)) {
        // Data inserted successfully
        // Send confirmation email
        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->isSMTP();
            $mail->Host = 'smtp.aol.com'; // AOL SMTP server
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;
            $mail->SMTPAuth = true;
            $mail->Username = 'nol900023@aol.com'; // Your AOL email address
            $mail->Password = 'tianakimare23'; // Your AOL account password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = "587";

            //Recipients
            $mail->setFrom('nol900023@aol.com', 'Shanice');
            $mail->addAddress($email, $firstName); // Add a recipient

            //Content
            $mail->isHTML(true); // Set email format to HTML
            $mail->Subject = 'Booking Confirmation';
            $mail->Body = "Hello $firstName,<br><br>Your appointment for $selectedService on $selectedDate at $selectedTime has been successfully booked.<br><br>Thank you for choosing us!";
            $mail->send();

            $response = array("success" => true, "message" => "Booking successful. Confirmation email sent.");
            echo json_encode($response);
        } catch (Exception $e) {
            $response = array("success" => false, "message" => "Error sending confirmation email: " . $mail->ErrorInfo);
            echo json_encode($response);
        }
    } else {
        // Error occurred during booking
        $response = array("success" => false, "message" => "Error booking: " . mysqli_error($conn));
        echo json_encode($response);
    }
}

// Close database connection
mysqli_close($conn);
?>


















