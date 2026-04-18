package modules

import (
	"net/http"

	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
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
	api.POST("/modules/add", h.addModule)
}

func (h *moduleHandlers) addModule(c *gin.Context) {
	var body addModuleBody

	if err := c.ShouldBindBodyWithJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, apierror.InvalidRequest(err))
		return
	}

	module, err := h.service.addModule(c.Request.Context(), &body)
	if err != nil {
		c.JSON(err.StatusCode, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"module": module})
}
