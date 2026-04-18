package modules

import (
	"github.com/gin-gonic/gin"
)

type moduleHandlers struct {
	service *moduleService
}

func newModuleHandlers(service *moduleService) *moduleHandlers {
	return &moduleHandlers{
		service: service,
	}
}

func (h *moduleHandlers) RegisterRoutes(api *gin.RouterGroup) {
}
