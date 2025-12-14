<?php
// 1. Debugging: Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 2. Include Database Config
// Adjust path if your folder structure differs
if (file_exists('../../config.php')) {
    require_once('../../config.php');
} else {
    http_response_code(500);
    echo json_encode(["message" => "Server Error: config.php not found."]);
    exit();
}

// 3. Handle CORS Preflight (OPTIONS)
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

// Assign variables and sanitize
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

// 8. Validation: Password Length
$MIN_PASSWORD_LENGTH = 6;
if (strlen($password) < $MIN_PASSWORD_LENGTH) {
    http_response_code(400);
    echo json_encode(["message" => "Password must be at least {$MIN_PASSWORD_LENGTH} characters long."]);
    exit();
}

// Check database connection
if (!isset($conn)) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection error."]);
    exit();
}

// 9. CHECK IF EMAIL ALREADY EXISTS
// This prevents duplicates and returns the correct 409 error
$check_query = "SELECT id FROM users WHERE email = ?";
$check_stmt = $conn->prepare($check_query);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows > 0) {
    http_response_code(409); // 409 Conflict
    echo json_encode(["message" => "This email address is already registered."]);
    $check_stmt->close();
    exit();
}
$check_stmt->close();

// 10. Security: Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 11. Database Insertion
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
        // Fallback check for MySQL duplicate error (1062) just in case
        if ($conn->errno === 1062) {
            http_response_code(409); 
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