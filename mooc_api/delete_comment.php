<?php
// delete_comment.php
// Deletes a comment if it belongs to the given user_id

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

$comment_id = isset($data['comment_id']) ? (int)$data['comment_id'] : 0;
$user_id    = isset($data['user_id'])    ? (int)$data['user_id']    : 0;

if ($comment_id <= 0 || $user_id <= 0) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "message" => "comment_id and user_id must be > 0",
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
            "message" => "You are not allowed to delete this comment"
        ]);
        exit;
    }

    // Delete
    $del = $pdo->prepare("DELETE FROM tra_comment WHERE comment_id = :comment_id");
    $del->execute([":comment_id" => $comment_id]);

    echo json_encode([
        "success" => true,
        "message" => "Comment deleted successfully"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error"   => $e->getMessage()
    ]);
}
