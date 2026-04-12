package main

import (
	"log"
	"net/http"

	"github.com/Thyris-Labs/omnora/internal/server"
)

func main() {
	s := server.NewServer()

	err := s.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
