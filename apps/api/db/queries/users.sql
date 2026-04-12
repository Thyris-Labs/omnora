-- name: CreateUser :one
INSERT INTO users (
  id, email, username, display_name
) VALUES (
  $1, $2, $3, $4
)
RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE email = $1;
