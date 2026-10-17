CREATE TABLE employees (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  TEXT        NOT NULL,
  last_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  birth_date  DATE        NOT NULL,
  position    TEXT        NOT NULL
              CHECK (position IN ('DEVELOPER', 'DESIGNER', 'MANAGER', 'ANALYST', 'RECRUITER')),
  status      TEXT        NOT NULL DEFAULT 'ACTIVE'
              CHECK (status IN ('ACTIVE', 'INACTIVE')),
  tag         TEXT,
  avatar_url  TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT employees_email_unique UNIQUE (email)
);