package models

import (
	"gorm.io/gorm"
)

type Workout struct {
	gorm.Model
	UserID     uint           `json:"user_id" gorm:"not null"`
	TemplateID uint           `json:"template_id" gorm:"not null"`
	Name       string         `json:"name" gorm:"not null"`
	Notes      string         `json:"notes"`
	User       User           `json:"-" gorm:"foreignKey:UserID"`
	Template   Template       `json:"-" gorm:"foreignKey:TemplateID"`
	Entries    []WorkoutEntry `json:"entries" gorm:"foreignKey:WorkoutID"`
}

type WorkoutEntry struct {
	gorm.Model
	WorkoutID  uint     `json:"workout_id" gorm:"not null"`
	ExerciseID uint     `json:"exercise_id" gorm:"not null"`
	SetNumber  int      `json:"set_number" gorm:"not null;check:set_number > 0"`
	Reps       int      `json:"reps" gorm:"not null;check:reps > 0"`
	Weight     float64  `json:"weight" gorm:"not null;check:weight >= 0"`
	Workout    Workout  `json:"-" gorm:"foreignKey:WorkoutID"`
	Exercise   Exercise `json:"exercise" gorm:"foreignKey:ExerciseID"`
}
