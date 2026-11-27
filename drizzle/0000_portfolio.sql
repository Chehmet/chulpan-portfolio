CREATE TABLE articles (
  id TEXT PRIMARY KEY NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'preprint', 'working')),
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX articles_public_listing ON articles (status, updated_at);
--> statement-breakpoint
CREATE TABLE checklist (
  id TEXT PRIMARY KEY NOT NULL,
  data TEXT NOT NULL
);
