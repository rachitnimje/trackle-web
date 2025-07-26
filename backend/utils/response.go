package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rachitnimje/trackle-web/models"
)

func SuccessResponse(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func CreatedResponse(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func ErrorResponse(c *gin.Context, statusCode int, message string, err error) {
	errorMsg := ""
	if err != nil {
		errorMsg = err.Error()
	}

	c.JSON(statusCode, models.APIResponse{
		Success: false,
		Message: message,
		Error:   errorMsg,
	})
}

func PaginatedResponse(c *gin.Context, message string, data interface{}, page, limit int, total int64) {
	var totalPages int64
	if total > 0 {
		totalPages = int64(int((total + int64(limit) - 1) / int64(limit)))
	} else {
		totalPages = 0
	}

	hasNext := total < totalPages
	hasPrev := page > 1

	c.JSON(http.StatusOK, models.PaginatedResponse{
		Success:    true,
		Message:    message,
		Data:       data,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
		Total:      total,
		HasNext:    hasNext,
		HasPrev:    hasPrev,
	})
}
