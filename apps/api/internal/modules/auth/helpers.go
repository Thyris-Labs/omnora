package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"os"
	"time"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/email"
	"github.com/redis/go-redis/v9"
	"github.com/resend/resend-go/v3"
)

const (
	UserSessionTTL          = 30 * 24 * time.Hour
	UserSessionCookieMaxAge = int(UserSessionTTL / time.Second)
)

var sessionTokenBytes = 32

func generateSessionToken() (string, error) {
	token := make([]byte, sessionTokenBytes)
	if _, err := rand.Read(token); err != nil {
		return "", err
	}

	return base64.RawURLEncoding.EncodeToString(token), nil
}

func cacheUser(ctx context.Context, c *cache.Service, token string, user *db.User) error {
	marshalledUser, err := json.Marshal(user)
	if err != nil {
		return err
	}

	return c.Cache.Set(ctx, token, marshalledUser, UserSessionTTL).Err()
}

func generateCode() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1_000_000))
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%06d", n.Int64()), nil
}

func cacheEmailForVerification(ctx context.Context, c *cache.Service, email string, code string) error {
	return c.Cache.Set(ctx, "verif:"+email, code, 10*time.Minute).Err()
}

func checkCode(ctx context.Context, c *cache.Service, email string, code string) error {
	generatedCode, err := c.Cache.Get(ctx, "verif:"+email).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return fmt.Errorf("%w: %w", errVerificationCodeInvalid, err)
		}

		return fmt.Errorf("%w: %w", errVerificationCodeLookup, err)
	}

	if generatedCode != code {
		return fmt.Errorf("%w", errVerificationCodeInvalid)
	}

	if err := c.Cache.Del(ctx, "verif:"+email).Err(); err != nil {
		return fmt.Errorf("%w: %w", errVerificationCodeDelete, err)
	}

	return nil
}

func sendMail(ctx context.Context, e *email.Service, email string, code string) error {
	hostEmail := os.Getenv("RESEND_HOST_EMAIL")
	hostName := os.Getenv("RESEND_HOST_NAME")

	params := &resend.SendEmailRequest{
		From:    fmt.Sprintf("%s <%s>", hostName, hostEmail),
		To:      []string{email},
		Subject: "Verify your email",
		Text:    "The code to verify your email is: " + code,
	}

	if _, err := e.Client.Emails.SendWithContext(ctx, params); err != nil {
		return err
	}

	return nil
}
