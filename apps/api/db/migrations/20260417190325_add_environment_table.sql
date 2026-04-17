-- migrate:up
CREATE TABLE environments(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    owner_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- migrate:down
DROP TABLE environments;
