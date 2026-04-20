package users

import (
	"context"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"time"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/storage"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

var UserSessionTTL = 30 * 24 * time.Hour

func cacheUser(ctx context.Context, c *cache.Service, token string, user *db.User) error {
	marshalledUser, err := json.Marshal(user)
	if err != nil {
		return err
	}

	return c.Cache.Set(ctx, "user:"+token, marshalledUser, UserSessionTTL).Err()
}

func uploadAvatar(ctx context.Context, s *storage.Service, avatar *multipart.FileHeader) (string, error) {
	key := fmt.Sprintf("avatars/%s.avif", uuid.NewString())
	params := &s3.PutObjectInput{
		Bucket: &s.Bucket,
		Key:    &key,
	}

	if _, err := s.Client.PutObject(ctx, params); err != nil {
		return "", err
	}

	return s.PublicURL(key), nil
}
