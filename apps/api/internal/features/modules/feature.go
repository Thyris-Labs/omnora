package modules

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
	repo := newModuleRepository(deps.DB)
	service := newModuleService(&repo)
	return newModuleHandlers(&service)
}
