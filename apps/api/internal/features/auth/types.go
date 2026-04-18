package auth

type verifyEmailBody struct {
	Email string `json:"email" binding:"required,email"`
	Flow  string `json:"flow" binding:"required,oneof=signup signin"`
}

type checkUsernameBody struct {
	Username string `json:"username" binding:"required"`
}

type signupBody struct {
	Email    string `json:"email" binding:"required,email"`
	Username string `json:"username" binding:"required"`
	Code     string `json:"code" binding:"required"`
}

type signinBody struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required"`
}
