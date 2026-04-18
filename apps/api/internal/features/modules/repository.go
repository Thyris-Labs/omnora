package modules

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/google/uuid"
)

type moduleRepository struct {
	db *database.Service
}

func newModuleRepository(db *database.Service) moduleRepository {
	return moduleRepository{
		db: db,
	}
}

func (r *moduleRepository) AddModule(ctx context.Context, body *addModuleBody) (*db.Module, error) {
	module, err := r.db.Queries.AddModule(ctx, db.AddModuleParams{
		ID:            uuid.NewString(),
		Type:          string(body.Type),
		EnvironmentID: body.EnvironmentID,
	})
	if err != nil {
		return nil, err
	}

	return &module, nil
}
