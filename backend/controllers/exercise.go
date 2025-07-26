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

type CreateExerciseRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

// GetAllExercises fetches all the available exercises
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
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to count workouts", err)
			return
		}

		var workouts []models.Exercise
		if err := query.Offset(offset).Limit(limit).Find(&workouts).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch workouts", err)
			return
		}

		utils.PaginatedResponse(c, "Exercises retrieved successfully", workouts, page, limit, totalWorkouts)
	}
}

// GetExercise fetch exercise with given ID
func GetExercise(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		exerciseID := c.Param("id")
		if exerciseID == "" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Exercise ID is required", nil)
			return
		}

		var exercise models.Exercise

		if err := db.Where("id = ?", exerciseID).First(&exercise).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				utils.ErrorResponse(c, http.StatusNotFound, "Exercise not found", nil)
			} else {
				utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch exercise", err)
			}
			return
		}

		utils.SuccessResponse(c, "Exercise retrieved successfully", exercise)
	}
}

func CreateExercise(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var createExerciseRequest CreateExerciseRequest
		if err := c.ShouldBindJSON(&createExerciseRequest); err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request data", err)
			return
		}

		if createExerciseRequest.Name == "" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Exercise name is required", nil)
			return
		}

		// check if exercise with the given name already exists
		var count int64
		if err := db.Model(&models.Exercise{}).Where("name = ?", createExerciseRequest.Name).Count(&count).Error; err != nil {
			utils.ErrorResponse(c, http.StatusConflict, "Failed to retrieve exercise with given name", err)
			return
		}

		if count != 0 {
			utils.ErrorResponse(c, http.StatusConflict, "Exercise with the given name already exists", nil)
			return
		}

		// create exercise model
		exercise := models.Exercise{
			Name:        createExerciseRequest.Name,
			Description: createExerciseRequest.Description,
			Category:    createExerciseRequest.Category,
		}

		// save the exercise to db
		if err := db.Create(&exercise).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create exercise", err)
			return
		}

		utils.CreatedResponse(c, "Exercise created successfully", createExerciseRequest)
	}
}

func DeleteExercise(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		exerciseIDStr := c.Param("id")
		if exerciseIDStr == "" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Exercise ID is required", nil)
			return
		}

		exerciseID, err := strconv.ParseUint(exerciseIDStr, 10, 32)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid exercise ID", err)
			return
		}

		// check if the exercise exists
		result := db.Delete(&models.Exercise{}, exerciseID)
		if result.Error != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete exercise", result.Error)
			return
		}

		if result.RowsAffected == 0 {
			utils.ErrorResponse(c, http.StatusNotFound, "Exercise not found", nil)
			return
		}

		utils.SuccessResponse(c, "Exercise deleted successfully", nil)
	}
}
