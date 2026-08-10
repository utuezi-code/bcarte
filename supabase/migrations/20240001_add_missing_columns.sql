-- profiles: emailPro field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "emailPro" text;

-- organisations: logoUrl field
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS "logoUrl" text;

-- team_members: role, department, matricule, message, joinedAt
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS "role"       text NOT NULL DEFAULT 'Membre';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS "department" text;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS "matricule"  text;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS "message"    text;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS "joinedAt"   timestamptz NOT NULL DEFAULT now();

-- verifications: refId, certId, certIssuedAt
ALTER TABLE verifications ADD COLUMN IF NOT EXISTS "refId"        text;
ALTER TABLE verifications ADD COLUMN IF NOT EXISTS "certId"       text UNIQUE;
ALTER TABLE verifications ADD COLUMN IF NOT EXISTS "certIssuedAt" timestamptz;
