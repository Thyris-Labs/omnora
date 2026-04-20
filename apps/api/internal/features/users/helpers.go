package users

import (
	"context"
	"encoding/json"
	"time"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
)

var UserSessionTTL = 30 * 24 * time.Hour

func cacheUser(ctx context.Context, c *cache.Service, token string, user *db.User) error {
	marshalledUser, err := json.Marshal(user)
	if err != nil {
		return err
	}

	return c.Cache.Set(ctx, "user:"+token, marshalledUser, UserSessionTTL).Err()
}
