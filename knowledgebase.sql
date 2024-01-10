-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: knowledgebase
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `author` text,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (1,'example-article','Example Article','<article class=\"container\">\r\n<h2>Example Article</h2>\r\n<div class=\"row\">\r\n<div class=\"col-sm-12\">\r\n<p class=\"fw-bold\">Article Full-Width</p>\r\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mollis velit neque. Quisque fermentum, felis a tempor luctus, quam leo bibendum elit, et ultrices tortor leo a dolor. Maecenas maximus a justo sit amet tincidunt. In finibus nisl ut fringilla sollicitudin. Pellentesque quis eros id diam varius convallis.</p>\r\n<img src=\"http://localhost:8080/api/assets/serve/assets/article-full.jpg\" class=\"img-fluid\"></div>\r\n</div>\r\n<br>\r\n<div class=\"row\">\r\n<div class=\"col-sm-6\">\r\n<p class=\"fw-bold\">Article Left</p>\r\n<p>Integer quam ante, egestas ut gravida sed, vestibulum et mi. Aenean venenatis, quam sit amet volutpat suscipit, risus mi sagittis augue, vel ultricies augue magna mattis justo. Morbi volutpat nunc pellentesque ante fringilla, quis laoreet quam aliquam. Donec massa eros, ornare eu bibendum sed, congue consequat urna.</p>\r\n</div>\r\n<div class=\"col-sm-6\"><img src=\"https://images.unsplash.com/photo-1486218119243-13883505764c\" class=\"img-fluid\"></div>\r\n</div>\r\n<br>\r\n<div class=\"row\">\r\n<div class=\"col-sm-6\"><img src=\"https://images.unsplash.com/photo-1487956382158-bb926046304a\" class=\"img-fluid\"></div>\r\n<div class=\"col-sm-6\">\r\n<p class=\"fw-bold\">Article Right</p>\r\n<p>Nullam scelerisque non purus id vestibulum. Mauris dapibus elit eu ante finibus, a luctus lorem aliquam. Integer accumsan lacus ut aliquet condimentum. Sed aliquet elit turpis, non tempor libero aliquam sed. Pellentesque nisi leo, rhoncus ut sapien non, condimentum cursus mauris.</p>\r\n</div>\r\n</div>\r\n</article>','..\\resources\\portraits\\kbadmin_1704013515861.jpg','2023-12-31 17:37:53','2023-12-31 17:50:09');
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset`
--

DROP TABLE IF EXISTS `asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `filepath` varchar(255) DEFAULT NULL,
  `filetype` varchar(255) DEFAULT NULL,
  `filesize` bigint DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
INSERT INTO `asset` VALUES (1,'sunflower.jpg','..\\resources\\assets\\sunflower.jpg','image/jpeg',219121,'..\\resources\\thumbnails\\sunflower_thumbnail.jpg','2023-12-31 17:37:18','2023-12-31 17:51:52'),(2,'article-full.jpg','..\\resources\\assets\\article-full.jpg','image/jpeg',484510,'..\\resources\\thumbnails\\article-full_thumbnail.jpg','2023-12-31 17:40:45','2023-12-31 17:51:52');
/*!40000 ALTER TABLE `asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `join_article_asset`
--

DROP TABLE IF EXISTS `join_article_asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `join_article_asset` (
  `article_id` int NOT NULL,
  `asset_id` int NOT NULL,
  PRIMARY KEY (`article_id`,`asset_id`),
  KEY `join_article_asset_ibfk_2` (`asset_id`),
  CONSTRAINT `join_article_asset_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`),
  CONSTRAINT `join_article_asset_ibfk_2` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `join_article_asset`
--

LOCK TABLES `join_article_asset` WRITE;
/*!40000 ALTER TABLE `join_article_asset` DISABLE KEYS */;
INSERT INTO `join_article_asset` VALUES (1,1);
/*!40000 ALTER TABLE `join_article_asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `join_article_topic`
--

DROP TABLE IF EXISTS `join_article_topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `join_article_topic` (
  `article_id` int NOT NULL,
  `topic_id` int NOT NULL,
  PRIMARY KEY (`article_id`,`topic_id`),
  KEY `fk_topic` (`topic_id`),
  CONSTRAINT `fk_article` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_topic` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `join_article_topic`
--

LOCK TABLES `join_article_topic` WRITE;
/*!40000 ALTER TABLE `join_article_topic` DISABLE KEYS */;
INSERT INTO `join_article_topic` VALUES (1,1);
/*!40000 ALTER TABLE `join_article_topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `join_user_pinnedarticle`
--

DROP TABLE IF EXISTS `join_user_pinnedarticle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `join_user_pinnedarticle` (
  `user_id` int NOT NULL,
  `article_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`article_id`),
  KEY `article_id` (`article_id`),
  CONSTRAINT `join_user_pinnedarticle_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `join_user_pinnedarticle_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `join_user_pinnedarticle`
--

LOCK TABLES `join_user_pinnedarticle` WRITE;
/*!40000 ALTER TABLE `join_user_pinnedarticle` DISABLE KEYS */;
INSERT INTO `join_user_pinnedarticle` VALUES (1,1);
/*!40000 ALTER TABLE `join_user_pinnedarticle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `icon` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (1,'general-knowledge','General Knowledge',NULL,'fas book-open','2023-11-08 19:43:54','2023-12-31 17:53:27');
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `name` text,
  `department` text,
  `portrait` text,
  `theme` varchar(255) DEFAULT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'kbadmin@email.com','$2a$10$lX.vTtcwfFoJ5AqJZ6rnFeX8KTXhpXcUN864X6VLIHey/FVl7UDQ2','ADMIN','John Doe','Management','..\\resources\\portraits\\kbadmin_1704013515861.jpg','THEMEDEFAULT','2023-12-31 17:05:16','2023-12-31 17:54:11');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-31 17:56:58
