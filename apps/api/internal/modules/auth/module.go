package auth

import (
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/Thyris-Labs/omnora/internal/platform/email"
	"github.com/gin-gonic/gin"
)

type Dependencies struct {
	DB    *database.Service
	Cache *cache.Service
	Email *email.Service
}

type Module interface {
	RegisterRoutes(api *gin.RouterGroup, protected *gin.RouterGroup)
}

func New(deps Dependencies) Module {
	repo := newAuthRepository(deps.DB)
	service := newAuthService(deps.Cache, deps.Email, &repo)
	return newAuthHandlers(&service)
}
