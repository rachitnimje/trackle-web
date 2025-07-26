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
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
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
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request data", err)
			return
		}

		// Validate input
		if !utils.IsValidEmail(req.Email) {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid email format", nil)
			return
		}

		if !utils.IsValidUsername(req.Username) {
			utils.ErrorResponse(c, http.StatusBadRequest, "Username must be 3-30 characters, alphanumeric and underscore only", nil)
			return
		}

		if !utils.IsValidPassword(req.Password) {
			utils.ErrorResponse(c, http.StatusBadRequest, "Password must be at least 8 characters long", nil)
			return
		}

		role := req.Role
		if role == "" {
			role = "user"
		}

		// Check if user already exists
		var existingUser models.User
		if err := db.Where("email = ? OR username = ?", utils.TrimAndLower(req.Email), req.Username).First(&existingUser).Error; err == nil {
			utils.ErrorResponse(c, http.StatusConflict, "User with this email or username already exists", nil)
			return
		}

		// Hash password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to process password", err)
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
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create user", err)
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
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request data", err)
			return
		}

		// Find user by email
		var user models.User
		if err := db.Where("email = ?", utils.TrimAndLower(req.Email)).First(&user).Error; err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid credentials", nil)
			return
		}

		// Verify password
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid credentials", nil)
			return
		}

		// Generate JWT token
		token, err := utils.GenerateJWT(user.ID)
		if err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to generate token", err)
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
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			utils.ErrorResponse(c, http.StatusNotFound, "User not found", err)
			return
		}

		utils.SuccessResponse(c, "User retrieved successfully", user)
	}
}
