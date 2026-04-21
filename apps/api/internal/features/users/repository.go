package users

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/database"
	"github.com/jackc/pgx/v5/pgtype"
)

type userRepository struct {
	db *database.Service
}

func newUserRepository(db *database.Service) userRepository {
	return userRepository{
		db: db,
	}
}

func (r *userRepository) getUserData(ctx context.Context, userID string) ([]db.GetEnvironmentsWithModulesByUserRow, error) {
	environments, err := r.db.Queries.GetEnvironmentsWithModulesByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	return environments, nil
}

func (r *userRepository) updateUser(ctx context.Context, userID string, body *updateBody) error {
	err := r.db.Queries.UpdateUser(ctx, db.UpdateUserParams{
		ID:          userID,
		Username:    body.Username,
		DisplayName: body.DisplayName,
	})
	if err != nil {
		return err
	}

	return nil
}

func (r *userRepository) updateAvatar(ctx context.Context, userID string, avatarURL string) error {
	err := r.db.Queries.UpdateAvatar(ctx, db.UpdateAvatarParams{
		ID: userID,
		Avatar: pgtype.Text{
			String: avatarURL,
			Valid:  true,
		},
	})
	if err != nil {
		return err
	}

	return nil
}
