package storage

import (
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"strings"

	"github.com/Thyris-Labs/omnora/internal/platform/apierror"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/davidbyttow/govips/v2/vips"

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

type FileValidationConfig struct {
	MaxSize      int64
	Extensions   []string
	ContentTypes []string
}

type ValidatedFile struct {
	ContentType string
	Extension   string
	Size        int64
}

func (s *Service) ValidateFiles(files []multipart.FileHeader, cfg FileValidationConfig) {}

func (s *Service) ValidateFile(file *multipart.FileHeader, cfg FileValidationConfig) (*ValidatedFile, *apierror.Error) {
	if cfg.MaxSize > 0 && file.Size > cfg.MaxSize {
		return nil, apierror.BadRequest(
			errCodeFileTooLarge,
			fmt.Sprintf("This file is too large. Please upload a file smaller than %s.", formatBytes(cfg.MaxSize)),
			nil,
		)
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	if len(cfg.Extensions) > 0 && !slices.Contains(cfg.Extensions, ext) {
		return nil, apierror.BadRequest(
			errCodeFileExtensionNotAllowed,
			errMessageFileExtensionNotAllowed,
			nil,
		)
	}

	f, err := file.Open()
	if err != nil {
		return nil, apierror.BadRequest(
			errCodeFileReadFailed,
			errMessageFileReadFailed,
			err,
		)
	}
	defer f.Close()

	buffer := make([]byte, 512)
	n, err := f.Read(buffer)
	if err != nil && err != io.EOF {
		return nil, apierror.BadRequest(
			errCodeFileReadFailed,
			errMessageFileReadFailed,
			err,
		)
	}

	contentType := http.DetectContentType(buffer[:n])
	if len(cfg.ContentTypes) > 0 && !slices.Contains(cfg.ContentTypes, contentType) {
		return nil, apierror.BadRequest(
			errCodeFileContentTypeNotAllowed,
			errMessageFileContentTypeNotAllowed,
			nil,
		)
	}

	return &ValidatedFile{
		ContentType: contentType,
		Extension:   ext,
		Size:        file.Size,
	}, nil
}

func (s *Service) PublicURL(key string) string {
	return fmt.Sprintf("%s/%s", strings.TrimRight(publicURL, "/"), strings.TrimLeft(key, "/"))
}

func (s *Service) ProcessImage(file *multipart.FileHeader) ([]byte, error) {
	f, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer f.Close()

	fileBytes, err := io.ReadAll(f)
	if err != nil {
		return nil, fmt.Errorf("failed to read file content: %w", err)
	}

	params := vips.NewImportParams()

	image, err := vips.LoadImageFromBuffer(fileBytes, params)
	if err != nil {
		return nil, err
	}
	defer image.Close()

	cfg := vips.AvifExportParams{
		Lossless:      false,
		StripMetadata: true,
		Quality:       85,
	}

	processedImage, _, err := image.ExportAvif(&cfg)
	if err != nil {
		return nil, err
	}

	return processedImage, nil
}

func formatBytes(size int64) string {
	const mb = 1024 * 1024

	if size >= mb && size%mb == 0 {
		return fmt.Sprintf("%d MB", size/mb)
	}

	return fmt.Sprintf("%d bytes", size)
}
