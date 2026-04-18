package modules

type ModuleType string

const (
	ModuleTypeNotes ModuleType = "NOTES"
)

var moduleTypes = map[ModuleType]struct{}{
	ModuleTypeNotes: {},
}

func (t ModuleType) IsValid() bool {
	_, ok := moduleTypes[t]
	return ok
}

type addModuleBody struct {
	Type          ModuleType `json:"type" binding:"required,module_type"`
	EnvironmentID string     `json:"environment_id"`
}
