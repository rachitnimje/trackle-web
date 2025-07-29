import { AxiosError } from 'axios';
import { ErrorResponse } from './types';

/**
 * Extract error information from an Axios error
 * @param error The Axios error
 * @returns A formatted error response with status code and message
 */
export const getErrorInfo = (error: unknown): ErrorResponse => {
  if (error instanceof AxiosError) {
    // Try to get our custom error info first
    const customErrorInfo = (error as any).errorInfo as ErrorResponse | undefined;
    if (customErrorInfo) {
      return customErrorInfo;
    }
    
    // Fall back to response data
    const responseData = error.response?.data;
    if (responseData && typeof responseData === 'object') {
      return {
        success: false,
        message: responseData.message || 'An error occurred',
        error: responseData.error || error.message,
        status: error.response?.status || 0
      };
    }
    
    // Generic error based on status code
    if (error.response) {
      let message = 'An error occurred';
      
      switch (error.response.status) {
        case 400:
          message = 'Bad request - please check your input';
          break;
        case 401:
          message = 'You need to log in to access this resource';
          break;
        case 403:
          message = 'You do not have permission to access this resource';
          break;
        case 404:
          message = 'The requested resource was not found';
          break;
        case 500:
          message = 'A server error occurred, please try again later';
          break;
        default:
          message = `Error: ${error.response.status} - ${error.message}`;
      }
      
      return {
        success: false,
        message,
        error: error.message,
        status: error.response.status
      };
    }
  }
  
  // Default error for non-Axios errors or unexpected formats
  return {
    success: false,
    message: 'An unexpected error occurred',
    error: error instanceof Error ? error.message : String(error),
    status: 0
  };
};

/**
 * Check if an error is a specific HTTP status code
 * @param error The error to check
 * @param status The HTTP status code to check for
 * @returns True if the error has the specified status code
 */
export const isHttpError = (error: unknown, status: number): boolean => {
  if (error instanceof AxiosError && error.response) {
    return error.response.status === status;
  }
  return false;
};

/**
 * Check if an error is a not found error (404)
 * @param error The error to check
 * @returns True if the error is a 404 not found error
 */
export const isNotFoundError = (error: unknown): boolean => {
  return isHttpError(error, 404);
};

/**
 * Check if an error is a server error (500+)
 * @param error The error to check
 * @returns True if the error is a server error
 */
export const isServerError = (error: unknown): boolean => {
  if (error instanceof AxiosError && error.response) {
    return error.response.status >= 500;
  }
  return false;
};
