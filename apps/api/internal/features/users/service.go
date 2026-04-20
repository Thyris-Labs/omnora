package users

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
)

type userService struct {
	repo  *userRepository
	cache *cache.Service
}

func newUserService(repo *userRepository, cache *cache.Service) userService {
	return userService{
		repo:  repo,
		cache: cache,
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

func (h *userService) updateUser(ctx context.Context, user *db.User, userToken string, body *updateBody) *apierror.Error {
	if err := h.repo.UpdateUser(ctx, user.ID, body); err != nil {
		return apierror.Internal(errCodeUpdateUserFailed, errMessageUpdateUserFailed, err)
	}

	user.DisplayName = body.DisplayName
	user.Username = body.Username

	if err := cacheUser(ctx, h.cache, userToken, user); err != nil {
		return apierror.Internal(errCodeUpdateUserInCacheFailed, errMessageUpdateUserFailed, err)
	}

	return nil
}
