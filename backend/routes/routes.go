package routes

import (
	"github.com/rachitnimje/trackle-web/controllers"
	"github.com/rachitnimje/trackle-web/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// Public routes
	r.POST("/register", controllers.Register(db))
	r.POST("/login", controllers.Login(db))

	// Protected routes
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	{
		// Auth routes
		auth.POST("/logout", controllers.Logout())
		auth.GET("/me", controllers.Me(db))

		// Template routes: for admin

		// Template routes: for users
		auth.POST("/templates/me", controllers.CreateUserTemplate(db))
		auth.GET("/templates/me", controllers.GetTemplates(db))
		//auth.GET("/templates/me", controllers.GetUserTemplates(db))
		auth.GET("/templates/me/:id", controllers.GetUserTemplate(db))
		auth.DELETE("/templates/me/:id", controllers.DeleteUserTemplate(db))

		// Exercise routes: for everyone
		auth.GET("/exercises", controllers.GetAllExercises(db))
		auth.POST("/exercises", controllers.CreateExercise(db))
		auth.GET("/exercises/:id", controllers.GetExercise(db))
		auth.DELETE("/exercises/:id", controllers.DeleteExercise(db))

		// Workout routes: for users
		auth.POST("/workouts/me", controllers.CreateUserWorkout(db))
		auth.GET("/workouts/me", controllers.GetUserWorkouts(db))
		auth.GET("/workouts/me/:id", controllers.GetUserWorkout(db))
		auth.DELETE("/workouts/me/:id", controllers.DeleteWorkout(db))
	}
}
