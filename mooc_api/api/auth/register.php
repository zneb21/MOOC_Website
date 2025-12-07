<?php
// 1. Debugging: Enable error reporting to see issues in the browser/network tab
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 2. Include Database Config
// NOTE: This assumes your file is in 'htdocs/mooc_api/api/auth/'
// and config.php is in 'htdocs/mooc_api/'
if (file_exists('../../config.php')) {
    require_once('../../config.php');
} else {
    http_response_code(500);
    echo json_encode(["message" => "Server Error: config.php not found."]);
    exit();
}

// 3. Handle CORS Preflight (OPTIONS)
// This handles the browser's "safety check" before sending data
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 4. Validation: Ensure only POST requests are allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed. Use POST."]);
    exit();
}

// 5. Get and Decode JSON Input
$data = json_decode(file_get_contents("php://input"), true);

// 6. Validation: Check for required fields
if (
    empty($data['name']) || 
    empty($data['email']) || 
    empty($data['password']) || 
    empty($data['role'])
) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data. Please fill all fields."]);
    exit();
}

// Assign variables
$name = htmlspecialchars(strip_tags($data['name']));
$email = htmlspecialchars(strip_tags($data['email']));
$role = htmlspecialchars(strip_tags($data['role']));
$password = $data['password']; 

// 7. Validation: Email Format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid email format."]);
    exit();
}

// 8. Security: Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 9. Database Insertion
// Check if the connection variable from config.php is valid
if (!isset($conn)) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection error."]);
    exit();
}

// Prepare SQL statement
$query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);

if ($stmt) {
    // Bind parameters: "ssss" means 4 strings
    $stmt->bind_param("ssss", $name, $email, $hashed_password, $role);

    // Execute query
    if ($stmt->execute()) {
        http_response_code(201); // 201 Created
        echo json_encode([
            "message" => "User registered successfully.",
            "userId" => $conn->insert_id
        ]);
    } else {
        // Handle Errors (e.g., Duplicate Email)
        if ($conn->errno === 1062) {
            http_response_code(409); // 409 Conflict
            echo json_encode(["message" => "This email address is already registered."]);
        } else {
            http_response_code(500);
            echo json_encode([
                "message" => "Database insertion failed.",
                "error" => $stmt->error
            ]);
        }
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to prepare database statement."]);
}

// Close connection
$conn->close();
?>