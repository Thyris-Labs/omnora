package utils

import (
	"net/http"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
	"github.com/gin-gonic/gin"
)

func GetUser(c *gin.Context) *db.User {
	u, ok := c.Get("user")
	if !ok {
		c.JSON(http.StatusUnauthorized, apierror.UnauthorizedRequest())
		return nil
	}

	return u.(*db.User)
}
