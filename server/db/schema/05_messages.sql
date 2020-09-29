DROP TABLE IF EXISTS messages
CASCADE;

CREATE TABLE messages
(
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  renter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lot_id INTEGER REFERENCES lots(id) ON DELETE CASCADE,
  text_body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp
);
