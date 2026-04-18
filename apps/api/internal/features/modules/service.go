package modules

import (
	"context"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
)

type moduleService struct {
	repo *moduleRepository
}

func newModuleService(repo *moduleRepository) moduleService {
	return moduleService{
		repo: repo,
	}
}

func (s *moduleService) addModule(ctx context.Context, body *addModuleBody) (*db.Module, *apierror.Error) {
	module, err := s.repo.AddModule(ctx, body)
	if err != nil {
		return nil, apierror.Internal(errCodeAddModuleFailed, errMessageAddModuleFailed, err)
	}

	return module, nil
}
