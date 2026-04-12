package email

import (
	"os"

	_ "github.com/joho/godotenv/autoload"
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

	clientInstance = &Service{
		Client: email,
	}

	return clientInstance
}
