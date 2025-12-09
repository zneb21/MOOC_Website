<?php
// create_comment.php
// Receives comment data from frontend and saves to tra_comment
// user_name is fetched from users.name based on user_id

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// DB CONFIG
$host     = "localhost";
$dbname   = "my_app_db";
$username = "root";
$password = ""; // default XAMPP

// Read JSON body
$rawInput = file_get_contents("php://input");
$data     = json_decode($rawInput, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON body",
        "raw"     => $rawInput
    ]);
    exit;
}

// Extract with light validation
$content_id   = isset($data['content_id'])   ? (int)$data['content_id']   : 0;
$user_id      = isset($data['user_id'])      ? (int)$data['user_id']      : 0;
$rating       = isset($data['rating'])       ? (int)$data['rating']       : 0;
$comment_text = isset($data['comment_text']) ? trim($data['comment_text']) : "";

$errors = [];

if ($content_id <= 0) {
    $errors[] = "content_id must be > 0";
}
if ($user_id <= 0) {
    $errors[] = "user_id must be > 0";
}
if ($rating < 1 || $rating > 5) {
    $errors[] = "rating must be between 1 and 5";
}
if ($comment_text === "") {
    $errors[] = "comment_text is required";
}
if (strlen($comment_text) > 500) {
    $errors[] = "comment_text must be <= 500 characters";
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "message" => "Validation failed",
        "errors"  => $errors,
        "received" => $data
    ]);
    exit;
}

try {
    // Connect
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // 🔹 Fetch user_name from users table based on user_id
    $stmtUser = $pdo->prepare("SELECT name FROM users WHERE id = :id LIMIT 1");
    $stmtUser->execute([":id" => $user_id]);
    $userRow = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$userRow) {
        // user_id doesn't exist → avoid FK error
        http_response_code(422);
        echo json_encode([
            "success" => false,
            "message" => "Invalid user_id: user not found",
            "user_id" => $user_id
        ]);
        exit;
    }

    $user_name = $userRow["name"];

    // Insert
    $stmt = $pdo->prepare("
        INSERT INTO tra_comment (content_id, user_id, user_name, rating, comment_text)
        VALUES (:content_id, :user_id, :user_name, :rating, :comment_text)
    ");

    $stmt->execute([
        ":content_id"   => $content_id,
        ":user_id"      => $user_id,
        ":user_name"    => $user_name,
        ":rating"       => $rating,
        ":comment_text" => $comment_text
    ]);

    $newId = $pdo->lastInsertId();

    echo json_encode([
        "success"      => true,
        "message"      => "Comment saved successfully",
        "comment_id"   => $newId,
        "created_data" => [
            "content_id"   => $content_id,
            "user_id"      => $user_id,
            "user_name"    => $user_name,
            "rating"       => $rating,
            "comment_text" => $comment_text
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error"   => $e->getMessage()
    ]);
}
