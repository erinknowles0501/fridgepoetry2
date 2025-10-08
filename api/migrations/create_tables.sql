CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID NOT NULL UNIQUE,
  passhash VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_name TEXT CHECK (display_name != ''),
  color INT,
  notifications BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS fridge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS word (
  id BIGSERIAL PRIMARY KEY,
  text TEXT UNIQUE CHECK (text != '')
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
  FOREIGN KEY (last_moved_by) REFERENCES users(id),
  UNIQUE (fridge_id, word_id)
);

CREATE TABLE IF NOT EXISTS email (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_verified TEXT NOT NULL CHECK (is_verified IN ('true', 'false', 'pending'))
);

CREATE TABLE IF NOT EXISTS shadow_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE
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
    FOREIGN KEY (to_id) REFERENCES shadow_user(id),
    UNIQUE (fridge_id, to_id)
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
    FOREIGN KEY (to_id) REFERENCES users(id),
    UNIQUE (fridge_id, to_id)
);

CREATE TABLE IF NOT EXISTS setting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    fridge_id UUID NOT NULL,
    display_name TEXT,
    color INT,
    notifications BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fridge_id) REFERENCES fridge(id),
    UNIQUE (user_id, fridge_id)
);
