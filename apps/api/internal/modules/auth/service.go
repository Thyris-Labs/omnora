package auth

import (
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

func (s *authService) verifyEmail(body *verifyEmailBody) *apierror.Error {
	code, err := generateCode()
	if err != nil {
		return apierror.Internal(errCodeVerificationCodeGeneration, errMessageVerificationStartFailed, err)
	}

	if err := cacheEmailForVerification(s.cache, body.Email, code); err != nil {
		return apierror.Internal(errCodeVerificationCodeCache, errMessageVerificationStartFailed, err)
	}

	if err := sendMail(s.email, body.Email, code); err != nil {
		return apierror.Internal(errCodeVerificationEmailSend, errMessageVerificationStartFailed, err)
	}

	return nil
}

func (s *authService) signup(body *signupBody) (*string, *apierror.Error) {
	if err := checkCode(s.cache, body.Email, body.Code); err != nil {
		return nil, mapCheckCodeError(err)
	}

	user, err := s.repo.CreateUser(body)
	if err != nil {
		return nil, apierror.Internal(errCodeUserCreationFailed, errMessageUserCreationFailed, err)
	}

	token, err := generateSessionToken()
	if err != nil {
		return nil, apierror.Internal(errCodeSessionTokenGeneration, errMessageSigninFailed, err)
	}

	if err := cacheUser(s.cache, token, user); err != nil {
		return nil, apierror.Internal(errCodeSessionCache, errMessageSigninFailed, err)
	}

	return &token, nil
}

func (s *authService) signin(body *signinBody) (*string, *apierror.Error) {
	if err := checkCode(s.cache, body.Email, body.Code); err != nil {
		return nil, mapCheckCodeError(err)
	}

	user, err := s.repo.GetUser(body)
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

	if err := cacheUser(s.cache, token, user); err != nil {
		return nil, apierror.Internal(errCodeSessionCache, errMessageSigninFailed, err)
	}

	return &token, nil
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
