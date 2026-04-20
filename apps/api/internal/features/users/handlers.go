package users

import (
	"net/http"

	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
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
	api.PATCH("/users/update", h.updateUser)
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

func (h *userHandlers) updateUser(c *gin.Context) {
	var body updateBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, apierror.InvalidRequest(err))
		return
	}

	token, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, apierror.UnauthorizedRequest())
		return
	}

	if err := h.service.updateUser(c.Request.Context(), utils.GetUser(c), token, &body); err != nil {
		c.JSON(err.StatusCode, err)
		return
	}

	c.JSON(http.StatusOK, nil)
}
