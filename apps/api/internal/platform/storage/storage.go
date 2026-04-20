package storage

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	_ "github.com/joho/godotenv/autoload"
)

type Service struct {
	Client *s3.Client
	Bucket string
}

var (
	endpoint       = os.Getenv("S3_ENDPOINT")
	bucket         = os.Getenv("S3_BUCKET")
	region         = os.Getenv("S3_REGION")
	accessKey      = os.Getenv("S3_ACCESS_KEY")
	secretKey      = os.Getenv("S3_SECRET_KEY")
	publicURL      = os.Getenv("S3_PUBLIC_URL")
	clientInstance *Service
)

func New() *Service {
	if clientInstance != nil {
		return clientInstance
	}

	provider := credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")
	cfg, err := config.LoadDefaultConfig(context.Background(),
		config.WithBaseEndpoint(endpoint),
		config.WithRegion(region),
		config.WithCredentialsProvider(provider),
	)
	if err != nil {
		log.Fatal(err)
	}

	clientInstance = &Service{
		Client: s3.NewFromConfig(cfg),
		Bucket: bucket,
	}

	return clientInstance
}

func (s *Service) ValidateFiles() {}

func (s *Service) ValidateFile() {}

func (s *Service) PublicURL(key string) string {
	return fmt.Sprintf("%s/%s", strings.TrimRight(publicURL, "/"), strings.TrimLeft(key, "/"))
}

func (s *Service) ProcessImage() {}
