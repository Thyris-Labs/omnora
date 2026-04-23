-- name: CreateEnvironment :one
INSERT INTO environments (
    id, name, owner_id, avatar
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;

-- name: GetEnvironment :one
SELECT * FROM environments WHERE id = $1;

-- name: GetEnvironmentsByUser :many
SELECT * FROM environments WHERE owner_id = $1;
