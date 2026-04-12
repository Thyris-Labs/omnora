package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"time"

	db "github.com/Thyris-Labs/omnora/db/gen_queries"
	"github.com/Thyris-Labs/omnora/internal/platform/cache"
	"github.com/Thyris-Labs/omnora/internal/platform/email"
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

func cacheUser(c *cache.Service, token string, user *db.User) error {
	marshalledUser, err := json.Marshal(user)
	if err != nil {
		return err
	}

	return c.Cache.Set(context.Background(), token, marshalledUser, UserSessionTTL).Err()
}

func generateCode() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(1_000_000))
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%06d", n.Int64()), nil
}

func cacheEmailForVerification(c *cache.Service, email string, code string) error {
	return c.Cache.Set(context.Background(), "verif:"+email, code, 10*time.Minute).Err()
}

func checkCode(c *cache.Service, email string, code string) error {
	generatedCode, err := c.Cache.Get(context.Background(), "verif:"+email).Result()
	if err != nil {
		return err
	}

	if generatedCode != code {
		return fmt.Errorf("given code doesn't match with generated code")
	}

	if err := c.Cache.Del(context.Background(), "verif:"+email).Err(); err != nil {
		return err
	}

	return nil
}

func sendMail(e *email.Service, email string, code string) error {
	hostEmail := os.Getenv("RESEND_HOST_EMAIL")
	hostName := os.Getenv("RESEND_HOST_NAME")

	params := &resend.SendEmailRequest{
		From:    fmt.Sprintf("%s <%s>", hostName, hostEmail),
		To:      []string{email},
		Subject: "Verify your email",
		Text:    "The code to verify your email is: " + code,
	}

	if _, err := e.Client.Emails.Send(params); err != nil {
		return err
	}

	return nil
}
