package users

import (
	"net/http"

	"github.com/Thyris-Labs/omnora/internal/utils"
	"github.com/gin-gonic/gin"
)

type userHandlers struct {
	service *userService
}

func newUserHandlers(service *userService) *userHandlers {
	return &userHandlers{
		service: service,
	}
}

func (h *userHandlers) RegisterRoutes(api *gin.RouterGroup) {
	api.GET("/users/setup", h.setup)
}

func (h *userHandlers) setup(c *gin.Context) {
	user := utils.GetUser(c)

	body, err := h.service.setup(c.Request.Context(), user)
	if err != nil {
		c.JSON(err.StatusCode, err)
		return
	}

	c.JSON(http.StatusOK, body)
}
