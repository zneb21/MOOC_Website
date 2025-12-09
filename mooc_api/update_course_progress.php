<?php
// C:\xampp\htdocs\mooc_api\update_course_progress.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host    = 'localhost';
$db      = 'my_app_db';
$user    = 'root';
$pass    = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// Read JSON OR form-data
$raw = file_get_contents("php://input");
$json = json_decode($raw, true);

// JSON takes priority, fallback to $_POST
$userId = isset($json['user_id'])
    ? (int)$json['user_id']
    : (isset($_POST['user_id']) ? (int)$_POST['user_id'] : 0);

$courseId = isset($json['course_id'])
    ? (int)$json['course_id']
    : (isset($_POST['course_id']) ? (int)$_POST['course_id'] : 0);

$progress = isset($json['progress'])
    ? (int)$json['progress']
    : (isset($_POST['progress']) ? (int)$_POST['progress'] : 0);

$lessonsFinished = isset($json['lessons_finished'])
    ? (int)$json['lessons_finished']
    : (isset($_POST['lessons_finished']) ? (int)$_POST['lessons_finished'] : 0);


// clamp 0–100 for progress
if ($progress < 0)   $progress = 0;
if ($progress > 100) $progress = 100;
// clamp lessons_finished >= 0
if ($lessonsFinished < 0) $lessonsFinished = 0;

if ($userId <= 0 || $courseId <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid user_id or course_id',
        'raw'     => $raw,
    ]);
    exit;
}

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    $sql = "
        UPDATE tra_user_courses
        SET
            progress = :progress,
            lessons_finished = :lessons_finished
        WHERE user_id = :user_id
          AND enrolled_course = :course_id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':progress'         => $progress,
        ':lessons_finished' => $lessonsFinished,
        ':user_id'          => $userId,
        ':course_id'        => $courseId,
    ]);

    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Enrollment not found for this user and course',
        ]);
        exit;
    }

    echo json_encode([
        'success'          => true,
        'progress'         => $progress,
        'lessons_finished' => $lessonsFinished,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error'   => $e->getMessage(),
    ]);
}
