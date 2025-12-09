<?php
// C:\xampp\htdocs\mooc_api\enroll_course.php

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

// Read JSON body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$userId   = isset($data['user_id'])   ? (int)$data['user_id']   : 0;
$courseId = isset($data['course_id']) ? (int)$data['course_id'] : 0;
$progress = isset($data['progress'])  ? (int)$data['progress']  : 0; // 🆕 0–100


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

    // Check if already enrolled
    $checkSql = "
        SELECT id
        FROM tra_user_courses
        WHERE user_id = :user_id
          AND enrolled_course = :course_id
        LIMIT 1
    ";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([
        ':user_id'   => $userId,
        ':course_id' => $courseId,
    ]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        echo json_encode([
            'success'          => true,
            'already_enrolled' => true,
            'enrollment_id'    => $existing['id'],
        ]);
        exit;
    }

    // 🆕 Compute total lessons for this course
    $totalSql = "
        SELECT COUNT(l.lesson_id) AS total_lessons
        FROM ref_course_content c
        JOIN ref_course_lessons l ON l.content_id = c.content_id
        WHERE c.course_id = :course_id
    ";
    $totalStmt = $pdo->prepare($totalSql);
    $totalStmt->execute([':course_id' => $courseId]);
    $totalRow = $totalStmt->fetch();
    $totalLessons = $totalRow ? (int)$totalRow['total_lessons'] : 0;

    // Insert new enrollment with total_lessons + lessons_finished
    $insertSql = "
        INSERT INTO tra_user_courses (
            user_id,
            enrolled_course,
            enrolled_at,
            status,
            progress,
            total_lessons,
            lessons_finished
        )
        VALUES (
            :user_id,
            :course_id,
            NOW(),
            'enrolled',
            :progress,
            :total_lessons,
            0
        )
    ";
    $insertStmt = $pdo->prepare($insertSql);
    $insertStmt->execute([
        ':user_id'        => $userId,
        ':course_id'      => $courseId,
        ':progress'       => $progress,
        ':total_lessons'  => $totalLessons,
    ]);

    $newId = $pdo->lastInsertId();

    echo json_encode([
        'success'          => true,
        'already_enrolled' => false,
        'enrollment_id'    => $newId,
        'progress'         => $progress,
        'total_lessons'    => $totalLessons,   // 🆕
        'lessons_finished' => 0,               // 🆕
    ]);


} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error'   => $e->getMessage(),
    ]);
}
