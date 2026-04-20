-- name: CreateUser :one
INSERT INTO users (
  id, email, username, display_name, avatar
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE email = $1;

-- name: CheckUsername :one
SELECT id FROM users WHERE username = $1;

-- name: UpdateUser :exec
UPDATE users SET username = $2, display_name = $3 WHERE id = $1;
