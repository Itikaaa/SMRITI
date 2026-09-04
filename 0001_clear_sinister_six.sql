ALTER TABLE `stored_files` ADD `consentStatus` enum('pending','confirmed','declined') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `stored_files` ADD `consentNote` text;--> statement-breakpoint
ALTER TABLE `stored_files` ADD `consentRecordedAt` timestamp;