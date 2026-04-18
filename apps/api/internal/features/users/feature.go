package users

import (
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/gin-gonic/gin"
)

type Dependencies struct {
	DB *database.Service
}

type Feature interface {
	RegisterRoutes(api *gin.RouterGroup)
}

func New(deps Dependencies) Feature {
	repo := newUserRepository(deps.DB)
	service := newUserService(&repo)
	return newUserHandlers(&service)
}
