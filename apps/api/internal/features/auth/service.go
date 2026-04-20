package auth

import (
	"context"
	"errors"

	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/email"
	"github.com/jackc/pgx/v5"
)

type authService struct {
	repo  *authRepository
	cache *cache.Service
	email *email.Service
}

func newAuthService(cache *cache.Service, email *email.Service, repo *authRepository) authService {
	return authService{
		repo:  repo,
		email: email,
		cache: cache,
	}
}

func (s *authService) verifyEmail(ctx context.Context, body *verifyEmailBody) *apierror.Error {
	if body.Flow == "signup" {
		user, _ := s.repo.GetUserByEmail(ctx, body.Email)
		if user != nil {
			return apierror.BadRequest(errCodeEmailAlreadyExist, errMessageEmailAlreadyExist, nil)
		}
	}

	code, err := generateCode()
	if err != nil {
		return apierror.Internal(errCodeVerificationCodeGeneration, errMessageVerificationStartFailed, err)
	}

	if err := cacheEmailForVerification(ctx, s.cache, body.Email, code); err != nil {
		return apierror.Internal(errCodeVerificationCodeCache, errMessageVerificationStartFailed, err)
	}

	if err := sendMail(ctx, s.email, body.Email, code); err != nil {
		return apierror.Internal(errCodeVerificationEmailSend, errMessageVerificationStartFailed, err)
	}

	return nil
}

func (s *authService) checkUsername(ctx context.Context, body *checkUsernameBody) *apierror.Error {
	if exist := s.repo.CheckUsername(ctx, body.Username); exist {
		return apierror.BadRequest(errCodeUsernameAlreadyExist, errMessageUsernameAlreadyExist, nil)
	}

	return nil
}

func (s *authService) signup(ctx context.Context, body *signupBody) (*string, *apierror.Error) {
	if err := checkCode(ctx, s.cache, body.Email, body.Code); err != nil {
		return nil, mapCheckCodeError(err)
	}

	user, err := s.repo.CreateUser(ctx, body)
	if err != nil {
		return nil, apierror.Internal(errCodeUserCreationFailed, errMessageUserCreationFailed, err)
	}

	token, err := generateSessionToken()
	if err != nil {
		return nil, apierror.Internal(errCodeSessionTokenGeneration, errMessageSigninFailed, err)
	}

	if err := cacheUser(ctx, s.cache, token, user); err != nil {
		return nil, apierror.Internal(errCodeSessionCache, errMessageSigninFailed, err)
	}

	return &token, nil
}

func (s *authService) signin(ctx context.Context, body *signinBody) (*string, *apierror.Error) {
	if err := checkCode(ctx, s.cache, body.Email, body.Code); err != nil {
		return nil, mapCheckCodeError(err)
	}

	user, err := s.repo.GetUserByEmail(ctx, body.Email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apierror.NotFound(errCodeUserNotFound, errMessageUserNotFound, err)
		}

		return nil, apierror.NotFound(errCodeUserLookupFailed, errMessageSigninFailed, err)
	}

	token, err := generateSessionToken()
	if err != nil {
		return nil, apierror.Internal(errCodeSessionTokenGeneration, errMessageSigninFailed, err)
	}

	if err := cacheUser(ctx, s.cache, token, user); err != nil {
		return nil, apierror.Internal(errCodeSessionCache, errMessageSigninFailed, err)
	}

	return &token, nil
}

func (s *authService) logout(ctx context.Context, token string) *apierror.Error {
	if err := deleteCachedUser(ctx, s.cache, token); err != nil {
		return apierror.Internal(errCodeDeleteSessionCache, errMessageDeleteSessionCache, err)
	}

	return nil
}

func mapCheckCodeError(err error) *apierror.Error {
	switch {
	case errors.Is(err, errVerificationCodeInvalid):
		return apierror.BadRequest(errCodeVerificationCodeInvalid, errMessageInvalidVerificationCode, err)
	case errors.Is(err, errVerificationCodeLookup):
		return apierror.BadRequest(errCodeVerificationCodeCache, errMessageVerificationCompleteFailed, err)
	case errors.Is(err, errVerificationCodeDelete):
		return apierror.BadRequest(errCodeVerificationCodeDelete, errMessageVerificationCompleteFailed, err)
	default:
		return apierror.BadRequest(errCodeVerificationCodeCache, errMessageVerificationCompleteFailed, err)
	}
}
