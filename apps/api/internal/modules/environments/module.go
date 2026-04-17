package environments

import (
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/gin-gonic/gin"
)

type Dependencies struct {
	DB *database.Service
}

type Module interface {
	RegisterRoutes(api *gin.RouterGroup)
}

func New(deps Dependencies) Module {
	repo := newEnvironmentRepository(deps.DB)
	service := newEnvironmentService(&repo)
	return newEnvironmentHandlers(&service)
}
