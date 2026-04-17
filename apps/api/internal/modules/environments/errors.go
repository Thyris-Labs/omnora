package environments

import (
	"errors"
)

const (
	errCodeEnvironmentCreationFailed    = "ERR_ENVIRONMENT_CREATION_FAILED"
	errMessageEnvironmentCreationFailed = "We couldn't create your environment. Please try again."
	errCodeEnvironmentNotFound          = "ERR_ENVIRONMENT_NOT_FOUND"
	errMessageEnvironmentNotFound       = "No Environment was found."
)

var (
	errVerificationCodeInvalid = errors.New("verification code invalid")
	errVerificationCodeLookup  = errors.New("verification code lookup failed")
	errVerificationCodeDelete  = errors.New("verification code delete failed")
)
