CREATE DATABASE `app_config`;

use `app_config`;

CREATE TABLE `app` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(566) NOT NULL,
  `platform` VARCHAR(255) NOT NULL,
  `device` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `recommended_app` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `appId` VARCHAR(255) NOT NULL,
  `displayName` VARCHAR(566) NOT NULL,
  `lIconUrl` TEXT NOT NULL,
  `hIconUrl` TEXT NOT NULL,
  `downloadUrl` TEXT NOT NULL,
  `_schema` VARCHAR(255),
  INDEX(lIconUrl(500)),
  INDEX(hIconUrl(500)),
  FOREIGN KEY(appId) references app(id) on delete cascade on update cascade,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
