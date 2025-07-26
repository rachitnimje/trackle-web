package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/rachitnimje/trackle-web/models"
	"github.com/rachitnimje/trackle-web/utils"
)

type RegisterRequest struct {
	Username string `json:"username" binding:"required,username"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,strongpassword"`
	Role     string `json:"role"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterResponse struct {
	User models.User `json:"user"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func Register(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			errorMsg := utils.ValidationErrorToText(err)
			appErr := utils.NewValidationError(errorMsg, err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// Email already validated by the binding tag
		// Username already validated by the binding tag
		// Password already validated by the binding tag

		role := req.Role
		if role == "" {
			role = "user"
		}

		// Check if user already exists
		var existingUser models.User
		if err := db.Where("email = ? OR username = ?", utils.TrimAndLower(req.Email), req.Username).First(&existingUser).Error; err == nil {
			appErr := utils.NewDuplicateEntryError("User with this email or username already exists", nil)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// Hash password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			appErr := utils.NewInternalError("Failed to process password", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// Create user
		user := models.User{
			Username: req.Username,
			Email:    utils.TrimAndLower(req.Email),
			Password: string(hashedPassword),
			Role:     role,
		}

		if err := db.Create(&user).Error; err != nil {
			appErr := utils.NewDatabaseError("Failed to create user", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		response := RegisterResponse{
			User: user,
		}

		utils.CreatedResponse(c, "User created successfully", response)
	}
}

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			errorMsg := utils.ValidationErrorToText(err)
			appErr := utils.NewValidationError(errorMsg, err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// Find user by email
		var user models.User
		if err := db.Where("email = ?", utils.TrimAndLower(req.Email)).First(&user).Error; err != nil {
			appErr := utils.NewAuthenticationError("Invalid credentials", nil)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// Verify password
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			appErr := utils.NewAuthenticationError("Invalid credentials", nil)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// Generate JWT token
		token, err := utils.GenerateJWT(user.ID)
		if err != nil {
			appErr := utils.NewInternalError("Failed to generate token", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// Set cookie
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("auth_token", token, 24*60*60, "/", "", false, true) // 24 hours

		response := LoginResponse{
			Token: token,
		}

		utils.SuccessResponse(c, "Login successful", response)
	}
}

func Logout() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Clear the auth cookie
		c.SetCookie("auth_token", "", -1, "/", "", false, true)
		utils.SuccessResponse(c, "Logged out successfully", nil)
	}
}

func Me(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			appErr := utils.NewAuthenticationError("User not authenticated", nil)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			appErr := utils.NewNotFoundError("User not found", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		utils.SuccessResponse(c, "User retrieved successfully", user)
	}
}
