CREATE TABLE employees (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  TEXT        NOT NULL,
  last_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  birth_date  DATE        NOT NULL,
  position    TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'ACTIVE',
  tag         TEXT,
  avatar_url  TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT employees_position_check
    CHECK (position IN ('DEVELOPER', 'DESIGNER', 'MANAGER', 'ANALYST', 'RECRUITER')),
  CONSTRAINT employees_status_check
    CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE UNIQUE INDEX employees_email_unique_idx ON employees (lower(email));