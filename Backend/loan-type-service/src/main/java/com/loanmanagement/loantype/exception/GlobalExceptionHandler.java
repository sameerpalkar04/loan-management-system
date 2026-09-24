package com.loanmanagement.loantype.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LoanTypeNotFoundException.class)
    public ResponseEntity<ApiError> handleLoanTypeNotFound(
            LoanTypeNotFoundException exception) {

        ApiError error = new ApiError(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                exception.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleRequestValidationError(
            MethodArgumentNotValidException exception) {

        String message = exception.getBindingResult()
                .getAllErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Invalid request data");

        ApiError error = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                message
        );

        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handlePathValidationError(
            ConstraintViolationException exception) {

        ApiError error = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                exception.getMessage()
        );

        return ResponseEntity.badRequest().body(error);
    }
}
