package modules

import "github.com/go-playground/validator/v10"

const moduleTypeValidationTag = "module_type"

func RegisterValidations(validate *validator.Validate) error {
	return validate.RegisterValidation(moduleTypeValidationTag, validateModuleType)
}

func validateModuleType(fl validator.FieldLevel) bool {
	return ModuleType(fl.Field().String()).IsValid()
}
