package auth

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/google/uuid"
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
		ID:          uuid.NewString(),
		Email:       body.Email,
		Username:    body.Username,
		DisplayName: body.Username,
	})
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *authRepository) GetUserByEmail(email string) (*db.User, error) {
	user, err := r.db.Queries.GetUser(context.Background(), email)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *authRepository) CheckUsername(username string) bool {
	_, err := r.db.Queries.CheckUsername(context.Background(), username)
	if err != nil {
		return false
	}

	return true
}
