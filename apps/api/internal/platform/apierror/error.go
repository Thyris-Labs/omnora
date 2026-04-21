package apierror

import (
	"fmt"
	"net/http"
)

const (
	CodeInvalidRequest         = "ERR_INVALID_REQUEST"
	MessageInvalidRequest      = "The request data is invalid."
	CodeNotFound               = "ERR_NOT_FOUND"
	MessageNotFound            = "The requested resource was not found."
	CodeInternalServer         = "ERR_INTERNAL_SERVER"
	MessageInternalServer      = "Something went wrong. Please try again later."
	CodeUnauthorizedRequest    = "ERR_UNAUTHORIZED_REQUEST"
	MessageUnauthorizedRequest = "Unauthorized."
)

type Error struct {
	StatusCode int    `json:"status"`
	Code       string `json:"code"`
	Message    string `json:"message"`
	Cause      error  `json:"-"`
}

func New(statusCode int, code string, message string, cause error) *Error {
	error := &Error{
		StatusCode: statusCode,
		Code:       code,
		Message:    message,
		Cause:      cause,
	}

	fmt.Println(error)

	return error
}

func BadRequest(code string, message string, cause error) *Error {
	if code == "" {
		code = CodeInvalidRequest
	}

	if message == "" {
		message = MessageInvalidRequest
	}

	return New(http.StatusBadRequest, code, message, cause)
}

func InvalidRequest(cause error) *Error {
	return BadRequest(CodeInvalidRequest, MessageInvalidRequest, cause)
}

func UnauthorizedRequest() *Error {
	return New(http.StatusUnauthorized, CodeUnauthorizedRequest, MessageUnauthorizedRequest, nil)
}

func NotFound(code string, message string, cause error) *Error {
	if code == "" {
		code = CodeNotFound
	}

	if message == "" {
		message = MessageNotFound
	}

	return New(http.StatusNotFound, code, message, cause)
}

func Internal(code string, message string, cause error) *Error {
	if code == "" {
		code = CodeInternalServer
	}

	if message == "" {
		message = MessageInternalServer
	}

	return New(http.StatusInternalServerError, code, message, cause)
}
