package auth

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type authHandlers struct {
	service *authService
}

func newAuthHandlers(service *authService) *authHandlers {
	return &authHandlers{
		service: service,
	}
}

func (h *authHandlers) RegisterRoutes(api *gin.RouterGroup) {
	api.POST("/verify", h.verify)
	api.POST("/signup", h.signup)
	api.POST("/signin", h.signin)
}

func (h *authHandlers) verify(c *gin.Context) {
	var body verifyEmailBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.verifyEmail(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, nil)
}

func (h *authHandlers) signup(c *gin.Context) {
	var body signupBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := h.service.signup(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("token", *token, UserSessionCookieMaxAge, "/", os.Getenv("DOMAIN"), false, true)

	c.JSON(http.StatusCreated, nil)
}

func (h *authHandlers) signin(c *gin.Context) {
	var body signinBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := h.service.signin(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("token", *token, UserSessionCookieMaxAge, "/", os.Getenv("DOMAIN"), false, true)

	c.JSON(http.StatusCreated, nil)
}
