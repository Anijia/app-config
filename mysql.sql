CREATE DATABASE `appConfig`;

use `appConfig`;

CREATE TABLE `app` (
  `id` VARCHAR(255) NOT NULL,
  `title` TEXT NOT NULL,
  `icon` VARCHAR(255) NOT NULL,
  `iconHd` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `customUrl` VARCHAR(255) NOT NULL,
  `platform` VARCHAR(255) NOT NULL,
  `device` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `appRecommend` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `sourceId` VARCHAR(255) NOT NULL,
  `targetId` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
