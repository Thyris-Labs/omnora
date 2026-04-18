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

type userData struct {
	environments []db.Environment
}

func (r *userRepository) GetUserData(ctx context.Context, userID string) (*userData, error) {
	var userData userData

	environments, err := r.db.Queries.GetEnvironmentsByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	userData.environments = environments

	return &userData, nil
}
