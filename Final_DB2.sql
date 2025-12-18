-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2025 at 05:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25
SET SESSION sql_require_primary_key = 0;
SET @ORIG_SQL_REQUIRE_PRIMARY_KEY = @@SQL_REQUIRE_PRIMARY_KEY;
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
(61, 25, 'user', 'batchoy', '2025-12-10 20:25:01'),
(62, 25, 'assistant', 'Network Error: Could not connect to the Gemini server endpoint.', '2025-12-10 20:25:03'),
(63, 25, 'user', 'hallo', '2025-12-10 20:25:47'),
(64, 25, 'assistant', 'Hello! Maayong adlaw! Welcome to our Hiligaynon lesson. How can I help you today?', '2025-12-10 20:25:52');

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
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
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
  `course_objectives` text DEFAULT NULL,
  `course_price` decimal(10,2) NOT NULL,
  `instructor_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `course_category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ref_courses`
--

INSERT INTO `ref_courses` (`course_id`, `course_title`, `course_thumbnail`, `course_description`, `course_sub_description`, `course_objectives`, `course_price`, `instructor_id`, `created_at`, `course_category`) VALUES
(1, 'Iloilo Uncovered: Tourism, Culture, and Local Experiences', 'courses/tourism.jpg', 'Explore Iloilo’s rich cultural heritage, historical landmarks, and popular tourist destinations while understanding their role in local tourism.', 'Discover Iloilo’s cultural heritage, historical landmarks, and popular tourist destinations in this introductory course.', 'Identify Iloilo’s major tourist destinations festivals and heritage sites., Explain the historical and cultural significance of Iloilo’s tourism attractions., Recognize sustainable tourism practices relevant to Iloilo’s local communities., Develop basic knowledge for planning a cultural or educational visit to Iloilo.', 300.00, 1, '2025-12-06 06:54:42', 'Tourism'),
(2, 'Introduction to Ilonggo Cuisine', 'courses/cuisine.webp', 'An introductory course exploring the history, ingredients, and traditional dishes that define Ilonggo cuisine and its cultural significance in Iloilo.', 'An introduction to the flavors, ingredients, and traditional dishes that define Ilonggo cuisine.', 'Identify the key ingredients commonly used in traditional Ilonggo dishes, Describe the cultural and historical influences behind Ilonggo cuisine, Recognize popular Ilonggo dishes and their unique flavors, Explain basic cooking methods and food traditions practiced in Iloilo.', 250.00, 2, '2025-12-06 07:25:05', 'Cooking'),
(3, 'Voices of Iloilo: Learning the Hiligaynon Language', 'courses/Language.jpg', 'Designed for beginners, this course teaches the fundamentals of the Ilonggo language through practical conversations, pronunciation practice, and common phrases used in daily life in Iloilo.', 'Learn the basics of the Hiligaynon language through simple conversations and everyday expressions used in Iloilo', 'Understand basic Hiligaynon words and expressions used in daily conversations., Speak simple sentences with proper pronunciation and tone., Recognize common cultural expressions and respectful language use., Communicate basic needs and responses in everyday situations.', 250.00, 3, '2025-12-06 07:25:05', 'Language'),
(4, 'Iloilo Through the Ages', 'courses/History.jpg', 'This course explores the historical development of Iloilo from its precolonial beginnings through the Spanish period and into its role in modern Philippine society.', 'Learn how Iloilo’s past shaped its culture economy and identity.', 'Understand the key historical periods that shaped Iloilo., Identify important events and figures in Iloilo’s history., Explain the influence of colonization on Iloilo’s culture and society., Appreciate the role of Iloilo in the development of the Philippines.', 250.00, 4, '2025-12-06 07:25:05', 'History');

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
(1, 2, 1, 'How to Cook Laswa (ILONGGO DISH)', 5, '5:45', '2025-12-07 12:33:28', '2025-12-16 00:53:10'),
(2, 2, 2, 'Illongo\'s Best Special Lapaz Batchoy // Lapaz Batchoy Recipe', 1, '19:21', '2025-12-16 00:52:24', '2025-12-16 00:52:52'),
(3, 2, 3, 'The Best Pancit Molo Recipe', 1, '15:155', '2025-12-16 00:54:56', '2025-12-16 00:54:56'),
(4, 2, 4, 'Silvanas: Cashew-Meringue Wafers with French Buttercream ', 1, '13:44', '2025-12-16 00:54:56', '2025-12-16 00:54:56'),
(5, 2, 4, 'Chicken BInakol | Binakoe na Manok', 1, '4:21', '2025-12-16 00:54:56', '2025-12-16 00:54:56'),
(6, 1, 1, '\r\nThe Most Beautiful Places in Iloilo You NEED to See!', 1, '17:17', '2025-12-16 00:54:56', '2025-12-16 01:18:43'),
(7, 3, 1, 'Basic Greetings in Hiligaynon || LEARN HILIGAYNON', 1, '2:07', '2025-12-16 00:54:56', '2025-12-16 01:18:43'),
(8, 3, 1, 'Common Hiligaynon Phrases, Greetings and Small Talk', 1, '20:24', '2025-12-16 00:54:56', '2025-12-16 01:18:43'),
(9, 3, 1, 'How to Greet Someone in Hiligaynon', 1, '11:07', '2025-12-16 00:54:56', '2025-12-16 01:18:43'),
(10, 3, 1, 'Peace Corps Ilonggo (Hiligaynon) Language Packet', 1, '3:58', '2025-12-16 00:54:56', '2025-12-16 01:42:10'),
(11, 4, 1, 'Iloilo History: The Firsts of Iloilo ', 1, '12:53', '2025-12-16 00:54:56', '2025-12-16 01:42:10');

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
(1, 1, 'How to Cook Laswa (ILONGGO DISH) | Easy Way of Cooking | Simple Laswa Recipe', '5:45', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 00:48:39', 'lessons/1/1/HowToCookLaswa.mp4'),
(2, 2, 'ILONGGO\'S BEST SPECIAL LAPAZ BATCHOY / LAPAZ BATCHOY RECIPE@chefangelkitchen', '5:45', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 00:59:39', 'lessons/1/1/LapazBatchoy.mp4'),
(4, 3, 'The Best Pancit Molo Recipe | Filipino Wonton Soup', '15:55', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 01:01:39', 'lessons/1/1/PancitMolo.mp4'),
(5, 4, 'Silvanas: Cashew-Meringue Wafers with French Buttercream - Sans Rival Cookies | Cooking with Kurt', '13:44', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 01:07:35', 'lessons/1/1/Meringue.mp4'),
(6, 5, 'Chicken BInakol | Binakoe na Manok', '4:21', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 01:08:26', 'lessons/1/1/ChickenBinakol.mp4'),
(7, 6, 'The Most Beautiful Places in Iloilo You Need to See!', '17:17', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 01:08:26', 'lessons/1/1/BeautifulIloilo.mp4'),
(8, 7, 'Basic Greetings in Hiligaynon || LEARN HILIGAYNON', '2:07', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 01:08:26', 'lessons/1/1/LearnHiligaynon.mp4'),
(9, 8, 'Common Hiligaynon Phrases, Greetings and Small Talk', '20:24', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 01:08:26', 'lessons/1/1/TalkIllongo.mp4'),
(10, 9, 'How to Greet Someone in Hiligaynon ', '11:07', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 01:38:28', 'lessons/1/1/GreetIllongo.mp4'),
(11, 10, 'Peace Corps Ilonggo (Hiligaynon) Language Packet', '3:58', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 01:41:57', 'lessons/1/1/PeaceCorpsIllongo.mp4'),
(12, 11, 'Iloilo History: The Firsts of Iloilo ', '12:53', 'video', 0, '2025-12-07 12:56:50', '2025-12-16 01:41:57', 'lessons/1/1/IloiloHistory.mp4');

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
(1, 'Zneb John Delariman', 'Researcher', 'Demonstrates strong collaboration, adaptability, and problem-solving skills with expertise in Python and web development.', 'instructors/zneb.png'),
(2, 'Jake S. Occeña', 'Researcher', 'Adaptable and collaborative, with a process-driven mindset, strong analytical skills, and expertise in backend development.', 'instructors/jake.png'),
(3, 'Carlos John Aristoki', 'Researcher', 'Demonstrates strong collaboration, adaptability, and problem-solving skills with expertise in Python and web development.', 'instructors/carlos.png'),
(4, 'Om Shanti Limpin', 'Researcher', 'Collaborative and adaptable, with expertise in front-end architecture, React.js development, and version control using Git/GitHub.', 'instructors/om.png');

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
(5, 23, 2, '2025-12-09 10:55:32', 'enrolled', NULL, 100, 0, 4),
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
  `avatar_id` varchar(50) DEFAULT 'default',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar_id`, `created_at`) VALUES
(20, 'asasasas', 'jakeoccena@yahoo.com', '$2y$10$HNOXU0wVZFD7Upms4XXlBe7FbhC96CSKQAX.XQ3N5Ca1EYJPsWNF.', 'learner', 'default', '2025-12-09 06:55:27'),
(21, 'dsdsd', 'agtotojhomr@gmail.com', '$2y$10$ErjEyL2B7O3qVW9ud9A9lecs2qIzQgXTSGNciYIyniHVdA9ErIvju', 'learner', 'default', '2025-12-09 07:12:06'),
(23, 'Jake Occeña', 'jake.occena@wvsu.edu.ph', '$2y$10$CE80s9RpDoycfCYqprlTnedgnOzW0sWF2kd0Bn0HCbOkEBP//rqc2', 'learner', 'default', '2025-12-09 07:51:51'),
(24, '2wi43ufhwer', 'rjrmarketingiloilo@gmail.com', '$2y$10$6h5sDJA4vfetP3wkUR9DHOmfTw3kkQF7PFV9VfHgYBGDad6UV.oZW', 'learner', 'default', '2025-12-09 11:33:18'),
(25, 'Lilmisty', 'ckaristoki@gmail.com', '$2y$10$cO8ZUHannqSMPlagQDfVp.rQvcpn6ibxwZetAIXL56QCO3s8cKDgK', 'learner', 'zap', '2025-12-11 04:08:18'),
(27, 'Mist', 'glass418cloudy@gmail.com', '$2y$10$Ld/qvBq7ZGRjfnMVhQ/s8uk33VlAVkWlQO0Sk0uMEeGM3Ip6Cfjwu', 'learner', 'default', '2025-12-11 20:58:34'),
(28, 'halloworld', 'ckaristoki@outlook.com', '$2y$10$o3pxkKk9ZPHdMIbkOBuXOuc2TVF1eydgTkftqNvbW8uxhQn7C6Yjq', 'learner', 'default', '2025-12-12 21:12:26'),
(29, 'mist21', 'carlosjohn.aristoki@gmail.com', '$2y$10$obpJrnt8C9O/lMb.eOXyyO3St5RnZ/6m/gPkfp.AZD5QFkOu29bGy', 'learner', 'coffee', '2025-12-12 16:49:55');

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
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

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
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `progress`
--
ALTER TABLE `progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ref_courses`
--
ALTER TABLE `ref_courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ref_course_content`
--
ALTER TABLE `ref_course_content`
  MODIFY `content_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `ref_course_lessons`
--
ALTER TABLE `ref_course_lessons`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `ref_instructors`
--
ALTER TABLE `ref_instructors`
  MODIFY `instructor_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tra_comment`
--
ALTER TABLE `tra_comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `tra_user_courses`
--
ALTER TABLE `tra_user_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
