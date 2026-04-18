-- name: AddModule :one
INSERT INTO modules(
	id, type, environment_id
) VALUES (
	$1, $2, $3
)
RETURNING *;

-- name: GetModulesByEnvironment :many
SELECT * FROM modules WHERE environment_id = $1;
