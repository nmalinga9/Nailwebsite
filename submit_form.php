<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Check if the request method is OPTIONS and handle it
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // No need to send any response for OPTIONS requests
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer files
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

// Database connection parameters
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

//  form submission script
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // data to be recevied in the form 
    $formData = json_decode(file_get_contents('php://input'), true);
    $firstName = $formData['firstName'];
    $lastName = $formData['lastName'];
    $email = $formData['email'];
    $phone = $formData['phone'];
    $selectedDate = $formData['selectedDate'];
    $selectedTime = $formData['selectedTime'];
    $selectedService = $formData['selectedService'];

    // Date and time format to match database
    $dateTime = new DateTime($selectedDate);
    $formattedDate = $dateTime->format('Y-m-d');
    
    $formattedTime = date('H:i:s', strtotime($selectedTime));
    // Insert form data into the users table
    $sql = "INSERT INTO users (Firstname, Lastname, PhoneNumber, Email, SelectedDate, SelectedTime, SelectedService) VALUES ('$firstName', '$lastName', '$phone', '$email', '$formattedDate', '$formattedTime', '$selectedService')";
    if (mysqli_query($conn, $sql)) {
       
        // Update the corresponding record in the available_times table to mark it as unavailable
        $updateSql = "UPDATE available_times SET available = 0 WHERE date = '$formattedDate' AND time_slot = '$formattedTime' AND available = 1";
        if (mysqli_query($conn, $updateSql)) {

           //email confirmations to admin and user
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'nolwazivmalinga@gmail.com'; // Gmail email address
                $mail->Password = 'zkbg yvll owky gzdy'; //  Gmail password
                $mail->SMTPSecure = 'ssl';
                $mail->Port = 465;
                $mail->setFrom('nolwazivmalinga@gmail.com', 'Nolwazi'); // Gmail email address and name
                $mail->addAddress($email, $firstName . ' ' . $lastName);
                $mail->isHTML(true);
                $mail->Subject = 'Appointment Confirmation';
                
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
                            <h1>Appointment Confirmation</h1>
                            <p>Dear ' . $firstName . ',</p>
                            <p>Your appointment has been successfully booked.</p>
                            <p><strong>Date:</strong> ' . $formattedDate . '</p>
                            <p><strong>Time:</strong> ' . $formattedTime . '</p>
                            <p><strong>Service:</strong> ' . $selectedService . '</p>
                            <p>We look forward to seeing you!</p>
                            <p>Best regards,<br> NNAILS</p>
                        </div>
                    </body>
                    </html>';
                $mail->send();

                // Send notification email to admin
                $adminEmail = 'nolwazivmalinga@gmail.com'; // Change this to the admin's email address
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
                    $mailAdmin->Subject = 'New Appointment Booking';
                    // Email body with user's appointment details for admin notification
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
                                <h1>New Appointment Booking</h1>
                                <p>A user has booked a new appointment:</p>
                                <p><strong>User Name:</strong> ' . $firstName . ' ' . $lastName . '</p>
                                <p><strong>User Email:</strong> ' . $email . '</p>
                                <p><strong>Date:</strong> ' . $formattedDate . '</p>
                                <p><strong>Time:</strong> ' . $formattedTime . '</p>
                                <p><strong>Service:</strong> ' . $selectedService . '</p>
                            </div>
                        </body>
                        </html>';
                    $mailAdmin->send();
                } catch (Exception $e) {
                    // Error sending admin notification email
                    $response = array("success" => false, "error" => $mailAdmin->ErrorInfo);
                    header('Content-Type: application/json');
                    echo json_encode($response);
                    exit;
                }

                // Success response
                $response = array("success" => true);
                header('Content-Type: application/json');
                echo json_encode($response);
            } catch (Exception $e) {
                // Error sending user confirmation email
                $response = array("success" => false, "error" => $mail->ErrorInfo);
                header('Content-Type: application/json');
                echo json_encode($response);
                exit;
            }
        } else {
            // Failed to update available times
            $response = array("success" => false, "error" => "Failed to update available times");
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        }
    } else {
        // Error occurred while inserting data
        $response = array("success" => false, "error" => mysqli_error($conn));
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
} else {
    // Return an error response 
    $response = array(
        'success' => false,
        'message' => 'Invalid request method'
    );
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Close database connection
mysqli_close($conn);
































































