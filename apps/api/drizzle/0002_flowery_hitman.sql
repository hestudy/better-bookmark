CREATE TABLE `bookmark` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
