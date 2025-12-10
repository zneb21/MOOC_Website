<?php
// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request (Required for modern browsers/APIs)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Configuration (Update these for your environment) ---
$host = '127.0.0.1'; // e.g., 'localhost'
$db   = 'my_app_db'; 
$user = 'root';      
$pass = '';          // Database password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit();
}

// --- Token Validation (CRUCIAL: Assumes Bearer token = User DB ID) ---
/**
 * Validates the Authorization: Bearer <token> header.
 * @return int|false The user's ID from the DB if valid, or false.
 */
function validateToken($pdo) {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        return false;
    }
    
    // Authorization: Bearer <token>
    list($type, $token) = explode(' ', $headers['Authorization'], 2);

    if (strtolower($type) !== 'bearer' || empty($token)) {
        return false;
    }

    // Treat the token as the numeric user ID
    $user_id = filter_var($token, FILTER_VALIDATE_INT);
    
    if ($user_id !== false && $user_id > 0) {
        // Verify the ID exists in the database
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        if ($stmt->fetch()) {
            return $user_id; // Return the valid DB user ID
        }
    }
    
    return false;
}

// --- Main Logic ---

// 1. Authenticate User
$user_id = validateToken($pdo);

if (!$user_id) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized: Invalid or missing token. Please log in again."]);
    exit();
}

// 2. Get data from request body (frontend sends fullName, avatarId)
$data = json_decode(file_get_contents("php://input"));

$fullName = isset($data->fullName) ? trim($data->fullName) : null;
// avatarId can be a string ('smile') or explicitly null
$avatarId = isset($data->avatarId) ? $data->avatarId : null; 

// 3. Build Update Query
$set_clauses = [];
$params = [];

if (!empty($fullName)) {
    $set_clauses[] = "name = ?";
    $params[] = $fullName;
}

// Handle avatar_id update
if ($avatarId !== null) {
    // If a value is provided (even an empty string), update it
    $set_clauses[] = "avatar_id = ?";
    $params[] = $avatarId; 
} else {
    // If explicitly null is sent, set the DB column to NULL
    $set_clauses[] = "avatar_id = NULL";
}

if (empty($set_clauses)) {
    http_response_code(200);
    echo json_encode(["message" => "No fields to update."]);
    exit();
}

// Construct and execute the SQL
$sql = "UPDATE users SET " . implode(', ', $set_clauses) . " WHERE id = ?";
$params[] = $user_id;

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // 4. Fetch the updated user data to return to the frontend
    // CRITICAL for session persistence: fetch the new data back
    $stmt = $pdo->prepare("SELECT id, name, email, role, avatar_id FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $updatedUser = $stmt->fetch();
    
    if ($updatedUser) {
        http_response_code(200);
        
        // Return JSON response matching the frontend's expected structure
        echo json_encode([
            "message" => "Profile updated successfully.",
            "user" => [
                "id" => $updatedUser['id'],
                "email" => $updatedUser['email'],
                "name" => $updatedUser['name'],
                "role" => $updatedUser['role'],
                "avatarId" => $updatedUser['avatar_id'] // This must be returned
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Update succeeded but failed to fetch user data. Logged out."]);
    }

} catch (\PDOException $e) {
    error_log("Profile update error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Server error updating profile. Database issue."]);
}

?>