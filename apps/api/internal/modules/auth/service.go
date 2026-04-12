package auth

import (
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/email"
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

func (s *authService) verifyEmail(body *verifyEmailBody) error {
	code, err := generateCode()
	if err != nil {
		return err
	}

	if err := cacheEmailForVerification(s.cache, body.Email, code); err != nil {
		return err
	}

	if err := sendMail(s.email, body.Email, code); err != nil {
		return err
	}

	return nil
}

func (s *authService) signup(body *signupBody) (*string, error) {
	if err := checkCode(s.cache, body.Email, body.Code); err != nil {
		return nil, err
	}

	user, err := s.repo.CreateUser(body)
	if err != nil {
		return nil, err
	}

	token, err := generateSessionToken()
	if err != nil {
		return nil, err
	}

	if err := cacheUser(s.cache, token, user); err != nil {
		return nil, err
	}

	return &token, nil
}

func (s *authService) signin(body *signinBody) (*string, error) {
	if err := checkCode(s.cache, body.Email, body.Code); err != nil {
		return nil, err
	}

	user, err := s.repo.GetUser(body)
	if err != nil {
		return nil, err
	}

	token, err := generateSessionToken()
	if err != nil {
		return nil, err
	}

	if err := cacheUser(s.cache, token, user); err != nil {
		return nil, err
	}

	return &token, nil
}
