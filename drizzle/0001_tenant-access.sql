ALTER TABLE "notes" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "note_blocks" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "note_links" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "note_revisions" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
GRANT USAGE ON SCHEMA "public" TO "coscientist_app";--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON "user", "session", "account", "verification", "passkey", "rate_limit" TO "coscientist_app";--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON "notes", "note_blocks", "note_links" TO "coscientist_app";--> statement-breakpoint
GRANT SELECT, INSERT ON "note_revisions" TO "coscientist_app";
