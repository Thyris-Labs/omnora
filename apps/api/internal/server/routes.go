package server

import (
	"net/http"

	"github.com/Thyris-Labs/omnora/internal/server/middlewares"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	api := r.Group("/api/v1")
	protected := api.Group("", middlewares.Auth(s.cache))

	s.auth.RegisterRoutes(api, protected)
	s.environments.RegisterRoutes(protected)
	s.users.RegisterRoutes(protected)
	s.modules.RegisterRoutes(protected)

	return r
}
