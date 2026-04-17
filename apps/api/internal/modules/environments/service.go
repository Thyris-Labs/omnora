package environments

import (
	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
)

type environmentService struct {
	repo *environmentRepository
}

func newEnvironmentService(repo *environmentRepository) environmentService {
	return environmentService{
		repo: repo,
	}
}

func (s *environmentService) createEnvironment(body *createEnvironmentBody) (*db.Environment, *apierror.Error) {
	environment, err := s.repo.CreateEnvironment(body)
	if err != nil {
		return nil, apierror.Internal(errCodeEnvironmentCreationFailed, errMessageEnvironmentCreationFailed, err)
	}

	return environment, nil
}

func (s *environmentService) getEnvironment(id string) (*db.Environment, *apierror.Error) {

	environment, err := s.repo.GetEnvironment(id)
	if err != nil {
		return nil, apierror.Internal(errCodeEnvironmentNotFound, errMessageEnvironmentNotFound, err)
	}

	return environment, nil
}

func (s *environmentService) getEnvironmentsByOwnerId(ownerId string) ([]db.Environment, *apierror.Error) {

	environments, err := s.repo.GetEnvironmentsByUser(ownerId)
	if err != nil {
		return nil, apierror.Internal(errCodeEnvironmentNotFound, errMessageEnvironmentNotFound, err)
	}

	return environments, nil
}
