CREATE TABLE IF NOT EXISTS "apiKey" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(32),
	"store_id" varchar(8) NOT NULL,
	"name" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"permissions" text[] NOT NULL,
	CONSTRAINT "apiKey_key_unique" UNIQUE("key"),
	CONSTRAINT "key_index" UNIQUE("key"),
	CONSTRAINT "name" UNIQUE("name","store_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file" (
	"id" varchar(8) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"extension" text NOT NULL,
	"size" real NOT NULL,
	"creation_date" date,
	"store_id" varchar(8) NOT NULL,
	"index" varchar(32) NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	CONSTRAINT "file_index_unique" UNIQUE("index")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store" (
	"id" varchar(8) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"creation_date" date NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "unique_name" UNIQUE("name","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"admin" boolean NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apiKey" ADD CONSTRAINT "apiKey_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file" ADD CONSTRAINT "file_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store" ADD CONSTRAINT "store_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
