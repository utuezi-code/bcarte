-- Admin accounts (completely separate from user/profile system)
CREATE TABLE IF NOT EXISTS admins (
  id          text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email       text UNIQUE NOT NULL,
  "passwordHash" text NOT NULL,
  name        text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "lastLoginAt" timestamptz
);

-- Suspend users without deleting them
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "suspended" boolean NOT NULL DEFAULT false;

-- Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id          text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email       text NOT NULL,
  "sentAt"    timestamptz NOT NULL DEFAULT now(),
  "usedAt"    timestamptz,
  token       text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex')
);
