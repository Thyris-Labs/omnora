package auth

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
)

type authRepository struct {
	db *database.Service
}

func newAuthRepository(db *database.Service) authRepository {
	return authRepository{
		db: db,
	}
}

func (r *authRepository) CreateUser(body *signupBody) (*db.User, error) {
	user, err := r.db.Queries.CreateUser(context.Background(), db.CreateUserParams{
		Email:       body.Email,
		Username:    body.Username,
		DisplayName: body.Username,
	})
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *authRepository) GetUser(body *signinBody) (*db.User, error) {
	user, err := r.db.Queries.GetUser(context.Background(), body.Email)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
