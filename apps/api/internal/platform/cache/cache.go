package cache

import (
	"fmt"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/redis/go-redis/v9"
)

type Service struct {
	Cache *redis.Client
}

var (
	password      = os.Getenv("CACHE_PASSWORD")
	port          = os.Getenv("CACHE_PORT")
	cacheInstance *Service
)

func New() *Service {
	if cacheInstance != nil {
		return cacheInstance
	}

	opts := &redis.Options{
		Addr:     fmt.Sprintf("localhost:%s", port),
		Password: password,
		DB:       0,
	}

	client := redis.NewClient(opts)

	cacheInstance = &Service{
		Cache: client,
	}

	return cacheInstance
}
