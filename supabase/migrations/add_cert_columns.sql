ALTER TABLE verifications ADD COLUMN IF NOT EXISTS "certId" text UNIQUE;
ALTER TABLE verifications ADD COLUMN IF NOT EXISTS "certIssuedAt" timestamptz;
