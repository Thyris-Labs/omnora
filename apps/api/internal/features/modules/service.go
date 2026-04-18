package modules

type moduleService struct {
	repo *moduleRepository
}

func newModuleService(repo *moduleRepository) moduleService {
	return moduleService{
		repo: repo,
	}
}
