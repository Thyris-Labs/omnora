package users

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
)

type userRepository struct {
	db *database.Service
}

func newUserRepository(db *database.Service) userRepository {
	return userRepository{
		db: db,
	}
}

func (r *userRepository) GetUserData(ctx context.Context, userID string) ([]db.GetEnvironmentsWithModulesByUserRow, error) {
	environments, err := r.db.Queries.GetEnvironmentsWithModulesByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	return environments, nil
}
