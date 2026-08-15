-- profiles: slug for public URL + isPublic flag
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "isPublic" boolean NOT NULL DEFAULT true;

-- index for fast slug lookup
CREATE INDEX IF NOT EXISTS profiles_slug_idx ON profiles (slug) WHERE slug IS NOT NULL;
