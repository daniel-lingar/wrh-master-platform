CREATE TABLE `arcs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`arcNumber` int NOT NULL,
	`arcTitle` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `arcs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`grantName` varchar(255) NOT NULL,
	`funder` varchar(255) NOT NULL,
	`deadline` varchar(100),
	`fundingAmount` varchar(100),
	`alignment` text,
	`description` text,
	`url` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resourceType` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionNumber` int NOT NULL,
	`sessionTitle` varchar(255) NOT NULL,
	`arcId` int NOT NULL,
	`sessionGoal` text,
	`anchor` text,
	`hookEpisode` text,
	`mechanism` text,
	`mirror` text,
	`shiftCliffhanger` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_sessionNumber_unique` UNIQUE(`sessionNumber`)
);
--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_arcId_arcs_id_fk` FOREIGN KEY (`arcId`) REFERENCES `arcs`(`id`) ON DELETE no action ON UPDATE no action;