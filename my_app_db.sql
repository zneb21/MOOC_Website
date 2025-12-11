-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2025 at 11:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('learner','instructor') NOT NULL DEFAULT 'learner',
  `avatar_id` varchar(50) DEFAULT 'default',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar_id`, `created_at`) VALUES
(9, 'LilMisty', 'glass418cloudy@gmail.com', '$2b$12$G4BzNYq0RSy/35S6VJbkJeYu2Q2N9uT/z8828bHcZkvstivRb1b0.', 'learner', 'zap', '2025-12-07 20:40:37'),
(19, 'nigga doe', 'ckaristoki@outlook.com', '$2y$10$7JRoDx9hzOWjNI.yj1SBZuB1AuxCmdEtYjtQcfXf8f54EdGmZJF8O', 'learner', 'default', '2025-12-08 15:54:05'),
(20, 'asasasas', 'jakeoccena@yahoo.com', '$2y$10$HNOXU0wVZFD7Upms4XXlBe7FbhC96CSKQAX.XQ3N5Ca1EYJPsWNF.', 'learner', 'default', '2025-12-08 22:55:27'),
(21, 'dsdsd', 'agtotojhomr@gmail.com', '$2y$10$ErjEyL2B7O3qVW9ud9A9lecs2qIzQgXTSGNciYIyniHVdA9ErIvju', 'learner', 'default', '2025-12-08 23:12:06'),
(23, 'Jake Occeña', 'jake.occena@wvsu.edu.ph', '$2y$10$CE80s9RpDoycfCYqprlTnedgnOzW0sWF2kd0Bn0HCbOkEBP//rqc2', 'learner', 'default', '2025-12-08 23:51:51'),
(24, '2wi43ufhwer', 'rjrmarketingiloilo@gmail.com', '$2y$10$6h5sDJA4vfetP3wkUR9DHOmfTw3kkQF7PFV9VfHgYBGDad6UV.oZW', 'learner', 'default', '2025-12-09 03:33:18'),
(25, 'Lilmisty', 'ckaristoki@gmail.com', '$2y$10$cO8ZUHannqSMPlagQDfVp.rQvcpn6ibxwZetAIXL56QCO3s8cKDgK', 'learner', 'zap', '2025-12-10 20:08:18');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
