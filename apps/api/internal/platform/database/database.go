package database

import (
	"context"
	"fmt"
	"log"
	"os"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
)

type Service struct {
	Client  *pgxpool.Pool
	Queries *db.Queries
}

var (
	host       = os.Getenv("DB_HOST")
	port       = os.Getenv("DB_PORT")
	username   = os.Getenv("DB_USERNAME")
	password   = os.Getenv("DB_PASSWORD")
	database   = os.Getenv("DB_DATABASE")
	schema     = os.Getenv("DB_SCHEMA")
	dbInstance *Service
)

func New() *Service {
	if dbInstance != nil {
		return dbInstance
	}

	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s", username, password, host, port, database, schema)
	conn, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatal(err)
	}

	dbInstance = &Service{
		Client:  conn,
		Queries: db.New(conn),
	}

	return dbInstance
}
