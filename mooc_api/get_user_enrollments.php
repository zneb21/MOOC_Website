<?php
// C:\xampp\htdocs\mooc_api\get_user_enrollments.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Headers: Content-Type');

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

// 🔹 read user_id from query string: ?user_id=23
$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
if ($userId <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing or invalid user_id'
    ]);
    exit;
}

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    $ASSETS_BASE = "http://localhost/mooc_assets/";

    $sql = "
        SELECT
            e.id            AS enrollment_id,
            e.user_id,
            e.enrolled_course,
            e.progress AS progress,   
            e.enrolled_at,
            e.status,
            e.course_thumbnail AS enrollment_course_thumbnail,

            c.course_id,
            c.course_title,
            c.course_description,
            c.course_sub_description,
            c.course_price,
            c.course_category,
            c.course_thumbnail,
            c.instructor_id,

            i.instructor_name,
            i.instructor_title
        FROM tra_user_courses AS e
        INNER JOIN ref_courses AS c
            ON e.enrolled_course = c.course_id
        LEFT JOIN ref_instructors AS i
            ON c.instructor_id = i.instructor_id
        WHERE e.user_id = :user_id
        ORDER BY e.enrolled_at DESC
    ";


    $stmt = $pdo->prepare($sql);
    $stmt->execute([':user_id' => $userId]);
    $rows = $stmt->fetchAll();

    // attach thumbnail URL (prefer the enrollment copy, fallback to course)
    foreach ($rows as &$row) {
        $thumb = $row['enrollment_course_thumbnail'] ?: $row['course_thumbnail'];

        if (!empty($thumb)) {
            $row['course_thumbnail_url'] = $ASSETS_BASE . $thumb;
        } else {
            $row['course_thumbnail_url'] = null;
        }
    }
    unset($row);


    echo json_encode([
        'success' => true,
        'data'    => $rows,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error'   => $e->getMessage(),
    ]);
}
