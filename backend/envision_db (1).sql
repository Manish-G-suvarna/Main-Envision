-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 25, 2026 at 05:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `envision_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `core_team`
--

CREATE TABLE `core_team` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `team_id` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `core_team`
--

INSERT INTO `core_team` (`id`, `name`, `role`, `team_id`, `image_url`, `display_order`, `created_at`) VALUES
(1, 'Arjun Rao', 'Technical Lead', 1, 'https://via.placeholder.com/150', 1, '2026-01-17 07:52:18'),
(2, 'Meera Nair', 'Backend Developer', 1, 'https://via.placeholder.com/150', 2, '2026-01-17 07:52:18'),
(3, 'Karthik Shetty', 'Frontend Developer', 1, 'https://via.placeholder.com/150', 3, '2026-01-17 07:52:18'),
(4, 'Ananya Sharma', 'Design Head', 2, 'https://via.placeholder.com/150', 1, '2026-01-17 07:52:18'),
(5, 'Rohan Patel', 'UI/UX Designer', 2, 'https://via.placeholder.com/150', 2, '2026-01-17 07:52:18'),
(6, 'Sneha Iyer', 'Marketing Lead', 3, 'https://via.placeholder.com/150', 1, '2026-01-17 07:52:18'),
(7, 'Vikram Singh', 'Social Media Strategist', 3, 'https://via.placeholder.com/150', 2, '2026-01-17 07:52:18'),
(8, 'Neha Kulkarni', 'Operations Head', 4, 'https://via.placeholder.com/150', 1, '2026-01-17 07:52:18'),
(9, 'Aditya Verma', 'Logistics Coordinator', 4, 'https://via.placeholder.com/150', 2, '2026-01-17 07:52:18');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `department_name`, `created_at`) VALUES
(1, 'EEE', '2026-01-18 04:47:39'),
(2, 'Marine', '2026-01-18 04:47:39'),
(3, 'E&C', '2026-01-18 04:47:39'),
(4, 'CSBS', '2026-01-18 04:47:39'),
(5, 'CSE(SU)', '2026-01-18 04:47:39'),
(6, 'AIML', '2026-01-18 04:47:39'),
(7, 'Aeronautical', '2026-01-18 04:47:39'),
(8, 'Automobile', '2026-01-18 04:47:39'),
(9, 'Mechanical', '2026-01-18 04:47:39'),
(10, 'CSE(VTU)', '2026-01-18 04:47:39'),
(11, 'AIDS', '2026-01-18 04:47:39'),
(12, 'ISE & CSD', '2026-01-18 04:47:39');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `event_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `fee` decimal(10,2) DEFAULT 0.00,
  `event_type` enum('Technical','Non-Technical') NOT NULL,
  `is_mega_event` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `department_id`, `event_name`, `description`, `fee`, `event_type`, `is_mega_event`, `created_at`) VALUES
(1, 1, 'Freefire', 'A thrilling coding competition testing your algorithmic skills and problem-solving abilities', 100.00, 'Non-Technical', 0, '2026-01-18 04:48:13'),
(2, 2, 'Memoria', 'Build innovative web applications using cutting-edge technologies', 150.00, 'Technical', 0, '2026-01-18 04:48:29'),
(3, 2, 'Knowledge Quest', 'Design and implement efficient algorithms to solve complex problems', 120.00, 'Technical', 0, '2026-01-18 04:48:29'),
(4, 2, 'Nautical Rides', 'Showcase your expertise in data structures and algorithm optimization', 130.00, 'Non-Technical', 0, '2026-01-18 04:48:29'),
(5, 3, 'Circuit Heist', 'Present your innovative ideas and business proposals to industry experts', 80.00, 'Technical', 0, '2026-01-18 04:49:12'),
(6, 3, 'Piece to Picture', 'Test your general knowledge across various domains and win exciting prizes', 50.00, 'Non-Technical', 0, '2026-01-18 04:49:12'),
(7, 4, 'IT Manager', 'Showcase your artistic talents through various creative mediums', 75.00, 'Technical', 0, '2026-01-18 04:50:10'),
(8, 4, 'Click it win it', 'Battle it out in competitive debate rounds on contemporary topics', 60.00, 'Non-Technical', 0, '2026-01-18 04:50:10'),
(9, 5, 'Debug Titans', 'The ultimate coding marathon - 48 hours of innovation, creativity, and problem-solving', 500.00, 'Technical', 1, '2026-01-18 04:51:15'),
(10, 5, 'Spectrum of Style', 'Grand tech fest featuring workshops, competitions, and networking opportunities', 300.00, 'Non-Technical', 1, '2026-01-18 04:51:15'),
(11, 6, 'RAHASYA', NULL, 0.00, 'Technical', 0, '2026-01-18 04:51:34'),
(12, 6, 'SUPER MINUTE', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:51:34'),
(13, 7, 'Water Rocketry', NULL, 0.00, 'Technical', 0, '2026-01-18 04:51:49'),
(14, 7, 'Flight Simulator', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:51:49'),
(15, 8, 'Slow Bike Race', NULL, 0.00, 'Technical', 0, '2026-01-18 04:52:03'),
(16, 8, 'Hogathon', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:52:03'),
(17, 9, 'Treasure Hunt', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:52:24'),
(18, 10, 'Operation CipherChase', NULL, 0.00, 'Technical', 0, '2026-01-18 04:52:40'),
(19, 10, 'Survive Arena (BGMI)', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:52:40'),
(20, 11, 'Blind Coding', NULL, 0.00, 'Technical', 0, '2026-01-18 04:52:53'),
(21, 11, 'Geo Guesser', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:52:53'),
(22, 12, 'Reverse Coding', NULL, 0.00, 'Technical', 0, '2026-01-18 04:54:04'),
(23, 12, 'Dumb Charades', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:54:04');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `team_name`, `created_at`) VALUES
(1, 'Technical', '2026-01-17 07:30:56'),
(2, 'Design', '2026-01-17 07:30:56'),
(3, 'Marketing', '2026-01-17 07:30:56'),
(4, 'Operations', '2026-01-17 07:30:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `core_team`
--
ALTER TABLE `core_team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `department_name` (`department_name`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `core_team`
--
ALTER TABLE `core_team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `core_team`
--
ALTER TABLE `core_team`
  ADD CONSTRAINT `core_team_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
