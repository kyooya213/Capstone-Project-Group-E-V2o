<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TarpPrint - PHP Backend</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            color: #1e40af;
            margin-bottom: 30px;
        }
        .api-endpoint {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
        }
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
        }
        .post { background: #10b981; color: white; }
        .get { background: #3b82f6; color: white; }
        .demo-accounts {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        .status {
            text-align: center;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .success { background: #d1fae5; color: #065f46; }
        .error { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 TarpPrint PHP Backend</h1>
            <p>Authentication API for Tarpaulin Printing System</p>
        </div>

        <?php
        // Check database connection
        $host = 'localhost';
        $username = 'root';
        $password = ''; // Default password for XAMPP
        $dbname = 'login'; // Ensure this matches the database name in phpMyAdmin

        $conn = new mysqli($host, $username, $password, $dbname);

        if ($conn->connect_error) {
            die('<div class="status error">❌ Database connection failed: ' . $conn->connect_error . '</div>');
        } else {
            echo '<div class="status success">✅ Database connection successful!</div>';
        }
        ?>

        <h2>📡 Available API Endpoints</h2>
        
        <div class="api-endpoint">
            <span class="method post">POST</span>
            <strong>/api/auth/login.php</strong>
            <p>User login authentication</p>
            <small>Body: {"email": "user@example.com", "password": "password"}</small>
        </div>

        <div class="api-endpoint">
            <span class="method post">POST</span>
            <strong>/api/auth/register.php</strong>
            <p>User registration</p>
            <small>Body: {"email": "user@example.com", "password": "password", "name": "User Name", "phone": "09123456789"}</small>
        </div>

        <div class="api-endpoint">
            <span class="method get">GET</span>
            <strong>/api/auth/session.php</strong>
            <p>Get current user session</p>
            <small>Headers: Authorization: Bearer {token}</small>
        </div>

        <div class="api-endpoint">
            <span class="method post">POST</span>
            <strong>/api/auth/logout.php</strong>
            <p>User logout</p>
            <small>Headers: Authorization: Bearer {token}</small>
        </div>

        <div class="demo-accounts">
            <h3>🔑 Demo Accounts</h3>
            <p><strong>Admin:</strong> admin@tarpprint.com / password123</p>
            <p><strong>Staff:</strong> staff@tarpprint.com / password123</p>
            <p><strong>Customer:</strong> customer@example.com / password123</p>
        </div>

        <h2>🚀 Setup Instructions</h2>
        <ol>
            <li>Make sure XAMPP is running (Apache + MySQL)</li>
            <li>Import the database schema from <code>database/schema.sql</code></li>
            <li>Place this folder in your XAMPP <code>htdocs</code> directory</li>
            <li>Access via <code>http://localhost/php-backend</code></li>
            <li>Your React app should connect to <code>http://localhost/php-backend/api</code></li>
        </ol>

        <div style="text-align: center; margin-top: 30px; color: #6b7280;">
            <p>🔗 Frontend: <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></p>
            <p>📊 phpMyAdmin: <a href="http://localhost/phpmyadmin" target="_blank">http://localhost/phpmyadmin</a></p>
        </div>
    </div>
</body>
</html>