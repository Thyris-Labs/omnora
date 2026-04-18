package users

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
)

type userService struct {
	repo *userRepository
}

func newUserService(repo *userRepository) userService {
	return userService{
		repo: repo,
	}
}

func (h *userService) setup(ctx context.Context, user *db.User) (*setupReturnBody, *apierror.Error) {
	var body setupReturnBody

	data, err := h.repo.GetUserData(ctx, user.ID)
	if err != nil {
		return nil, apierror.Internal(errCodeGetUserDataFailed, errMessageGetUserDataFailed, err)
	}

	body.User = user
	body.Environments = data

	return &body, nil
}
