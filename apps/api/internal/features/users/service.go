package users

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/storage"
	"github.com/jackc/pgx/v5/pgtype"
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

	data, err := h.repo.getUserData(ctx, user.ID)
	if err != nil {
		return nil, apierror.Internal(errCodeGetUserDataFailed, errMessageGetUserDataFailed, err)
	}

	body.User = user
	body.Environments = data

	return &body, nil
}

func (h *userService) updateUser(ctx context.Context, user *db.User, userToken string, body *updateBody) *apierror.Error {
	if err := h.repo.updateUser(ctx, user.ID, body); err != nil {
		return apierror.Internal(errCodeUpdateUserFailed, errMessageUpdateUserFailed, err)
	}

	user.DisplayName = body.DisplayName
	user.Username = body.Username

	if err := cacheUser(ctx, h.cache, userToken, user); err != nil {
		return apierror.Internal(errCodeUpdateUserInCacheFailed, errMessageUpdateUserFailed, err)
	}

	return nil
}

func (h *userService) updateAvatar(ctx context.Context, params updateAvatarParams) (*string, *apierror.Error) {
	processedAvatar, err := h.storage.ProcessImage(params.Avatar)
	if err != nil {
		return nil, apierror.BadRequest(errCodeAvatarProcessingFailed, errMessageAvatarProcessingFailed, err)
	}

	url, err := uploadAvatar(ctx, h.storage, processedAvatar)
	if err != nil {
		return nil, apierror.Internal(errCodeAvatarUploadFailed, errMessageAvatarUploadFailed, err)
	}

	if err := h.repo.updateAvatar(ctx, params.User.ID, url); err != nil {
		return nil, apierror.Internal(errCodeUpdateAvatarFailed, errMessageUpdateAvatarFailed, err)
	}

	params.User.Avatar = pgtype.Text{String: url, Valid: true}
	if err := cacheUser(ctx, h.cache, params.UserToken, params.User); err != nil {
		return nil, apierror.Internal(errCodeUpdateUserInCacheFailed, errMessageUpdateUserFailed, err)
	}

	return &url, nil
}
