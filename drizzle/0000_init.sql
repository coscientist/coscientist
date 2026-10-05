CREATE TYPE "public"."note_link_kind" AS ENUM('link', 'transclusion');--> statement-breakpoint
CREATE TABLE "account" (
	"access_token" text,
	"access_token_expires_at" timestamp,
	"account_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"id_token" text,
	"password" text,
	"provider_id" text NOT NULL,
	"refresh_token" text,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"updated_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passkey" (
	"aaguid" text,
	"backed_up" boolean NOT NULL,
	"counter" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"credential_id" text NOT NULL,
	"device_type" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"transports" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"count" integer NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"last_request" bigint NOT NULL,
	CONSTRAINT "rate_limit_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"ip_address" text,
	"token" text NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"image" text,
	"name" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "note_blocks" (
	"block_id" uuid NOT NULL,
	"note_id" uuid NOT NULL,
	"owner_id" text NOT NULL,
	"position" integer NOT NULL,
	"text" text NOT NULL,
	"type" text NOT NULL,
	CONSTRAINT "note_blocks_note_id_block_id_pk" PRIMARY KEY("note_id","block_id")
);
--> statement-breakpoint
ALTER TABLE "note_blocks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "note_links" (
	"kind" "note_link_kind" NOT NULL,
	"owner_id" text NOT NULL,
	"source_block_id" uuid NOT NULL,
	"source_note_id" uuid NOT NULL,
	"target_note_id" uuid NOT NULL,
	CONSTRAINT "note_links_pk" PRIMARY KEY("source_note_id","source_block_id","target_note_id","kind")
);
--> statement-breakpoint
ALTER TABLE "note_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "note_revisions" (
	"actor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"doc" jsonb NOT NULL,
	"note_id" uuid NOT NULL,
	"owner_id" text NOT NULL,
	"revision" integer NOT NULL,
	"title" text NOT NULL,
	CONSTRAINT "note_revisions_note_id_revision_pk" PRIMARY KEY("note_id","revision")
);
--> statement-breakpoint
ALTER TABLE "note_revisions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "notes" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"doc" jsonb NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"owner_id" text NOT NULL,
	"revision" integer NOT NULL,
	"title" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notes_id_owner_id_unique" UNIQUE("id","owner_id")
);
--> statement-breakpoint
ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_blocks" ADD CONSTRAINT "note_blocks_note_fk" FOREIGN KEY ("note_id","owner_id") REFERENCES "public"."notes"("id","owner_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_note_fk" FOREIGN KEY ("source_note_id","owner_id") REFERENCES "public"."notes"("id","owner_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_block_fk" FOREIGN KEY ("source_note_id","source_block_id") REFERENCES "public"."note_blocks"("note_id","block_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_revisions" ADD CONSTRAINT "note_revisions_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_revisions" ADD CONSTRAINT "note_revisions_note_fk" FOREIGN KEY ("note_id","owner_id") REFERENCES "public"."notes"("id","owner_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passkey_userId_idx" ON "passkey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passkey_credentialID_idx" ON "passkey" USING btree ("credential_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "note_links_owner_id_target_note_id_idx" ON "note_links" USING btree ("owner_id","target_note_id");--> statement-breakpoint
CREATE INDEX "notes_owner_id_updated_at_idx" ON "notes" USING btree ("owner_id","updated_at" DESC NULLS LAST);--> statement-breakpoint
CREATE POLICY "note_blocks_owner_only" ON "note_blocks" AS PERMISSIVE FOR ALL TO public USING ("note_blocks"."owner_id" = (select current_setting('app.viewer_id', true))) WITH CHECK ("note_blocks"."owner_id" = (select current_setting('app.viewer_id', true)));--> statement-breakpoint
CREATE POLICY "note_links_owner_only" ON "note_links" AS PERMISSIVE FOR ALL TO public USING ("note_links"."owner_id" = (select current_setting('app.viewer_id', true))) WITH CHECK ("note_links"."owner_id" = (select current_setting('app.viewer_id', true)));--> statement-breakpoint
CREATE POLICY "note_revisions_owner_only" ON "note_revisions" AS PERMISSIVE FOR ALL TO public USING ("note_revisions"."owner_id" = (select current_setting('app.viewer_id', true))) WITH CHECK ("note_revisions"."owner_id" = (select current_setting('app.viewer_id', true)));--> statement-breakpoint
CREATE POLICY "notes_owner_only" ON "notes" AS PERMISSIVE FOR ALL TO public USING ("notes"."owner_id" = (select current_setting('app.viewer_id', true))) WITH CHECK ("notes"."owner_id" = (select current_setting('app.viewer_id', true)));