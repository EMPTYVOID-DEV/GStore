ALTER TABLE "apiKey" ALTER COLUMN "key" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "apiKey" ALTER COLUMN "key" SET NOT NULL;