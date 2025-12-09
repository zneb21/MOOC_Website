<?php
// update_comment.php
// Updates rating + comment_text for a comment if it belongs to the given user_id

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

$comment_id   = isset($data['comment_id'])   ? (int)$data['comment_id']   : 0;
$user_id      = isset($data['user_id'])      ? (int)$data['user_id']      : 0;
$rating       = isset($data['rating'])       ? (int)$data['rating']       : 0;
$comment_text = isset($data['comment_text']) ? trim($data['comment_text']) : "";

$errors = [];

if ($comment_id <= 0) {
    $errors[] = "comment_id must be > 0";
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
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Check comment exists and belongs to this user
    $stmt = $pdo->prepare("
        SELECT comment_id, user_id 
        FROM tra_comment 
        WHERE comment_id = :comment_id
        LIMIT 1
    ");
    $stmt->execute([":comment_id" => $comment_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Comment not found"
        ]);
        exit;
    }

    if ((int)$row['user_id'] !== $user_id) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "You are not allowed to edit this comment"
        ]);
        exit;
    }

        // Update rating + text (no updated_at to avoid unknown column error)
        $update = $pdo->prepare("
            UPDATE tra_comment
            SET rating = :rating,
                comment_text = :comment_text
            WHERE comment_id = :comment_id
        ");
        $update->execute([
            ":rating"       => $rating,
            ":comment_text" => $comment_text,
            ":comment_id"   => $comment_id
        ]);


    echo json_encode([
        "success" => true,
        "message" => "Comment updated successfully"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error"   => $e->getMessage()
    ]);
}
