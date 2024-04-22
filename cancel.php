<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// PHPMailer files
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

//  pass the incoming JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Check if id parameter is provided
if (!isset($data['id'])) {
    http_response_code(400); 
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


$id = mysqli_real_escape_string($conn, $data['id']);


// Fetch appointment details of associated user id
$sqlFetchAppointment = "SELECT * FROM users WHERE ID = '$id'";
$result = mysqli_query($conn, $sqlFetchAppointment);
if (!$result || mysqli_num_rows($result) == 0) {
    http_response_code(404); // Not found
    die("Error: Appointment not found.");
}
$appointment = mysqli_fetch_assoc($result);

// Delete the appointment from the users table
$sqlDeleteAppointment = "DELETE FROM users WHERE ID = '$id'";



if (mysqli_query($conn, $sqlDeleteAppointment)) {
    // Success - Send email notification to the user
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'nolwazivmalinga@gmail.com';
        $mail->Password = 'zkbg yvll owky gzdy'; 
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;
        $mail->setFrom('nolwazivmalinga@gmail.com', 'Nolwazi'); 
        $mail->addAddress($appointment['Email'], $appointment['Firstname'] . ' ' . $appointment['Lastname']);
        $mail->isHTML(true);
        $mail->Subject = 'Appointment Cancellation Notification';
        // Email body with appointment cancellation notification for the user
        $mail->Body = '
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f8f8f8;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #d04167;
                    }
                    p {
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Appointment Cancellation Notification</h1>
                    <p>Dear ' . $appointment['Firstname'] . ',</p>
                    <p>We regret to inform you that your appointment scheduled for ' . $appointment['SelectedDate'] . ' at ' . $appointment['SelectedTime'] . ' has been canceled.</p>
                    <p>We apologize for any inconvenience this may cause.</p>
                    <p>Thank you for your understanding.</p>
                    <p>Best regards,<br> NNAILS</p>
                </div>
            </body>
            </html>';
        $mail->send();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        // Error sending email
        echo json_encode(['success' => false, 'message' => $mail->ErrorInfo]);
    }

    // Send email notification to the admin
    $adminEmail = 'nolwazivmalinga@gmail.com';
    $mailAdmin = new PHPMailer(true);
    try {
        $mailAdmin->isSMTP();
        $mailAdmin->Host = 'smtp.gmail.com';
        $mailAdmin->SMTPAuth = true;
        $mailAdmin->Username = 'nolwazivmalinga@gmail.com'; // Your Gmail email address
        $mailAdmin->Password = 'zkbg yvll owky gzdy'; // Your Gmail password
        $mailAdmin->SMTPSecure = 'ssl';
        $mailAdmin->Port = 465;
        $mailAdmin->setFrom('nolwazivmalinga@gmail.com', 'Nolwazi'); // Your Gmail email address and your name
        $mailAdmin->addAddress($adminEmail);
        $mailAdmin->isHTML(true);
        $mailAdmin->Subject = 'Appointment Cancellation Notification';
        // Email body with appointment cancellation notification for the admin
        $mailAdmin->Body = '
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f8f8f8;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #d04167;
                    }
                    p {
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Appointment Cancellation Notification</h1>
                    <p>The appointment scheduled for ' . $appointment['SelectedDate'] . ' at ' . $appointment['SelectedTime'] . ' has been canceled by the user.</p>
                    <p>Details of the canceled appointment:</p>
                    <p>User: ' . $appointment['Firstname'] . ' ' . $appointment['Lastname'] . '</p>
                    <p>Email: ' . $appointment['Email'] . '</p>
                    <p>Service: ' . $appointment['SelectedService'] . '</p>
                </div>
            </body>
            </html>';
        $mailAdmin->send();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
    
        echo json_encode(['success' => false, 'message' => $mailAdmin->ErrorInfo]);
    }
} else {
   
    http_response_code(500); 
    echo json_encode(['success' => false, 'message' => 'Failed to cancel appointment']);
}

mysqli_close($conn);
?>










