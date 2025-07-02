<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// MySQL connection settings (update if needed)
$servername = "localhost";
$username = "root";
$password = ""; // default XAMPP password
$dbname = "tarpaulin_printing";

// Create uploads directory if it doesn't exist
$targetDir = "uploads/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $fileName = basename($_FILES["file"]["name"]);
    $uniqueName = uniqid() . '-' . $fileName;
    $targetFile = $targetDir . $uniqueName;

    $fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    $allowedTypes = array("jpg", "jpeg", "png", "pdf");

    if (in_array($fileType, $allowedTypes)) {
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
            // Save file info to MySQL
            $conn = new mysqli($servername, $username, $password, $dbname);
            if ($conn->connect_error) {
                http_response_code(500);
                echo json_encode(["error" => "Database connection failed."]);
                exit;
            }

            $stmt = $conn->prepare("INSERT INTO uploaded_files (file_name, file_url) VALUES (?, ?)");
            $fileUrl = "/uploads/" . $uniqueName;
            $stmt->bind_param("ss", $fileName, $fileUrl);

            if ($stmt->execute()) {
                echo json_encode([
                    "url" => $fileUrl,
                    "name" => $fileName,
                    "id" => $stmt->insert_id
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to save file info to database."]);
            }

            $stmt->close();
            $conn->close();
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to upload file."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Only PNG, JPG, and PDF files are allowed."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "No file uploaded."]);
}
?>