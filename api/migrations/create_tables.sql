CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email_id BIGINT NOT NULL,
  passhash VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_name TEXT CHECK (display_name != ''),
  color TEXT,
  notifications BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS fridge (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id BIGINT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS word (
  id BIGSERIAL PRIMARY KEY,
  text TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS fridge_word (
  id BIGSERIAL PRIMARY KEY,
  fridge_id BIGINT NOT NULL,
  word_id BIGINT NOT NULL,
  position_x INT NOT NULL,
  position_y INT NOT NULL,
  last_moved TIMESTAMPTZ DEFAULT NOW(),
  last_moved_by BIGINT,
  FOREIGN KEY (fridge_id) REFERENCES fridge(id),
  FOREIGN KEY (word_id) REFERENCES word(id),
  FOREIGN KEY (last_moved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS email (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  is_verified BOOLEAN
);

CREATE TABLE IF NOT EXISTS shadow_user (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS invitation_to_unknown (
    id BIGSERIAL PRIMARY KEY,
    fridge_id BIGINT NOT NULL,
    from_id BIGINT NOT NULL,
    to_id BIGINT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (fridge_id) REFERENCES fridge(id),
    FOREIGN KEY (from_id) REFERENCES users(id),
    FOREIGN KEY (to_id) REFERENCES shadow_user(id)
);

CREATE TABLE IF NOT EXISTS user_invitation (
    id BIGSERIAL PRIMARY KEY,
    fridge_id BIGINT NOT NULL,
    from_id BIGINT NOT NULL,
    to_id BIGINT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (fridge_id) REFERENCES fridge(id),
    FOREIGN KEY (from_id) REFERENCES users(id),
    FOREIGN KEY (to_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS setting (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    fridge_id BIGINT NOT NULL,
    display_name TEXT,
    color TEXT,
    notifications BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fridge_id) REFERENCES fridge(id)
);
