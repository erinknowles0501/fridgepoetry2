CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID NOT NULL,
  passhash VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_name TEXT CHECK (display_name != ''),
  color TEXT,
  notifications BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS fridge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS word (
  id BIGSERIAL PRIMARY KEY,
  text TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS fridge_word (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fridge_id UUID NOT NULL,
  word_id BIGINT NOT NULL,
  position_x INT NOT NULL,
  position_y INT NOT NULL,
  last_moved TIMESTAMPTZ DEFAULT NOW(),
  last_moved_by UUID,
  FOREIGN KEY (fridge_id) REFERENCES fridge(id),
  FOREIGN KEY (word_id) REFERENCES word(id),
  FOREIGN KEY (last_moved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS email (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  is_verified BOOLEAN
);

CREATE TABLE IF NOT EXISTS shadow_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS invitation_to_unknown (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fridge_id UUID NOT NULL,
    from_id UUID NOT NULL,
    to_id UUID NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (fridge_id) REFERENCES fridge(id),
    FOREIGN KEY (from_id) REFERENCES users(id),
    FOREIGN KEY (to_id) REFERENCES shadow_user(id)
);

CREATE TABLE IF NOT EXISTS user_invitation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fridge_id UUID NOT NULL,
    from_id UUID NOT NULL,
    to_id UUID NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (fridge_id) REFERENCES fridge(id),
    FOREIGN KEY (from_id) REFERENCES users(id),
    FOREIGN KEY (to_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS setting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    fridge_id UUID NOT NULL,
    display_name TEXT,
    color TEXT,
    notifications BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fridge_id) REFERENCES fridge(id)
);
