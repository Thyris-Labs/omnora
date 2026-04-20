package server

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Thyris-Labs/omnora/internal/features/auth"
	"github.com/Thyris-Labs/omnora/internal/features/environments"
	"github.com/Thyris-Labs/omnora/internal/features/modules"
	"github.com/Thyris-Labs/omnora/internal/features/users"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/Thyris-Labs/omnora/internal/platform/email"
)

type Server struct {
	// services
	db    *database.Service
	cache *cache.Service
	email *email.Service

	// features
	auth         auth.Feature
	environments environments.Feature
	users        users.Feature
	modules      modules.Feature
}

func NewServer() *http.Server {
	registerValidators()

	port := os.Getenv("PORT")

	dbSvc := database.New()
	cacheSvc := cache.New()
	emailSvc := email.New()

	authFeature := auth.New(auth.Dependencies{DB: dbSvc, Cache: cacheSvc, Email: emailSvc})
	environmentsFeature := environments.New(environments.Dependencies{DB: dbSvc})
	usersFeature := users.New(users.Dependencies{DB: dbSvc, Cache: cacheSvc})
	modulesFeature := modules.New(modules.Dependencies{DB: dbSvc})

	newServer := &Server{
		db:    dbSvc,
		cache: cacheSvc,
		email: emailSvc,

		auth:         authFeature,
		environments: environmentsFeature,
		users:        usersFeature,
		modules:      modulesFeature,
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
