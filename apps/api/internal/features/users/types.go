package users

import (
	"mime/multipart"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
)

type setupReturnBody struct {
	User         *db.User                                 `json:"user"`
	Environments []db.GetEnvironmentsWithModulesByUserRow `json:"environments"`
}

type updateBody struct {
	DisplayName string `json:"displayName" binding:"required,max=24"`
	Username    string `json:"username" binding:"required,max=24"`
}

type updateAvatarParams struct {
	User      *db.User
	UserToken string
	Avatar    *multipart.FileHeader
}
