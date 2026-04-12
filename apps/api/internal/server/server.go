package server

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Thyris-Labs/omnora/internal/modules/auth"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/Thyris-Labs/omnora/internal/platform/email"
)

type Server struct {
	// services
	db    *database.Service
	cache *cache.Service
	email *email.Service

	// modules
	auth auth.Module
}

func NewServer() *http.Server {
	port := os.Getenv("PORT")

	dbSvc := database.New()
	cacheSvc := cache.New()
	emailSvc := email.New()

	authMod := auth.New(auth.Dependencies{DB: dbSvc, Cache: cacheSvc, Email: emailSvc})

	newServer := &Server{
		db:    dbSvc,
		cache: cacheSvc,
		email: emailSvc,

		auth: authMod,
	}

	server := &http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      newServer.RegisterRoutes(),
		IdleTimeout:  1 * time.Minute,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
