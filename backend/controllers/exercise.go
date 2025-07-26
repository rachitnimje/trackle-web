package controllers

import (
	"errors"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/rachitnimje/trackle-web/models"
	"github.com/rachitnimje/trackle-web/utils"
)

type CreateExerciseRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

func CreateExercise(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var createExerciseRequest CreateExerciseRequest
		if err := c.ShouldBindJSON(&createExerciseRequest); err != nil {
			appErr := utils.NewValidationError("Invalid request data", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		if createExerciseRequest.Name == "" {
			appErr := utils.NewInvalidInputError("Exercise name is required", nil)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// check if exercise with the given name already exists
		var count int64
		if err := db.Model(&models.Exercise{}).Where("name = ?", createExerciseRequest.Name).Count(&count).Error; err != nil {
			appErr := utils.NewDatabaseError("Failed to retrieve exercise with given name", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		if count != 0 {
			appErr := utils.NewDuplicateEntryError("Exercise with the given name already exists", nil)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// create exercise model
		exercise := models.Exercise{
			Name:        createExerciseRequest.Name,
			Description: createExerciseRequest.Description,
			Category:    createExerciseRequest.Category,
		}

		// Use transaction manager for atomic operation
		var createdExercise models.Exercise
		utils.TransactionManager(db, c, func(tx *gorm.DB) error {
			// save the exercise to db
			if err := tx.Create(&exercise).Error; err != nil {
				return utils.NewDatabaseError("Failed to create exercise", err)
			}

			// Store the created exercise for response
			createdExercise = exercise
			return nil
		})

		if createdExercise.ID > 0 {
			utils.CreatedResponse(c, "Exercise created successfully", createdExercise)
		}
	}
}

func GetAllExercises(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// parse pagination parameters
		page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
		if err != nil || page < 1 {
			page = 1
		}

		limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
		if err != nil || limit < 1 || limit > 100 {
			limit = 10
		}

		offset := (page - 1) * limit

		category := c.Query("category")
		search := c.Query("search")

		query := db.Model(&models.Exercise{})

		// apply search and category filters
		if category != "" {
			query = query.Where("category = ?", category)
		}
		if search != "" {
			query = query.Where("name ILIKE ?", "%"+search+"%")
		}

		var totalWorkouts int64
		if err := query.Count(&totalWorkouts).Error; err != nil {
			appErr := utils.NewDatabaseError("Failed to count workouts", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		var workouts []models.Exercise
		if err := query.Offset(offset).Limit(limit).Find(&workouts).Error; err != nil {
			appErr := utils.NewDatabaseError("Failed to fetch workouts", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		utils.PaginatedResponse(c, "Exercises retrieved successfully", workouts, page, limit, totalWorkouts)
	}
}

func GetExercise(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		exerciseID := c.Param("id")
		if exerciseID == "" {
			appErr := utils.NewInvalidInputError("Exercise ID is required", nil)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		var exercise models.Exercise

		if err := db.Where("id = ?", exerciseID).First(&exercise).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				appErr := utils.NewNotFoundError("Exercise not found", nil)
				utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			} else {
				appErr := utils.NewDatabaseError("Failed to fetch exercise", err)
				utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			}
			return
		}

		utils.SuccessResponse(c, "Exercise retrieved successfully", exercise)
	}
}

func DeleteExercise(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		exerciseIDStr := c.Param("id")
		if exerciseIDStr == "" {
			appErr := utils.NewInvalidInputError("Exercise ID is required", nil)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		exerciseID, err := strconv.ParseUint(exerciseIDStr, 10, 32)
		if err != nil {
			appErr := utils.NewInvalidInputError("Invalid exercise ID", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// First check if the exercise exists
		var exercise models.Exercise
		if err := db.First(&exercise, exerciseID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				appErr := utils.NewNotFoundError("Exercise not found", nil)
				utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
				return
			}
			appErr := utils.NewDatabaseError("Failed to fetch exercise", err)
			utils.ErrorResponse(c, appErr.StatusCode, appErr.Message, appErr)
			return
		}

		// Use transaction manager for atomic operation
		utils.TransactionManager(db, c, func(tx *gorm.DB) error {
			// Delete the exercise
			if err := tx.Delete(&exercise).Error; err != nil {
				return utils.NewDatabaseError("Failed to delete exercise", err)
			}
			return nil
		})

		utils.SuccessResponse(c, "Exercise deleted successfully", nil)
	}
}
