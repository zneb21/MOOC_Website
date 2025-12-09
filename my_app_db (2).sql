-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2025 at 04:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my_app_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_history`
--

CREATE TABLE `chat_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('user','assistant') NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_history`
--

INSERT INTO `chat_history` (`id`, `user_id`, `role`, `message`, `created_at`) VALUES
(3, 9, 'user', 'hello', '2025-12-08 17:21:31'),
(4, 9, 'assistant', 'Hello! Welcome to our lesson about Iloilo. How can I help you today?', '2025-12-08 17:21:36'),
(5, 9, 'user', 'hello', '2025-12-08 17:35:19'),
(6, 9, 'assistant', 'Hello there! Welcome again to our lesson about Iloilo.\n\nIs there anything you\'d like to know or explore about Iloilo right now? We can talk about its famous **La Paz Batchoy**, beautiful **old churches**, or even just the meaning of \"Iloilo\"!', '2025-12-08 17:35:24');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `instructor` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `downloadable` varchar(255) DEFAULT NULL,
  `module_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `progress`
--

CREATE TABLE `progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `progress_percent` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ref_courses`
--

CREATE TABLE `ref_courses` (
  `course_id` int(11) NOT NULL,
  `course_title` varchar(255) NOT NULL,
  `course_thumbnail` varchar(500) NOT NULL,
  `course_description` text DEFAULT NULL,
  `course_sub_description` text DEFAULT NULL,
  `course_price` decimal(10,2) NOT NULL,
  `instructor_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `course_category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ref_courses`
--

INSERT INTO `ref_courses` (`course_id`, `course_title`, `course_thumbnail`, `course_description`, `course_sub_description`, `course_price`, `instructor_id`, `created_at`, `course_category`) VALUES
(1, 'amazing', 'courses/Amazing.jpg', 'Embark on a comprehensive journey through Iloilo\'s rich cultural tapestry. This course covers everything from historic churches to vibrant festivals, local cuisine hotspots, and off-the-beaten-path destinations that make Iloilo truly special.', 'Explore the rich heritage and hidden gems of Iloilo City', 1499.00, 1, '2025-12-06 06:54:42', 'Cooking'),
(2, 'Buli ni james', 'courses/2.png', 'basta buli ni james ah paldo gid ya guys', 'BULI GNI NI JAMES', 6969.00, 2, '2025-12-06 07:25:05', 'Agriculture');

-- --------------------------------------------------------

--
-- Table structure for table `ref_course_content`
--

CREATE TABLE `ref_course_content` (
  `content_id` int(11) NOT NULL,
  `course_conn_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `course_content_title` varchar(255) NOT NULL,
  `course_content_lessons` int(11) DEFAULT 0,
  `course_content_length` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ref_course_content`
--

INSERT INTO `ref_course_content` (`content_id`, `course_conn_id`, `course_id`, `course_content_title`, `course_content_lessons`, `course_content_length`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'TestTest', 5, '1h 30m', '2025-12-07 12:33:28', '2025-12-08 21:29:41');

-- --------------------------------------------------------

--
-- Table structure for table `ref_course_lessons`
--

CREATE TABLE `ref_course_lessons` (
  `lesson_id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `lesson_title` varchar(255) NOT NULL,
  `lesson_duration` varchar(50) DEFAULT NULL,
  `lesson_type` enum('video','reading','quiz') NOT NULL,
  `progress` int(3) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lesson_directory` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ref_course_lessons`
--

INSERT INTO `ref_course_lessons` (`lesson_id`, `content_id`, `lesson_title`, `lesson_duration`, `lesson_type`, `progress`, `created_at`, `updated_at`, `lesson_directory`) VALUES
(1, 1, 'XDXD', '12:00', 'video', 0, '2025-12-07 12:56:50', '2025-12-08 21:06:05', 'lessons/1/1/1.mp4'),
(2, 1, 'Buli ni James 2.0 video scandal', '30:00', 'video', 0, '2025-12-07 13:04:23', '2025-12-07 22:14:39', 'lessons/1/1/2.mp4');

-- --------------------------------------------------------

--
-- Table structure for table `ref_instructors`
--

CREATE TABLE `ref_instructors` (
  `instructor_id` int(10) UNSIGNED NOT NULL,
  `instructor_name` varchar(255) NOT NULL,
  `instructor_title` varchar(255) DEFAULT NULL,
  `instructor_bio` text DEFAULT NULL,
  `instructor_image_path` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ref_instructors`
--

INSERT INTO `ref_instructors` (`instructor_id`, `instructor_name`, `instructor_title`, `instructor_bio`, `instructor_image_path`) VALUES
(1, 'Maria Santos', 'Tourism Expert', 'Maria is a certified tour guide with 15 years of experience showcasing Iloilo\'s heritage to visitors worldwide.', NULL),
(2, 'James Squared', 'WIUJFHIEWUF', 'wegfkjwefnowergpkomiwegf', 'instructors/2.png');

-- --------------------------------------------------------

--
-- Table structure for table `tra_comment`
--

CREATE TABLE `tra_comment` (
  `comment_id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `comment_text` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tra_comment`
--

INSERT INTO `tra_comment` (`comment_id`, `content_id`, `user_id`, `user_name`, `rating`, `comment_text`, `created_at`) VALUES
(19, 2, 23, 'Jake Occeña', 5, 'Paldo guys first comment of the year sheesh', '2025-12-09 00:12:53'),
(20, 2, 23, 'Jake Occeña', 5, 'asasasasa', '2025-12-09 00:47:25'),
(22, 1, 23, 'Jake Occeña', 3, 'asasas', '2025-12-09 00:52:13'),
(23, 2, 21, 'dsdsd', 5, 'eyeyeyeye', '2025-12-09 01:15:56'),
(24, 1, 24, '2wi43ufhwer', 5, 'asaas', '2025-12-09 03:38:46');

-- --------------------------------------------------------

--
-- Table structure for table `tra_user_courses`
--

CREATE TABLE `tra_user_courses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `enrolled_course` int(11) NOT NULL,
  `enrolled_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('enrolled','in_progress','completed') NOT NULL DEFAULT 'enrolled',
  `course_thumbnail` varchar(255) DEFAULT NULL,
  `progress` tinyint(3) UNSIGNED DEFAULT NULL,
  `total_lessons` int(11) NOT NULL DEFAULT 0,
  `lessons_finished` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tra_user_courses`
--

INSERT INTO `tra_user_courses` (`id`, `user_id`, `enrolled_course`, `enrolled_at`, `status`, `course_thumbnail`, `progress`, `total_lessons`, `lessons_finished`) VALUES
(5, 23, 2, '2025-12-09 10:55:32', 'enrolled', NULL, 50, 0, 1),
(6, 23, 1, '2025-12-09 10:55:37', 'enrolled', NULL, 0, 2, 0),
(7, 24, 1, '2025-12-09 11:37:40', 'enrolled', NULL, 0, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('learner','instructor') NOT NULL DEFAULT 'learner',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(9, 'mist', 'glass418cloudy@gmail.com', '$2y$10$7A3U.m686.6qdeub6thU8O8NiSG6MSSRHPf3.JXtWoXT4XgizaLPu', 'learner', '2025-12-07 20:40:37'),
(18, 'nigga doe', 'ckaristoki@gmail.com', '$2y$10$uHlc5raOpHcboFE/pKNhkuBBrn.dBHmBzehTNI8gm7v0kZqub2onm', 'learner', '2025-12-08 14:33:19'),
(19, 'nigga doe', 'ckaristoki@outlook.com', '$2y$10$7JRoDx9hzOWjNI.yj1SBZuB1AuxCmdEtYjtQcfXf8f54EdGmZJF8O', 'learner', '2025-12-08 15:54:05'),
(20, 'asasasas', 'jakeoccena@yahoo.com', '$2y$10$HNOXU0wVZFD7Upms4XXlBe7FbhC96CSKQAX.XQ3N5Ca1EYJPsWNF.', 'learner', '2025-12-08 22:55:27'),
(21, 'dsdsd', 'agtotojhomr@gmail.com', '$2y$10$ErjEyL2B7O3qVW9ud9A9lecs2qIzQgXTSGNciYIyniHVdA9ErIvju', 'learner', '2025-12-08 23:12:06'),
(23, 'Jake Occeña', 'jake.occena@wvsu.edu.ph', '$2y$10$CE80s9RpDoycfCYqprlTnedgnOzW0sWF2kd0Bn0HCbOkEBP//rqc2', 'learner', '2025-12-08 23:51:51'),
(24, '2wi43ufhwer', 'rjrmarketingiloilo@gmail.com', '$2y$10$6h5sDJA4vfetP3wkUR9DHOmfTw3kkQF7PFV9VfHgYBGDad6UV.oZW', 'learner', '2025-12-09 03:33:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_history`
--
ALTER TABLE `chat_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `progress`
--
ALTER TABLE `progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `module_id` (`module_id`);

--
-- Indexes for table `ref_courses`
--
ALTER TABLE `ref_courses`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `fk_courses_instructor` (`instructor_id`);

--
-- Indexes for table `ref_course_content`
--
ALTER TABLE `ref_course_content`
  ADD PRIMARY KEY (`content_id`),
  ADD KEY `fk_course_content_course` (`course_conn_id`);

--
-- Indexes for table `ref_course_lessons`
--
ALTER TABLE `ref_course_lessons`
  ADD PRIMARY KEY (`lesson_id`),
  ADD KEY `fk_course_lesson_content` (`content_id`);

--
-- Indexes for table `ref_instructors`
--
ALTER TABLE `ref_instructors`
  ADD PRIMARY KEY (`instructor_id`);

--
-- Indexes for table `tra_comment`
--
ALTER TABLE `tra_comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `fk_comment_user` (`user_id`);

--
-- Indexes for table `tra_user_courses`
--
ALTER TABLE `tra_user_courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_course` (`user_id`,`enrolled_course`),
  ADD KEY `fk_tuc_course` (`enrolled_course`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_history`
--
ALTER TABLE `chat_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `progress`
--
ALTER TABLE `progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ref_courses`
--
ALTER TABLE `ref_courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ref_course_content`
--
ALTER TABLE `ref_course_content`
  MODIFY `content_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ref_course_lessons`
--
ALTER TABLE `ref_course_lessons`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ref_instructors`
--
ALTER TABLE `ref_instructors`
  MODIFY `instructor_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tra_comment`
--
ALTER TABLE `tra_comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `tra_user_courses`
--
ALTER TABLE `tra_user_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_history`
--
ALTER TABLE `chat_history`
  ADD CONSTRAINT `chat_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `progress`
--
ALTER TABLE `progress`
  ADD CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `progress_ibfk_3` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ref_courses`
--
ALTER TABLE `ref_courses`
  ADD CONSTRAINT `fk_courses_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `ref_instructors` (`instructor_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `ref_course_content`
--
ALTER TABLE `ref_course_content`
  ADD CONSTRAINT `fk_course_content_course` FOREIGN KEY (`course_conn_id`) REFERENCES `ref_courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ref_course_lessons`
--
ALTER TABLE `ref_course_lessons`
  ADD CONSTRAINT `fk_course_lesson_content` FOREIGN KEY (`content_id`) REFERENCES `ref_course_content` (`content_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tra_comment`
--
ALTER TABLE `tra_comment`
  ADD CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tra_user_courses`
--
ALTER TABLE `tra_user_courses`
  ADD CONSTRAINT `fk_tuc_course` FOREIGN KEY (`enrolled_course`) REFERENCES `ref_courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tuc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
