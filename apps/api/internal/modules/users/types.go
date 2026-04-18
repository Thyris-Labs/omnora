package users

import db "github.com/Thyris-Labs/omnora/db/gen_queries"

type setupReturnBody struct {
	User         *db.User         `json:"user"`
	Environments []db.Environment `json:"environments"`
}
