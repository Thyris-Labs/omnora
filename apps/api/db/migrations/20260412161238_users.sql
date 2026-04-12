-- migrate:up
CREATE TABLE users(
	id TEXT PRIMARY KEY,
	email TEXT NOT NULL,
	username TEXT NOT NULL,
	display_name TEXT NOT NULL,
	avatar TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- migrate:down
DROP TABLE users;
