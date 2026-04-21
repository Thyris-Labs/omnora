package storage

const (
	errCodeFileTooLarge              = "ERR_FILE_TOO_LARGE"
	errCodeFileExtensionNotAllowed   = "ERR_FILE_EXTENSION_NOT_ALLOWED"
	errCodeFileContentTypeNotAllowed = "ERR_FILE_CONTENT_TYPE_NOT_ALLOWED"
	errCodeFileReadFailed            = "ERR_FILE_READ_FAILED"

	errMessageFileExtensionNotAllowed   = "This file extension isn't supported."
	errMessageFileContentTypeNotAllowed = "This file type isn't supported."
	errMessageFileReadFailed            = "We couldn't read this file. Please try again."
)
