-- Total view counter on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "viewCount" integer NOT NULL DEFAULT 0;

-- Atomic increment function (avoids race conditions)
CREATE OR REPLACE FUNCTION increment_profile_view(profile_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE profiles SET "viewCount" = "viewCount" + 1 WHERE id = profile_id;
$$;
