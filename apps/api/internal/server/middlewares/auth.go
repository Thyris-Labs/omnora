package middlewares

import (
	"encoding/json"
	"net/http"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/gin-gonic/gin"
)

// This middleware exist to block unwanted actors and give us the active user of the request in the context.
// All the error messages are the same because it won't make sense for the user to know about user missing in the cache, etc.
func Auth(ca *cache.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the token
		token, err := c.Cookie("token")
		if err != nil {
			error := apierror.New(http.StatusUnauthorized, "ERR_INVALID_TOKEN", "The auth token is invalid.", err)
			c.JSON(error.StatusCode, error)
			return
		}

		// Get the user from the cache with that token
		user, err := ca.Cache.Get(c.Request.Context(), "user:"+token).Result()
		if err != nil {
			error := apierror.New(http.StatusUnauthorized, "ERR_MISSING_CACHED_USER", "The auth token is invalid.", err)
			c.JSON(error.StatusCode, error)
			return
		}

		// Unmarshal the user
		var userJSON db.User
		if err := json.Unmarshal([]byte(user), &userJSON); err != nil {
			error := apierror.New(http.StatusUnauthorized, "ERR_UNMARSHALLING_USER", "The auth token is invalid.", err)
			c.JSON(error.StatusCode, error)
			return
		}

		// Add them to the context making it easy to get the user inside gin handlers
		c.Set("user", userJSON)

		c.Next()
	}
}
