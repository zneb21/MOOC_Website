<?php
require_once('../../config.php');

// --- CRITICAL CHECK: Ensure only POST requests are allowed ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["message" => "Email and password are required."]);
    exit();
}

$email = $data['email'];
$password = $data['password'];

// 1. Retrieve user data by email
$stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    // 2. Verify the hashed password
    if (password_verify($password, $user['password'])) {
        
        $token = generateToken($user['id']);
        
        http_response_code(200);
        echo json_encode([
            "message" => "Login successful.",
            "token" => $token,
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role'],
            ]
        ]);
    } else {
        // Password verification failed
        http_response_code(401);
        echo json_encode(["message" => "Invalid email or password."]);
    }
} else {
    // User not found
    http_response_code(401);
    echo json_encode(["message" => "Invalid email or password."]);
}

$stmt->close();
$conn->close();
?>