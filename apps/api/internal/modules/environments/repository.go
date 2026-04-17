package environments

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/google/uuid"
)

type environmentRepository struct {
	db *database.Service
}

func newEnvironmentRepository(db *database.Service) environmentRepository {
	return environmentRepository{
		db: db,
	}
}

func (r *environmentRepository) CreateEnvironment(body *createEnvironmentBody) (*db.Environment, error) {
	environment, err := r.db.Queries.CreateEnvironment(context.Background(), db.CreateEnvironmentParams{
		ID:      uuid.NewString(),
		Name:    body.Name,
		OwnerID: body.OwnerId,
	})
	if err != nil {
		return nil, err
	}

	return &environment, nil
}

func (r *environmentRepository) GetEnvironment(id string) (*db.Environment, error) {
	environment, err := r.db.Queries.GetEnvironment(context.Background(), id)
	if err != nil {
		return nil, err
	}

	return &environment, nil
}

func (r *environmentRepository) GetEnvironmentsByUser(ownerId string) ([]db.Environment, error) {
	environments, err := r.db.Queries.GetEnvironmentsByUser(context.Background(), ownerId)
	if err != nil {
		return nil, err
	}

	return environments, nil
}
