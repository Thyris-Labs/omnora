package auth

import (
	"context"
	"fmt"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type authRepository struct {
	db *database.Service
}

func newAuthRepository(db *database.Service) authRepository {
	return authRepository{
		db: db,
	}
}

func (r *authRepository) CreateUser(ctx context.Context, body *signupBody) (*db.User, error) {
	tx, err := r.db.Client.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = tx.Rollback(ctx)
	}()

	qtx := r.db.Queries.WithTx(tx)

	user, err := qtx.CreateUser(ctx, db.CreateUserParams{
		ID:          uuid.NewString(),
		Email:       body.Email,
		Username:    body.Username,
		DisplayName: body.Username,
		Avatar: pgtype.Text{
			String: "https://i.pinimg.com/1200x/92/41/92/924192b2cdbec6802e7fe4229e2e1bd9.jpg",
			Valid:  true,
		},
	})
	if err != nil {
		return nil, err
	}

	_, err = qtx.CreateEnvironment(ctx, db.CreateEnvironmentParams{
		ID:      uuid.NewString(),
		Name:    fmt.Sprintf("%s's Environment", user.Username),
		OwnerID: user.ID,
		Avatar: pgtype.Text{
			String: "https://i.pinimg.com/736x/7d/75/75/7d7575efd18ed31b8bde75e1a8dbfd9a.jpg",
			Valid:  true,
		},
	})
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *authRepository) GetUserByEmail(ctx context.Context, email string) (*db.User, error) {
	user, err := r.db.Queries.GetUser(ctx, email)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *authRepository) CheckUsername(ctx context.Context, username string) bool {
	if _, err := r.db.Queries.CheckUsername(ctx, username); err != nil {
		return false
	}

	return true
}
