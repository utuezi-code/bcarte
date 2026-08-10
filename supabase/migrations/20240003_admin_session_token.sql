-- Replace JWT-based admin auth with a DB session token
ALTER TABLE admins ADD COLUMN IF NOT EXISTS "sessionToken"  text UNIQUE;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS "sessionExpiry" timestamptz;
