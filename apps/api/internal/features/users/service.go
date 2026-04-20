package users

import (
	"context"
	"mime/multipart"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/storage"
)

type userService struct {
	repo    *userRepository
	cache   *cache.Service
	storage *storage.Service
}

func newUserService(repo *userRepository, cache *cache.Service, storage *storage.Service) userService {
	return userService{
		repo:    repo,
		cache:   cache,
		storage: storage,
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

func (h *userService) updateAvatar(ctx context.Context, user *db.User, userToken string, avatar *multipart.FileHeader) (*string, *apierror.Error) {
	url, err := uploadAvatar(ctx, h.storage, avatar)
	if err != nil {
		return nil, apierror.Internal("ERR_UPLOAD_AVATAR_FAILED", "We couldn't upload your new avatar. Please try again.", err)
	}

	return nil, nil
}
