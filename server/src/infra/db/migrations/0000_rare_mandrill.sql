CREATE TABLE "link" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"slug" text NOT NULL,
	"visits" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
