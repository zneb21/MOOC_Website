<?php
// get_comments.php
// Returns list of comments for a given content_id

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// DB CONFIG
$host     = "localhost";
$dbname   = "my_app_db";
$username = "root";
$password = "";

// read content_id from query
$content_id = isset($_GET['content_id']) ? (int)$_GET['content_id'] : 0;

if ($content_id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "content_id is required"]);
    exit;
}

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $stmt = $pdo->prepare("
        SELECT comment_id, content_id, user_id, user_name, rating, comment_text, created_at
        FROM tra_comment
        WHERE content_id = :content_id
        ORDER BY created_at DESC, comment_id DESC
    ");
    $stmt->execute([":content_id" => $content_id]);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error"   => $e->getMessage()
    ]);
}
