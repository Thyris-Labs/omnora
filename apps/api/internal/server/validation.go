package server

import (
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func registerValidators() {
	_, ok := binding.Validator.Engine().(*validator.Validate)
	if !ok {
		return
	}
}
