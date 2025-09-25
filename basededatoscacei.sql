-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: caceiv2_db
-- ------------------------------------------------------
-- Server version	8.4.5

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
-- Table structure for table `convocatorias`
--

DROP TABLE IF EXISTS `convocatorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convocatorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `fecha_limite` datetime NOT NULL,
  `pasantias_disponibles` json NOT NULL COMMENT 'Array JSON con las pasantías disponibles (máximo 5)',
  `profesores_disponibles` json NOT NULL COMMENT 'Array JSON con la lista de profesores disponibles al momento de crear la convocatoria',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `idx_convocatorias_active` (`active`),
  KEY `idx_convocatorias_fecha_limite` (`fecha_limite`),
  KEY `idx_convocatorias_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convocatorias`
--

LOCK TABLES `convocatorias` WRITE;
/*!40000 ALTER TABLE `convocatorias` DISABLE KEYS */;
INSERT INTO `convocatorias` VALUES (2,'f9fc93aa-be2e-4ec5-a12b-8d2d951a9429','Periodo test enero-abril 2026',NULL,'2025-09-25 18:00:00','[\"Estancia II\", \"Estadía\", \"Estadía 1\"]','[{\"id\": 13, \"email\": \"ana.perez@upchiapas.edu.mx\", \"nombre\": \"Ana Pérez Morales\"}, {\"id\": 10, \"email\": \"carlos.mendoza@upchiapas.edu.mx\", \"nombre\": \"Carlos Mendoza García\"}, {\"id\": 6, \"email\": \"director-test@upchiapas.edu.mx\", \"nombre\": \"Director directorApellido1 directorApellido2\"}, {\"id\": 12, \"email\": \"jose.hernandez@upchiapas.edu.mx\", \"nombre\": \"José Hernández Ruiz\"}, {\"id\": 11, \"email\": \"maria.gonzalez@upchiapas.edu.mx\", \"nombre\": \"María González López\"}, {\"id\": 8, \"email\": \"ptc@upchiapas.edu.mx\", \"nombre\": \"Profesor Tiempo Completo\"}, {\"id\": 14, \"email\": \"roberto.jimenez@upchiapas.edu.mx\", \"nombre\": \"Roberto Jiménez Torres\"}]',1,'2025-09-22 15:14:06','2025-09-23 11:27:05',NULL,NULL);
/*!40000 ALTER TABLE `convocatorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_submenu`
--

DROP TABLE IF EXISTS `menu_submenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_submenu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `id_menu` int NOT NULL,
  `id_submenu` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `id_menu` (`id_menu`),
  KEY `id_submenu` (`id_submenu`),
  CONSTRAINT `menu_submenu_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `menus` (`id`),
  CONSTRAINT `menu_submenu_ibfk_2` FOREIGN KEY (`id_submenu`) REFERENCES `submenus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_submenu`
--

LOCK TABLES `menu_submenu` WRITE;
/*!40000 ALTER TABLE `menu_submenu` DISABLE KEYS */;
INSERT INTO `menu_submenu` VALUES (9,'68217f8e-fa4d-4ee6-ac39-25cee3dd0067',17,10,'2025-06-28 03:57:33','2025-06-28 03:57:33',NULL,NULL),(10,'7b604ffe-31a8-4000-acbc-df2ee13287d7',18,11,'2025-07-17 00:45:25','2025-07-17 00:45:25',NULL,NULL),(11,'5ecd595b-2a4f-44d7-ab20-7801fb972e7a',18,12,'2025-07-17 00:46:39','2025-07-17 00:46:39',NULL,NULL),(15,'a1dd4554-487b-4a56-bf8c-477442ac8458',23,16,'2025-07-19 01:30:03','2025-07-19 01:30:03',NULL,NULL),(16,'fa0c0467-09db-49b6-9a1d-f035f0cec865',23,17,'2025-07-19 01:31:32','2025-07-19 01:31:32',NULL,NULL),(17,'5b13023e-cdca-4549-aafa-ca7ea7adef64',17,18,'2025-07-19 01:49:06','2025-07-19 01:49:06',NULL,NULL);
/*!40000 ALTER TABLE `menu_submenu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `path` varchar(100) DEFAULT NULL,
  `sort_order` int NOT NULL,
  `is_navegable` tinyint(1) DEFAULT '1' COMMENT 'Si el menú es navegable directamente o solo organizacional',
  `component_name` varchar(100) DEFAULT NULL COMMENT 'Nombre del componente React (PascalCase). NULL si es organizacional',
  `feature_name` varchar(100) DEFAULT NULL COMMENT 'Nombre de la carpeta del feature (kebab-case)',
  `active` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `idx_menus_navegable` (`is_navegable`),
  KEY `idx_menus_component_name` (`component_name`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (17,'dd9a8941-b672-48ed-a1da-4d57fb2c5315','Estancias y Estadias','Sección para estancias y estadias','<LuChartArea />','/estancias-estadias',1,0,NULL,'estancias-estadias',1,0,'2025-06-28 03:56:50','2025-07-19 01:55:43',NULL,NULL),(18,'848925b3-3994-4790-8b21-6326f23f63dd','Usuarios','Módulo para gestionar usuarios','<LuUsers />','/usuarios',2,0,NULL,'testing-ahora',1,0,'2025-07-17 00:44:08','2025-07-19 01:19:53',NULL,NULL),(19,'a0a24401-f0ab-4e34-a12d-32f1add769f0','Navegación','Módulo para gestionar menus y submenus','<LuSettings />','/navegacion',3,1,'NavigationSettings','navigation-settings',1,0,'2025-07-17 18:13:54','2025-07-17 21:26:18',NULL,NULL),(20,'78f7b816-83a8-4498-a4ad-746f901495ba','Roles','Módulo para el manejo de Roles','<LuWalletCards />','/roles',4,1,'Roles','roles',1,0,'2025-07-17 18:38:33','2025-07-18 00:08:12',NULL,NULL),(22,'82b3f480-73ee-4787-afb7-4a1fa45903d9','Yael','testing yael','<LuUsers />','/testing-yael',5,1,'TestingYael','testing-yael',1,0,'2025-07-19 01:20:36','2025-07-19 01:22:57',NULL,NULL),(23,'cf9f14e6-c1a8-41fa-a0a1-c126719d5388','Propuestas','Gestiona las propuestas de estancia','<LuBook />','/mis-propuestas',6,0,NULL,'alumnos-propuestas',1,0,'2025-07-19 01:28:57','2025-07-19 01:28:57',NULL,NULL),(24,'bdd874f2-0c1c-4cd9-970d-f5b132d385f8','Visualizar Propuestas','Visualizar Propuestas - PTC','<LuBookCopy />','/propuestas',7,1,'VisualizarPropuestas','ptc-propuestas',1,0,'2025-07-19 01:41:47','2025-07-19 01:54:20',NULL,NULL);
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_proposals`
--

DROP TABLE IF EXISTS `project_proposals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_proposals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `convocatoria_id` int NOT NULL COMMENT 'FK to convocatorias table',
  `student_id` int NOT NULL COMMENT 'FK to users table - student who creates the proposal',
  `student_name` varchar(255) NOT NULL COMMENT 'Nombre completo del estudiante',
  `student_email` varchar(255) NOT NULL COMMENT 'Email del estudiante',
  `academic_tutor_id` int NOT NULL COMMENT 'FK to users table - tutor académico (subsección)',
  `academic_tutor_name` varchar(255) NOT NULL COMMENT 'Academic tutor name at registration time',
  `academic_tutor_email` varchar(255) NOT NULL COMMENT 'Academic tutor email at registration time',
  `internship_type` varchar(50) NOT NULL COMMENT 'Pasantía a realizar (subsección)',
  `company_short_name` varchar(100) DEFAULT NULL COMMENT 'Nombre corto (subsección) - OPCIONAL',
  `company_legal_name` varchar(255) NOT NULL COMMENT 'Nombre legal (subsección)',
  `company_tax_id` varchar(13) NOT NULL COMMENT 'RFC - Registro Federal de Contribuyentes (subsección)',
  `company_state` varchar(100) NOT NULL COMMENT 'Entidad federativa (subsección)',
  `company_municipality` varchar(100) NOT NULL COMMENT 'Demarcación territorial (subsección)',
  `company_settlement_type` varchar(50) NOT NULL COMMENT 'Tipo de asentamiento humano (subsección)',
  `company_settlement_name` varchar(100) NOT NULL COMMENT 'Nombre del asentamiento humano (subsección)',
  `company_street_type` varchar(50) NOT NULL COMMENT 'Vialidad (subsección)',
  `company_street_name` varchar(100) NOT NULL COMMENT 'Nombre de la vía (subsección)',
  `company_exterior_number` varchar(10) NOT NULL COMMENT 'Número exterior (subsección)',
  `company_interior_number` varchar(10) DEFAULT NULL COMMENT 'Número interior (subsección) - OPCIONAL',
  `company_postal_code` varchar(5) NOT NULL COMMENT 'Código postal (subsección)',
  `company_website` varchar(255) DEFAULT NULL COMMENT 'Página Web (subsección) - OPCIONAL',
  `company_linkedin` varchar(255) DEFAULT NULL COMMENT 'LinkedIn (subsección) - OPCIONAL',
  `contact_name` varchar(255) NOT NULL COMMENT 'Nombre de la persona de contacto (subsección)',
  `contact_position` varchar(100) NOT NULL COMMENT 'Puesto en la empresa de la persona de contacto (subsección)',
  `contact_email` varchar(255) NOT NULL COMMENT 'Dirección electrónica de correo (subsección)',
  `contact_phone` varchar(15) NOT NULL COMMENT 'Número telefónico (subsección)',
  `contact_area` varchar(100) NOT NULL COMMENT 'Nombre del área asociada (subsección)',
  `supervisor_name` varchar(255) NOT NULL COMMENT 'Nombre del Supervisor (subsección)',
  `supervisor_area` varchar(100) NOT NULL COMMENT 'Área de la empresa en la que se desarrollará el proyecto (subsección)',
  `supervisor_email` varchar(255) NOT NULL COMMENT 'Dirección electrónica de correo (subsección)',
  `supervisor_phone` varchar(15) NOT NULL COMMENT 'Número de teléfono (subsección)',
  `project_name` varchar(255) NOT NULL COMMENT 'Nombre del proyecto (subsección)',
  `project_start_date` date NOT NULL COMMENT 'Fecha de inicio del proyecto (subsección)',
  `project_end_date` date NOT NULL COMMENT 'Fecha de cierre del proyecto (subsección)',
  `project_problem_context` text NOT NULL COMMENT 'Contexto de la problemática (subsección)',
  `project_problem_description` text NOT NULL COMMENT 'Problemática (subsección)',
  `project_general_objective` text NOT NULL COMMENT 'Objetivo general del proyecto a desarrollar (subsección)',
  `project_specific_objectives` text NOT NULL COMMENT 'Objetivos específicos del proyecto (subsección)',
  `project_main_activities` text NOT NULL COMMENT 'Principales actividades a realizar en la estancia o estadía (subsección)',
  `project_planned_deliverables` text NOT NULL COMMENT 'Entregables planeados del proyecto (subsección)',
  `project_technologies` text NOT NULL COMMENT 'Tecnologías a aplicar en el proyecto (subsección)',
  `proposal_status` enum('PENDIENTE','APROBADO','RECHAZADO','ACTUALIZAR') NOT NULL DEFAULT 'PENDIENTE' COMMENT 'Estatus de la propuesta',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `unique_student_convocatoria` (`student_id`,`convocatoria_id`) COMMENT 'One student can only have one proposal per convocatoria',
  KEY `idx_proposals_convocatoria` (`convocatoria_id`),
  KEY `idx_proposals_student` (`student_id`),
  KEY `idx_proposals_tutor` (`academic_tutor_id`),
  KEY `idx_proposals_active` (`active`),
  KEY `idx_proposals_status` (`proposal_status`),
  KEY `idx_proposals_created_at` (`created_at`),
  KEY `idx_proposals_company` (`company_short_name`),
  KEY `idx_proposals_project_dates` (`project_start_date`,`project_end_date`),
  CONSTRAINT `fk_proposals_convocatoria` FOREIGN KEY (`convocatoria_id`) REFERENCES `convocatorias` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_proposals_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_proposals_tutor` FOREIGN KEY (`academic_tutor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_email_format_contact` CHECK ((`contact_email` like _utf8mb4'%@%.%')),
  CONSTRAINT `chk_email_format_supervisor` CHECK ((`supervisor_email` like _utf8mb4'%@%.%')),
  CONSTRAINT `chk_internship_type` CHECK ((`internship_type` in (_utf8mb4'Estancia I',_utf8mb4'Estancia II',_utf8mb4'Estadía',_utf8mb4'Estadía 1',_utf8mb4'Estadía 2'))),
  CONSTRAINT `chk_postal_code` CHECK (((char_length(`company_postal_code`) = 5) and regexp_like(`company_postal_code`,_utf8mb4'^[0-9]{5}$'))),
  CONSTRAINT `chk_project_dates` CHECK ((`project_end_date` >= `project_start_date`)),
  CONSTRAINT `chk_tax_id_length` CHECK (((char_length(`company_tax_id`) >= 12) and (char_length(`company_tax_id`) <= 13))),
  CONSTRAINT `chk_website_format` CHECK (((`company_website` is null) or (`company_website` like _utf8mb4'http%')))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Project proposals with section/subsection structure and status field';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_proposals`
--

LOCK TABLES `project_proposals` WRITE;
/*!40000 ALTER TABLE `project_proposals` DISABLE KEYS */;
INSERT INTO `project_proposals` VALUES (1,'71eae849-9928-4849-a67f-9837c51dff77',2,5,'','',10,'Carlos Mendoza García','carlos.mendoza@upchiapas.edu.mx','Estancia II','google','privada','BIM011108DJ5','Chiapas','Tuxtla Gutierrez','Barrio','Centro','Avenida','Central','200','c21312','29100','https://www.googl.com','https://www.googl.com','José Calzada Razo','director','crjosue@upgto.edu.mx','12-3456-7890','RH','supervisor juan','TI','yo@gmail.com','12-3456-7890','aqui va el nombre del proyecto completo','2025-09-27','2025-11-07','aqui describiremos el contexto de la problemática completa del proyecto.','aqui describiremos la problemática completa del proyecto.','terminar la aplicacion en el tiempo establecido','desarrollar backend, desarrollar frontend, etc etc ect','Desarrollar todo el backend, desarrollar todo el frontend y completar todo a tiempo','github y aplicacion desplegada y automatizada github y aplicacion desplegada y automatizada github y aplicacion desplegada y automatizada github y aplicacion desplegada y automatizada','react, node, docker, ia python','PENDIENTE',1,'2025-09-25 03:21:46','2025-09-25 03:21:46',5,NULL);
/*!40000 ALTER TABLE `project_proposals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposal_comments`
--

DROP TABLE IF EXISTS `proposal_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proposal_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proposal_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tutor_id` int NOT NULL,
  `section_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la sección principal (ej: "Objetivos del Proyecto")',
  `subsection_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la subsección específica (ej: "Objetivo General")',
  `comment_text` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Texto del comentario del tutor',
  `vote_status` enum('ACEPTADO','RECHAZADO','ACTUALIZA') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Decisión del tutor sobre esta subsección',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `idx_proposal_comments_proposal_id` (`proposal_id`),
  KEY `idx_proposal_comments_tutor_id` (`tutor_id`),
  KEY `idx_proposal_comments_section` (`section_name`,`subsection_name`),
  KEY `idx_proposal_comments_vote_status` (`vote_status`),
  KEY `idx_proposal_comments_created_at` (`created_at`),
  CONSTRAINT `fk_proposal_comments_tutor` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposal_comments`
--

LOCK TABLES `proposal_comments` WRITE;
/*!40000 ALTER TABLE `proposal_comments` DISABLE KEYS */;
INSERT INTO `proposal_comments` VALUES (1,'2b54847a-b22f-4471-9457-909f41e775f8','1',6,'Información de la Empresa','Datos Generales','corregir esto todo lo demas bien','ACEPTADO',1,'2025-09-22 23:03:29','2025-09-22 23:03:29');
/*!40000 ALTER TABLE `proposal_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `proposal_comments_with_details`
--

DROP TABLE IF EXISTS `proposal_comments_with_details`;
/*!50001 DROP VIEW IF EXISTS `proposal_comments_with_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `proposal_comments_with_details` AS SELECT 
 1 AS `id`,
 1 AS `uuid`,
 1 AS `proposal_id`,
 1 AS `proposal_uuid`,
 1 AS `project_name`,
 1 AS `company_short_name`,
 1 AS `student_id`,
 1 AS `tutor_id`,
 1 AS `tutor_uuid`,
 1 AS `tutor_name`,
 1 AS `tutor_last_name`,
 1 AS `tutor_email`,
 1 AS `section_name`,
 1 AS `subsection_name`,
 1 AS `comment_text`,
 1 AS `vote_status`,
 1 AS `active`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `role_menu`
--

DROP TABLE IF EXISTS `role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `id_role` int NOT NULL,
  `id_menu` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `id_role` (`id_role`),
  KEY `id_menu` (`id_menu`),
  CONSTRAINT `role_menu_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`),
  CONSTRAINT `role_menu_ibfk_2` FOREIGN KEY (`id_menu`) REFERENCES `menus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_menu`
--

LOCK TABLES `role_menu` WRITE;
/*!40000 ALTER TABLE `role_menu` DISABLE KEYS */;
INSERT INTO `role_menu` VALUES (15,'1a0b41f0-a2a7-4b9a-8b34-42ac412a95c0',13,17,'2025-06-28 03:58:09','2025-06-28 03:58:09',NULL,NULL),(18,'d9d64ac5-ace3-4d63-bbd8-8e4b9ff49740',11,18,'2025-07-17 00:50:25','2025-07-17 00:50:25',NULL,NULL),(21,'a5bb4aff-4401-41ac-85b4-568e67c12063',10,18,'2025-07-17 18:07:56','2025-07-17 18:07:56',NULL,NULL),(22,'f401e7b4-b2aa-4fc8-a7ac-925ec78f02a4',10,19,'2025-07-17 18:15:46','2025-07-17 18:15:46',NULL,NULL),(23,'2b11ae5d-5b59-42a9-adce-50d9bfc7b94e',10,20,'2025-07-17 18:38:43','2025-07-17 18:38:43',NULL,NULL),(24,'1528c395-24e8-4394-b6e7-032a2d616094',11,22,'2025-07-19 01:20:51','2025-07-19 01:20:51',NULL,NULL),(25,'cc22fd6f-d366-4c20-b95a-bd6ee1f00fa8',15,23,'2025-07-19 01:37:59','2025-07-19 01:37:59',NULL,NULL),(26,'f43185c2-b33d-4839-a030-afb5092305ee',14,24,'2025-07-19 01:42:41','2025-07-19 01:42:41',NULL,NULL),(27,'95b729b9-e0e9-4705-bfae-e96f7a40b533',16,24,'2025-07-19 01:43:16','2025-07-19 01:43:16',NULL,NULL),(28,'fb0073dc-dabb-4ecb-9ace-fd3a6795892f',13,24,'2025-07-19 01:53:23','2025-07-19 01:53:23',NULL,NULL);
/*!40000 ALTER TABLE `role_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_submenu`
--

DROP TABLE IF EXISTS `role_submenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_submenu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `id_role` int NOT NULL,
  `id_submenu` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `id_role` (`id_role`),
  KEY `id_submenu` (`id_submenu`),
  CONSTRAINT `role_submenu_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`),
  CONSTRAINT `role_submenu_ibfk_2` FOREIGN KEY (`id_submenu`) REFERENCES `submenus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_submenu`
--

LOCK TABLES `role_submenu` WRITE;
/*!40000 ALTER TABLE `role_submenu` DISABLE KEYS */;
INSERT INTO `role_submenu` VALUES (5,'211f472f-cde5-487e-b0ce-c7fef2a7a066',13,10,'2025-06-28 03:58:14','2025-06-28 03:58:14',NULL,NULL),(8,'9f773e6c-2114-40ce-9aed-8384d14285c5',11,12,'2025-07-17 00:50:29','2025-07-17 00:50:29',NULL,NULL),(9,'9a56f20c-527a-412e-97af-2a4ee35922b0',11,11,'2025-07-17 00:50:32','2025-07-17 00:50:32',NULL,NULL),(10,'37405286-f402-400a-9d0d-274766d1b8cc',10,12,'2025-07-17 18:08:23','2025-07-17 18:08:23',NULL,NULL),(11,'2556dec5-ff74-44d7-b11e-90bd11f26162',10,11,'2025-07-17 18:08:27','2025-07-17 18:08:27',NULL,NULL),(14,'f35f7a3e-8af1-46bd-aadf-db23dd83dd24',15,17,'2025-07-19 01:38:03','2025-07-19 01:38:03',NULL,NULL),(15,'6b79b00f-c3aa-426f-b261-eccbe6afa7a4',15,16,'2025-07-19 01:38:05','2025-07-19 01:38:05',NULL,NULL),(16,'f6245943-f0f3-479d-843e-c244596de96b',13,18,'2025-07-19 01:55:13','2025-07-19 01:55:13',NULL,NULL);
/*!40000 ALTER TABLE `role_submenu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_users`
--

DROP TABLE IF EXISTS `role_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `id_user` int NOT NULL,
  `id_role` int NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `id_user` (`id_user`),
  KEY `id_role` (`id_role`),
  CONSTRAINT `role_users_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  CONSTRAINT `role_users_ibfk_2` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_users`
--

LOCK TABLES `role_users` WRITE;
/*!40000 ALTER TABLE `role_users` DISABLE KEYS */;
INSERT INTO `role_users` VALUES (1,'550e8400-e29b-41d4-a716-446655440000',4,11,1,'2025-06-21 04:25:32','2025-07-17 01:06:25',NULL,NULL),(2,'650a8422-e19b-7rf4-a716-446655440000',6,13,1,'2025-07-17 00:34:06','2025-07-17 01:06:26',NULL,NULL),(3,'3f8a7e17-9c90-46e4-b646-3f1e9eebc6b2',7,10,1,'2025-07-17 18:27:28','2025-07-17 18:27:28',NULL,NULL),(4,'f8d7c6b5-a4e3-2d1c-0b9a-876543210fed',5,15,1,'2025-07-19 01:58:16','2025-07-19 01:58:16',NULL,NULL),(5,'1a2b3c4d-5e6f-7890-abcd-ef1234567890',6,13,1,'2025-07-19 02:01:49','2025-07-19 02:01:49',NULL,NULL),(6,'7e8d9c0b-a1b2-3c4d-5e6f-7890abcdef12',8,14,1,'2025-07-19 02:09:34','2025-07-19 02:09:34',NULL,NULL),(7,'23a4b5c6-d7e8-f9a0-1b2c-3d4e5f678901',9,16,1,'2025-07-19 02:10:17','2025-07-19 02:10:17',NULL,NULL),(8,'f1a2b3c4-d5e6-7890-abcd-123456789001',10,14,1,'2025-09-09 09:31:08','2025-09-09 09:31:08',NULL,NULL),(9,'f2b3c4d5-e6f7-8901-bcde-123456789002',11,14,1,'2025-09-09 09:31:08','2025-09-09 09:31:08',NULL,NULL),(10,'f3c4d5e6-f7a8-9012-cdef-123456789003',12,14,1,'2025-09-09 09:31:08','2025-09-09 09:31:08',NULL,NULL),(11,'f4d5e6f7-a8b9-0123-defa-123456789004',13,14,1,'2025-09-09 09:31:08','2025-09-09 09:31:08',NULL,NULL),(12,'f5e6f7a8-b9c0-1234-efab-123456789005',14,14,1,'2025-09-09 09:31:08','2025-09-09 09:31:08',NULL,NULL);
/*!40000 ALTER TABLE `role_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (10,'ce115770-f1bd-4e68-ab07-1587382820ce','SUPER-ADMIN','Acceso a todas las secciones',1,'2025-04-25 02:21:43','2025-07-17 00:38:55',NULL,NULL),(11,'a449e975-ffd0-4a3b-a27f-6a8f7f434094','ADMIN-USUARIOS','Acceso unicamente a gestión de usuarios',1,'2025-05-20 22:54:01','2025-07-17 00:40:12',NULL,NULL),(13,'0953a1fe-f0bd-4944-95e9-6959ec98813f','Director','Role encargado de manejar todo',1,'2025-06-28 03:58:02','2025-06-28 03:58:02',NULL,NULL),(14,'18cb5fa0-8b0b-41b9-9fcd-439f348ccfb3','PTC','Profesor de tiempo completo',1,'2025-07-19 01:25:28','2025-07-19 01:25:28',NULL,NULL),(15,'19addd1e-3620-4d7e-aaeb-e5c435ebd53e','Alumno','Alumno que registrara su estadia',1,'2025-07-19 01:25:45','2025-07-19 01:25:45',NULL,NULL),(16,'358bdaaa-adb4-4d68-a15a-25ee63f594d8','PA','Profesor de asignatura',1,'2025-07-19 01:25:56','2025-07-19 01:25:56',NULL,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submenus`
--

DROP TABLE IF EXISTS `submenus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submenus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `path` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT NULL,
  `component_name` varchar(100) DEFAULT NULL COMMENT 'Nombre del componente React (PascalCase)',
  `deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `idx_submenus_component_name` (`component_name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submenus`
--

LOCK TABLES `submenus` WRITE;
/*!40000 ALTER TABLE `submenus` DISABLE KEYS */;
INSERT INTO `submenus` VALUES (10,'c8729f81-9bf6-4151-a9da-26c1ddf92847','Ver Periodos','Módulo para crear periodos','<LuChartArea />','/visualizar-periodos',1,1,'VisualizarPeriodos',0,'2025-06-28 03:57:32','2025-07-19 01:48:21',NULL,NULL),(11,'8e0d78fb-2c1c-457e-a4a4-b736579926ae','Nuevo usuario','Módulo para registro de usuarios','ninguno','/nuevo',1,2,NULL,0,'2025-07-17 00:45:24','2025-07-17 00:47:30',NULL,NULL),(12,'1dfa7058-62da-41e7-9846-dd8fcb8c4cf6','Administración','Administración de usuarios','ninguno','/administracion',1,1,'AdministracionUsuarios',0,'2025-07-17 00:46:39','2025-07-19 01:07:46',NULL,NULL),(16,'1dc9a357-dca5-4769-8658-17e540779fdc','Generar Propuestas','Módulo para generar propuestas','ninguno','/nueva-propuesta',1,2,'GenerarPropuesta',0,'2025-07-19 01:30:02','2025-07-19 01:59:55',NULL,NULL),(17,'95b42045-6df7-4fa0-b090-9c812613daf8','Ver Propuestas','Módulo para visualizar las propuestas','ninguno','/visualizar-propuestas',1,1,'VisualizarPropuestas',0,'2025-07-19 01:31:31','2025-07-19 01:59:55',NULL,NULL),(18,'5c6d875e-f2db-4682-b874-71c311d50060','Nuevo Periodo','Módulo para crear periodos','ninguno','/nuevo-periodo',1,2,'NuevoPeriodo',0,'2025-07-19 01:49:05','2025-07-19 01:59:56',NULL,NULL);
/*!40000 ALTER TABLE `submenus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `secondLastName` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_creation` int DEFAULT NULL,
  `user_update` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'2d7c8a19-b9a7-4f90-938b-236aec13f551','Admin usuarios','testing','testing','admin-usuarios@upchiapas.edu.mx','1111111111','$2b$10$YmUaE9OBj79XHYXM9EwyWeBM.WMcHpcejA0sjaEvt75hqcJB./7yW',1,'2025-06-21 05:24:50','2025-07-17 00:52:06',NULL,NULL),(5,'6560c5ab-096f-4932-8527-88541fb8ed3a','Alumno','alumnoApellido1','alumnoApellido2','alumno-test@upchiapas.edu.mx','1111111111','$2b$10$q9zfspEo80sErhdPGhGjPuBRD/xl60nv8hvVNsUxTK/WwTlXJ0irC',1,'2025-07-17 00:20:33','2025-07-17 00:20:33',NULL,NULL),(6,'5962c487-563a-499c-b1a3-6f12a175aba2','Director','directorApellido1','directorApellido2','director-test@upchiapas.edu.mx','2222222222','$2b$10$V8.v437g1/pQ4BCWWFqsW.rAh8/0sd8s/27VqPY0sUc38z.3x7Dya',1,'2025-07-17 00:23:06','2025-07-17 00:23:06',NULL,NULL),(7,'1dc78701-fd8b-45b1-9c17-b52505d18f05','Yahir Alexander','Gutiérrez','Martínez','yam778123@gmail.com','9612764510','$2b$10$Qn6teLfxanVTuhdtmDTOAeLfUrZJo3VWvKvawlrW72WhSSWYc.NdW',1,'2025-07-17 18:25:19','2025-07-17 18:25:19',NULL,NULL),(8,'9614e93d-231a-4ff4-91ee-ead1eed5372f','Profesor','Tiempo','Completo','ptc@upchiapas.edu.mx','9876564567','$2b$10$2kFOYSJwrcM9iHyxsU1Ge.Csjhjwvt9xlNd9mGHq7xXkcHmoXqH2.',1,'2025-07-19 02:06:29','2025-07-19 02:06:29',NULL,NULL),(9,'46e72960-b5b3-4e06-ad96-c72e0112c5f3','Profesor','Asignatura','v1','pa@upchiapas.edu.mx','6787654341','$2b$10$mCbVWYQeaYoGhid/VLZXkOBU6yjI1zNunXs16zaljDRaha89GJF2K',1,'2025-07-19 02:06:53','2025-07-19 02:07:39',NULL,NULL),(10,'a1b2c3d4-e5f6-7890-1234-567890abcd01','Carlos','Mendoza','García','carlos.mendoza@upchiapas.edu.mx','9612345001','$2b$10$2kFOYSJwrcM9iHyxsU1Ge.Csjhjwvt9xlNd9mGHq7xXkcHmoXqH2.',1,'2025-09-09 09:30:45','2025-09-09 09:30:45',NULL,NULL),(11,'b2c3d4e5-f6a7-8901-2345-678901bcde02','María','González','López','maria.gonzalez@upchiapas.edu.mx','9612345002','$2b$10$2kFOYSJwrcM9iHyxsU1Ge.Csjhjwvt9xlNd9mGHq7xXkcHmoXqH2.',1,'2025-09-09 09:30:45','2025-09-09 09:30:45',NULL,NULL),(12,'c3d4e5f6-a7b8-9012-3456-789012cdef03','José','Hernández','Ruiz','jose.hernandez@upchiapas.edu.mx','9612345003','$2b$10$2kFOYSJwrcM9iHyxsU1Ge.Csjhjwvt9xlNd9mGHq7xXkcHmoXqH2.',1,'2025-09-09 09:30:45','2025-09-09 09:30:45',NULL,NULL),(13,'d4e5f6a7-b8c9-0123-4567-890123defa04','Ana','Pérez','Morales','ana.perez@upchiapas.edu.mx','9612345004','$2b$10$2kFOYSJwrcM9iHyxsU1Ge.Csjhjwvt9xlNd9mGHq7xXkcHmoXqH2.',1,'2025-09-09 09:30:45','2025-09-09 09:30:45',NULL,NULL),(14,'e5f6a7b8-c9d0-1234-5678-901234efab05','Roberto','Jiménez','Torres','roberto.jimenez@upchiapas.edu.mx','9612345005','$2b$10$2kFOYSJwrcM9iHyxsU1Ge.Csjhjwvt9xlNd9mGHq7xXkcHmoXqH2.',1,'2025-09-09 09:30:45','2025-09-09 09:30:45',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `proposal_comments_with_details`
--

/*!50001 DROP VIEW IF EXISTS `proposal_comments_with_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `proposal_comments_with_details` AS select `pc`.`id` AS `id`,`pc`.`uuid` AS `uuid`,`pc`.`proposal_id` AS `proposal_id`,`pp`.`uuid` AS `proposal_uuid`,`pp`.`project_name` AS `project_name`,`pp`.`company_short_name` AS `company_short_name`,`pp`.`student_id` AS `student_id`,`pc`.`tutor_id` AS `tutor_id`,`u`.`uuid` AS `tutor_uuid`,`u`.`name` AS `tutor_name`,`u`.`lastName` AS `tutor_last_name`,`u`.`email` AS `tutor_email`,`pc`.`section_name` AS `section_name`,`pc`.`subsection_name` AS `subsection_name`,`pc`.`comment_text` AS `comment_text`,`pc`.`vote_status` AS `vote_status`,`pc`.`active` AS `active`,`pc`.`created_at` AS `created_at`,`pc`.`updated_at` AS `updated_at` from ((`proposal_comments` `pc` join `project_proposals` `pp` on((`pc`.`proposal_id` = `pp`.`id`))) join `users` `u` on((`pc`.`tutor_id` = `u`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-25  2:07:55
