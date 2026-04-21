package main

import (
	"log"
	"net/http"

	"github.com/Thyris-Labs/omnora/internal/server"
	"github.com/davidbyttow/govips/v2/vips"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	vips.Startup(nil)
	defer vips.Shutdown()

	s := server.NewServer()

	err := s.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
