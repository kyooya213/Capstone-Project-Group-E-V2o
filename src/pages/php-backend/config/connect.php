<?php
$host = 'localhost';
$username = 'root';
$password = ''; // Default password for XAMPP
$dbname = 'login'; // Ensure this matches your database name

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

$query = "SELECT * FROM users";
$result = $pdo->query($query);
if ($result) {
    echo "Database connection successful!";
} else {
    echo "Error: " . $pdo->errorInfo()[2];
}

function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

$email = $conn->real_escape_string($input['email']);
$password = md5($conn->real_escape_string($input['password']));

$query = "SELECT * FROM users WHERE email='$email' AND password='$password'";
$result = $conn->query($query);

if ($result === false) {
    echo json_encode(['error' => 'Query failed: ' . $conn->error]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
$stmt->execute([$user['id'], $sessionToken, $expiresAt]);
?>