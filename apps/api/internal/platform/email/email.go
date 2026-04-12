package email

import (
	"os"

	"github.com/resend/resend-go/v3"
)

type Service struct {
	Client *resend.Client
}

var (
	apiKey         = os.Getenv("RESEND_API_KEY")
	clientInstance *Service
)

func New() *Service {
	if clientInstance != nil {
		return clientInstance
	}

	email := resend.NewClient(apiKey)

	client := &Service{
		Client: email,
	}

	return client
}
