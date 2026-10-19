CREATE TABLE employees (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  TEXT        NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 50),
  last_name   TEXT        NOT NULL CHECK (char_length(last_name) BETWEEN 1 AND 50),
  email       TEXT        NOT NULL CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone       TEXT        NOT NULL CHECK (phone ~ '^\+?[0-9 ()-]{7,20}$'),
  birth_date  DATE        NOT NULL CHECK (birth_date >= '1900-01-01'),
  position    TEXT        NOT NULL
              CHECK (position IN ('DEVELOPER', 'DESIGNER', 'MANAGER', 'ANALYST', 'RECRUITER')),
  status      TEXT        NOT NULL DEFAULT 'ACTIVE'
              CHECK (status IN ('ACTIVE', 'INACTIVE')),
  tag         TEXT        CHECK (char_length(tag) <= 50),
  avatar_url  TEXT        NOT NULL DEFAULT '' CHECK (avatar_url ~ '^(https?://.+)?$'),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT employees_email_unique UNIQUE (email)
);