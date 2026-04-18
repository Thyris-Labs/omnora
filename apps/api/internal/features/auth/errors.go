package auth

import (
	"errors"
)

const (
	errCodeVerificationCodeGeneration    = "ERR_VERIFICATION_CODE_GENERATION"
	errCodeEmailAlreadyExist             = "ERR_EMAIL_ALREADY_EXIST"
	errCodeUsernameAlreadyExist          = "ERR_USERNAME_ALREADY_EXIST"
	errCodeVerificationCodeCache         = "ERR_VERIFICATION_CODE_CACHE"
	errCodeVerificationCodeInvalid       = "ERR_INVALID_VERIFICATION_CODE"
	errCodeVerificationCodeDelete        = "ERR_VERIFICATION_CODE_DELETE"
	errCodeVerificationEmailSend         = "ERR_VERIFICATION_EMAIL_SEND"
	errCodeUserCreationFailed            = "ERR_USER_CREATION_FAILED"
	errCodeUserNotFound                  = "ERR_USER_NOT_FOUND"
	errCodeUserLookupFailed              = "ERR_USER_LOOKUP_FAILED"
	errCodeSessionTokenGeneration        = "ERR_SESSION_TOKEN_GENERATION"
	errCodeSessionCache                  = "ERR_SESSION_CACHE"
	errMessageEmailAlreadyExist          = "The email is already in use."
	errMessageUsernameAlreadyExist       = "The username is already in use."
	errMessageVerificationStartFailed    = "We couldn't start email verification. Please try again."
	errMessageInvalidVerificationCode    = "The verification code is invalid or has expired."
	errMessageVerificationCompleteFailed = "We couldn't complete email verification. Please try again."
	errMessageUserCreationFailed         = "We couldn't create your account. Please try again."
	errMessageUserNotFound               = "No account was found for this email."
	errMessageSigninFailed               = "We couldn't sign you in. Please try again."
)

var (
	errVerificationCodeInvalid = errors.New("verification code invalid")
	errVerificationCodeLookup  = errors.New("verification code lookup failed")
	errVerificationCodeDelete  = errors.New("verification code delete failed")
)
