package environments

import (
	"net/http"

	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
	"github.com/gin-gonic/gin"
)

type environmentHandlers struct {
	service *environmentService
}

func newEnvironmentHandlers(service *environmentService) *environmentHandlers {
	return &environmentHandlers{
		service: service,
	}
}

func (h *environmentHandlers) RegisterRoutes(api *gin.RouterGroup) {
	api.POST("/environments/create", h.createEnvironment)
	api.GET("/environments/:id", h.getEnvironment)
	api.GET("/environments/users/:ownerId", h.getEnvironmentsByOwnerId)
}

func (h *environmentHandlers) createEnvironment(c *gin.Context) {
	var body createEnvironmentBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, apierror.InvalidRequest(err))
		return
	}

	environment, err := h.service.createEnvironment(&body)

	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"environment": environment})
}

func (h *environmentHandlers) getEnvironment(c *gin.Context) {
	id := c.Param("id")

	environment, err := h.service.getEnvironment(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"environment": environment})
}

func (h *environmentHandlers) getEnvironmentsByOwnerId(c *gin.Context) {
	ownerId := c.Param("ownerId")

	environments, err := h.service.getEnvironmentsByOwnerId(ownerId)

	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"environments": environments})
}
