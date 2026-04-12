package server

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/Thyris-Labs/omnora/internal/platform/email"
)

type Server struct {
	db    *database.Service
	cache *cache.Service
	email *email.Service
}

func NewServer() *http.Server {
	port := os.Getenv("PORT")

	dbSvc := database.New()
	cacheSvc := cache.New()
	emailSvc := email.New()

	newServer := &Server{
		db:    dbSvc,
		cache: cacheSvc,
		email: emailSvc,
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
