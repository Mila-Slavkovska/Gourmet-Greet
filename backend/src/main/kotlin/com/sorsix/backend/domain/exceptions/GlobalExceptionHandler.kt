package com.sorsix.backend.domain.exceptions

import jakarta.validation.ConstraintViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ControllerAdvice

@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ConstraintViolationException::class)
    fun handleConstraintViolationException(ex: ConstraintViolationException): ResponseEntity<Map<String, List<String>>> {
        val errors = ex.constraintViolations
            .map { it.message }
            .toList()

        val errorResponse = mapOf("error" to errors)
        return ResponseEntity(errorResponse, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, List<String>>> {
        val errors = mutableListOf<String>()
        val bindingResult = ex.bindingResult

        bindingResult.fieldErrors.forEach { fieldError ->
            errors.add(fieldError.defaultMessage ?: "Invalid field")
        }

        val errorResponse = mapOf("error" to errors)
        return ResponseEntity(errorResponse, HttpStatus.BAD_REQUEST)
    }

}
