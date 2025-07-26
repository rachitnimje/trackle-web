package utils

import (
	"regexp"
	"strings"
)

func IsValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

func IsValidPassword(password string) bool {
	// At least 8 characters
	return len(password) >= 8
}

func IsValidUsername(username string) bool {
	// Username should be 3-30 characters, alphanumeric and underscore only
	if len(username) < 3 || len(username) > 30 {
		return false
	}
	
	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	return usernameRegex.MatchString(username)
}

func TrimAndLower(s string) string {
	return strings.ToLower(strings.TrimSpace(s))
}
