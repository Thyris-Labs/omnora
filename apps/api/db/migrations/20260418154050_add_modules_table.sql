-- migrate:up
CREATE TABLE modules(
    id TEXT PRIMARY KEY,
    environment_id TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- migrate:down
DROP TABLE modules;
