package server

import (
	"github.com/Thyris-Labs/omnora/internal/features/modules"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func registerValidators() {
	validate, ok := binding.Validator.Engine().(*validator.Validate)
	if !ok {
		return
	}

	if err := modules.RegisterValidations(validate); err != nil {
		panic(err)
	}
}
