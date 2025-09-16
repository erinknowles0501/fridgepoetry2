INSERT INTO email (email, is_verified)
VALUES
  ('erinknowles@protonmail.com', 't'), 
  ('abc@aaa.com', 'f'),
  ('ek@123.com', 'f'),
  ('hello@yes.com', 'f');

INSERT INTO users (email_id, passhash, display_name, color, notifications)
VALUES 
  (1, '$2b$10$eq/RvpSfRQ1sbJ7rV5TWIu7/EqbuAX9kD844AaXu5a97DY/ui2bBa', 'Erin', 'red', 't'),
  (2, 'sfasf', 'Lady', 'black', 't'),
  (3, 'dgshfdh', 'Goldie', 'brown', 'f'),
  (4, 'dfhdsasf', 'Auden', 'orange', 'f');

INSERT INTO fridge (
    name,
    owner_id
) VALUES
  ('Fam fridge', 1),
  ('Erins test fridge', 1),
  ('Another test fridge', 1),
  ('Ladys fridge', 2);

INSERT INTO word (text)
VALUES
  ('swamp'),
  ('meagre'),
  ('black'),
  ('dog');

INSERT INTO fridge_word (fridge_id, word_id, position_x, position_y)
VALUES
  (1, 1, 100, 100),
  (1, 2, 200, 200),
  (1, 3, 300, 300);

INSERT INTO user_invitation (
    fridge_id,
    from_id,
    to_id,
    status
) VALUES
  (4, 1, 2, 'PENDING'),
  (4, 1, 3, 'ACCEPTED'),
  (4, 1, 4, 'DECLINED');

INSERT INTO shadow_user (email)
VALUES ('ek@1com.com'), ('cas@eee.com');

INSERT INTO invitation_to_unknown (
    fridge_id,
    from_id,
    to_id,
    status
) VALUES 
  (1, 1, 1, 'PENDING'),
  (1, 1, 2, 'DECLINED');

INSERT INTO setting (
    user_id,
    fridge_id,
    display_name,
    color,
    notifications
) VALUES
  (1, 1, 'Erin K', 'blue', 'f'),
  (3, 1, 'Gode', null, 't');
