package modules

import (
	"github.com/Thyris-Labs/omnora/internal/platform/database"
)

type moduleRepository struct {
	db *database.Service
}

func newModuleRepository(db *database.Service) moduleRepository {
	return moduleRepository{
		db: db,
	}
}
