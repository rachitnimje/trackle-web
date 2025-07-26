package controllers

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/rachitnimje/trackle-web/models"
	"github.com/rachitnimje/trackle-web/utils"
)

type CreateWorkoutRequest struct {
	Name       string                `json:"name" binding:"required"`
	TemplateID uint                  `json:"template_id" binding:"required"`
	Notes      string                `json:"notes"`
	Entries    []WorkoutEntryRequest `json:"entries" binding:"required,min=1"`
}

type WorkoutEntryRequest struct {
	ExerciseID uint    `json:"exercise_id" binding:"required"`
	SetNumber  int     `json:"set_number" binding:"required,min=1"`
	Reps       int     `json:"reps" binding:"required,min=1"`
	Weight     float64 `json:"weight" binding:"min=0"`
}

type UserWorkoutsResponse struct {
	WorkoutID    uint      `json:"workout_id" binding:"required"`
	WorkoutName  string    `json:"workout_name" binding:"required"`
	TemplateID   uint      `json:"template_id" binding:"required"`
	TemplateName string    `json:"template_name" binding:"required"`
	LoggedAt     time.Time `json:"logged_at" binding:"required"`
	Notes        string    `json:"notes" binding:"required"`
}

type UserWorkoutResponse struct {
	gorm.Model
	TemplateID   uint                       `json:"template_id" binding:"required"`
	TemplateName string                     `json:"template_name" binding:"required"`
	WorkoutName  string                     `json:"workout_name" binding:"required"`
	Notes        string                     `json:"notes" binding:"required"`
	Entries      []UserWorkoutEntryResponse `json:"entries" binding:"required"`
}

type UserWorkoutEntryResponse struct {
	ExerciseID   uint    `json:"exercise_id" binding:"required"`
	ExerciseName string  `json:"exercise_name" binding:"required"`
	SetNumber    int     `json:"set_number" binding:"required"`
	Reps         int     `json:"reps" binding:"required"`
	Weight       float64 `json:"weight" binding:"required"`
}

func CreateUserWorkout(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// extract user_id from context
		userID, exists := c.Get("user_id")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		// bind and validate request
		var req CreateWorkoutRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request data", err)
			return
		}

		// check if the template belongs to the user
		var template models.Template
		if err := db.Where("id = ? and user_id = ?", req.TemplateID, userID).
			First(&template).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				utils.ErrorResponse(c, http.StatusNotFound, "Template not found or access denied", nil)
			} else {
				utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to verify template", err)
			}
			return
		}

		// Extract unique exercise IDs using map for verification
		exerciseIDMap := make(map[uint]bool)
		for _, entry := range req.Entries {
			exerciseIDMap[entry.ExerciseID] = true
		}

		var exerciseIDs []uint
		for id := range exerciseIDMap {
			exerciseIDs = append(exerciseIDs, id)
		}

		// Verify all exercises exist
		var exerciseCount int64
		if err := db.Model(&models.Exercise{}).
			Where("id IN ?", exerciseIDs).
			Count(&exerciseCount).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to verify exercises", err)
			return
		}

		if int(exerciseCount) != len(exerciseIDs) {
			utils.ErrorResponse(c, http.StatusBadRequest, "One or more exercise IDs are invalid", nil)
			return
		}

		// Use transaction for atomic operation
		tx := db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		// save the workout to db
		workout := models.Workout{
			Name:       req.Name,
			UserID:     userID.(uint),
			TemplateID: req.TemplateID,
			Notes:      req.Notes,
		}

		if err := tx.Create(&workout).Error; err != nil {
			tx.Rollback()
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create workout", err)
			return
		}

		// save the workout entries to db
		var workoutEntries []models.WorkoutEntry
		for _, r := range req.Entries {
			workoutEntries = append(workoutEntries, models.WorkoutEntry{
				WorkoutID:  workout.ID,
				ExerciseID: r.ExerciseID,
				SetNumber:  r.SetNumber,
				Reps:       r.Reps,
				Weight:     r.Weight,
			})
		}

		if err := tx.Create(&workoutEntries).Error; err != nil {
			tx.Rollback()
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create workout entries", err)
			return
		}
		
		// Commit the transaction
		if err := tx.Commit().Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to commit transaction", err)
			return
		}

		utils.CreatedResponse(c, "Workout created successfully", nil)
	}
}

func GetUserWorkouts(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// extract user_id from context
		userID, exists := c.Get("user_id")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		// Fetch all workouts with their templates in a single query
		var workouts []models.Workout
		if err := db.Where("user_id = ?", userID).
			Preload("Template").
			Order("created_at DESC").
			Find(&workouts).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve workouts", err)
			return
		}

		// Create response directly from preloaded data
		var userWorkoutsResponse []UserWorkoutsResponse
		for _, workout := range workouts {
			userWorkoutsResponse = append(userWorkoutsResponse, UserWorkoutsResponse{
				WorkoutID:    workout.ID,
				WorkoutName:  workout.Name,
				TemplateID:   workout.TemplateID,
				TemplateName: workout.Template.Name, // Use preloaded template name
				LoggedAt:     workout.CreatedAt,
				Notes:        workout.Notes,
			})
		}

		utils.SuccessResponse(c, "Workouts retrieved successfully", userWorkoutsResponse)
	}
}

func GetUserWorkout(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// extract user_id from context
		userID, exists := c.Get("user_id")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		// parse the workout ID with validation
		workoutIDStr := c.Param("id")
		if workoutIDStr == "" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Workout ID is required", nil)
			return
		}

		workoutID, err := strconv.ParseUint(workoutIDStr, 10, 32)
		if err != nil || workoutID == 0 {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid workout ID", nil)
			return
		}

		// Fetch the workout with template in a single query
		var workout models.Workout
		if err := db.Where("id = ? AND user_id = ?", workoutID, userID).
			Preload("Template").
			First(&workout).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				utils.ErrorResponse(c, http.StatusNotFound, "Workout not found or access denied", nil)
			} else {
				utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve workout", err)
			}
			return
		}

		// Fetch all workout entries with their exercises in a single query
		var workoutEntries []models.WorkoutEntry
		if err := db.Where("workout_id = ?", workoutID).
			Preload("Exercise").
			Find(&workoutEntries).Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve workout entries", err)
			return
		}

		// Map the entries to the response structure
		var workoutEntriesResponse []UserWorkoutEntryResponse
		for _, entry := range workoutEntries {
			workoutEntriesResponse = append(workoutEntriesResponse, UserWorkoutEntryResponse{
				ExerciseID:   entry.ExerciseID,
				ExerciseName: entry.Exercise.Name, // Access the preloaded Exercise data
				SetNumber:    entry.SetNumber,
				Reps:         entry.Reps,
				Weight:       entry.Weight,
			})
		}

		// Build the final response
		response := UserWorkoutResponse{
			Model:        workout.Model,
			TemplateID:   workout.TemplateID,
			TemplateName: workout.Template.Name, // Access the preloaded Template data
			WorkoutName:  workout.Name,
			Notes:        workout.Notes,
			Entries:      workoutEntriesResponse,
		}

		utils.SuccessResponse(c, "Workout retrieved successfully", response)
	}
}

func DeleteWorkout(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// retrieve the user id from context
		userID, exists := c.Get("user_id")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
			return
		}

		// retrieve the workout id from params and validate
		workoutIDStr := c.Param("id")
		if workoutIDStr == "" {
			utils.ErrorResponse(c, http.StatusBadRequest, "Workout ID is required", nil)
			return
		}

		workoutID, err := strconv.ParseUint(workoutIDStr, 10, 32)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid workout ID", err)
			return
		}

		// Check if workout exists and belongs to user
		var workout models.Workout
		if err := db.Where("id = ? AND user_id = ?", workoutID, userID).First(&workout).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				utils.ErrorResponse(c, http.StatusNotFound, "Workout not found", nil)
			} else {
				utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to find workout", err)
			}
			return
		}

		// Use transaction to ensure atomic deletion
		tx := db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		// Delete workout entries first
		if err := tx.Where("workout_id = ?", workoutID).Delete(&models.WorkoutEntry{}).Error; err != nil {
			tx.Rollback()
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete workout entries", err)
			return
		}

		// Delete workout
		if err := tx.Delete(&workout).Error; err != nil {
			tx.Rollback()
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete workout", err)
			return
		}

		// Commit the transaction
		if err := tx.Commit().Error; err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to commit transaction", err)
			return
		}

		utils.SuccessResponse(c, "Workout deleted successfully", nil)
	}
}
