CREATE TABLE IF NOT EXISTS "routine_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "routine_table_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "task_table" ADD COLUMN "routine_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "routine_table" ADD CONSTRAINT "routine_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_table" ADD CONSTRAINT "task_table_routine_id_routine_table_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routine_table"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
