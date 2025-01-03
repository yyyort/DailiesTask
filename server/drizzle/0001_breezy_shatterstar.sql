ALTER TABLE "task_table" DROP CONSTRAINT "task_table_routine_task_id_routine_tasks_table_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_table" ADD CONSTRAINT "task_table_routine_task_id_routine_tasks_table_id_fk" FOREIGN KEY ("routine_task_id") REFERENCES "public"."routine_tasks_table"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
