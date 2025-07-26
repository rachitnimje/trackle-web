package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/rachitnimje/trackle-web/models"
	"github.com/rachitnimje/trackle-web/utils"
)

type CreateTemplateRequest struct {
	Name        string                          `json:"name" binding:"required"`
	Description string                          `json:"description" binding:"required"`
	Exercises   []CreateTemplateExerciseRequest `json:"exercises" binding:"required,min=1"`
}

type CreateTemplateExerciseRequest struct {
	ExerciseID uint `json:"exercise_id" binding:"required"`
	Sets       int  `json:"sets" binding:"required,min=1"`
}

type GetAllTemplatesResponse struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
}

type TemplateResponse struct {
	gorm.Model
	Name        string                     `json:"name"`
	Description string                     `json:"description"`
	UserID      uint                       `json:"user_id"`
	Exercises   []TemplateExerciseResponse `json:"exercises"`
}

type TemplateExerciseResponse struct {
	ExerciseID  uint   `json:"exercise_id"`
	Sets        int    `json:"sets"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

func CreateUserTemplate(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// extract the user_id from context
		userID, exists := c.Get("user_id")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		// extract the request body from context
		var req CreateTemplateRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request data", err)
			return
		}

		// TODO: check for duplicate names in the existing table

		// get the non-duplicate exercise ids from request
		exerciseIDMap := make(map[uint]bool)
		var exerciseIDs []uint
		for _, e := range req.Exercises {
			if exerciseIDMap[e.ExerciseID] {
				utils.ErrorResponse(c, http.StatusBadRequest, "Duplicate exercise IDs not allowed", nil)
				return
			}
			exerciseIDMap[e.ExerciseID] = true
			exerciseIDs = append(exerciseIDs, e.ExerciseID)
		}

		// verify all exercises exist
		var exerciseCount int64
		if err := db.Model(&models.Exercise{}).Where("id IN ?", exerciseIDs).Count(&exerciseCount).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to verify exercises", err)
			return
		}

		if int(exerciseCount) != len(exerciseIDs) {
			utils.ErrorResponse(c, http.StatusBadRequest, "One or more exercise IDs are invalid", nil)
			return
		}

		// use transaction for atomic operation
		tx := db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		// create template
		template := models.Template{
			Name:        req.Name,
			UserID:      userID.(uint),
			Description: req.Description,
		}

		if err := tx.Create(&template).Error; err != nil {
			tx.Rollback()
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create template", err)
			return
		}

		// create template exercises for batch insert
		var templateExercises []models.TemplateExercise
		for _, e := range req.Exercises {
			templateExercise := models.TemplateExercise{
				TemplateID: template.ID,
				ExerciseID: e.ExerciseID,
				Sets:       e.Sets,
			}
			templateExercises = append(templateExercises, templateExercise)
		}

		// batch create template exercises
		if err := tx.Create(&templateExercises).Error; err != nil {
			tx.Rollback()
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create template exercise", err)
			return
		}

		if err := tx.Commit().Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to commit transaction", err)
			return
		}

		// reload template with exercises
		if err := db.Preload("Exercises.Exercise").First(&template, template.ID).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to load template", err)
			return
		}

		utils.CreatedResponse(c, "Template created successfully", nil)
	}
}

func GetTemplates(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		//extract the user_id from context
		userID, exists := c.Get("user_id")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		// Parse pagination parameters
		page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
		if err != nil || page < 1 {
			page = 1
		}

		limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
		if err != nil || limit < 1 || limit > 100 {
			limit = 10
		}

		offset := (page - 1) * limit

		var templates []models.Template
		var total int64

		query := db.Model(&models.Template{}).Where("user_id = ?", userID)

		// count total templates for this user
		if err := query.Count(&total).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to count templates", err)
			return
		}

		// return early if no template found
		if total == 0 {
			utils.PaginatedResponse(c, "Templates retrieved successfully", []models.Template{}, page, limit, total)
			return
		}

		// get templates with pagination, sorting and preloading
		if err := db.Where("user_id = ?", userID).
			Preload("Exercises.Exercise").
			Offset(offset).
			Limit(limit).
			Find(&templates).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch templates", err)
			return
		}

		var response []GetAllTemplatesResponse

		for _, template := range templates {
			response = append(response, GetAllTemplatesResponse{
				Model:       template.Model,
				Name:        template.Name,
				Description: template.Description,
			})
		}

		utils.PaginatedResponse(c, "Templates retrieved successfully", response, page, limit, total)
	}
}

func GetUserTemplates(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// extract the user_id from context
		userID, exists := c.Get("user_id")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		var templates []models.Template

		// Only fetch basic template info for faster loading
		if err := db.Select("id, name, created_at, updated_at").
			Where("user_id = ?", userID).
			Order("created_at DESC").
			Find(&templates).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch templates", err)
			return
		}

		utils.SuccessResponse(c, "Template summary retrieved successfully", templates)
	}
}

func GetUserTemplate(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// extract the user_id from context
		userID, exists := c.Get("user_id")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		// parse the template ID with validation
		templateIDStr := c.Param("id")
		if templateIDStr == "" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Template ID is required", nil)
			return
		}

		templateID, err := strconv.ParseUint(templateIDStr, 10, 32)
		if err != nil || templateID == 0 {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid template ID", nil)
			return
		}

		var template models.Template

		if err := db.Where("id = ? AND user_id = ?", templateIDStr, userID).
			Preload("Exercises.Exercise").
			First(&template).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				utils.ErrorResponse(c, http.StatusNotFound, "Template not found", nil)
			} else {
				utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch template", err)
			}
			return
		}

		response := TemplateResponse{
			Model:       template.Model,
			Name:        template.Name,
			Description: template.Description,
			UserID:      template.UserID,
			Exercises:   make([]TemplateExerciseResponse, len(template.Exercises)),
		}

		for i, templateExercise := range template.Exercises {
			response.Exercises[i] = TemplateExerciseResponse{
				ExerciseID:  templateExercise.ExerciseID,
				Sets:        templateExercise.Sets,
				Name:        templateExercise.Exercise.Name,
				Description: templateExercise.Exercise.Description,
				Category:    templateExercise.Exercise.Category,
			}
		}

		utils.SuccessResponse(c, "Template retrieved successfully", response)
	}
}

func DeleteUserTemplate(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// extract the user_id from context
		userID, exists := c.Get("user_id")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		templateIDStr := c.Param("id")
		if templateIDStr == "" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Template ID is required", nil)
			return
		}

		templateID, err := strconv.ParseUint(templateIDStr, 10, 32)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid template ID", err)
			return
		}

		// Check if template exists and belongs to user
		result := db.Where("user_id = ?", userID).Delete(&models.Template{}, templateID)

		if result.Error != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to find template", result.Error)
			return
		}

		if result.RowsAffected == 0 {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Template not found", nil)
			return
		}

		utils.SuccessResponse(c, "Template deleted successfully", nil)
	}
}
