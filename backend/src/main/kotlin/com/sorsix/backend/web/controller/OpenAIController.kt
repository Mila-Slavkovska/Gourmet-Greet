package com.sorsix.backend.web.controller

import com.sorsix.backend.domain.dto.RecipeAddDto
import com.sorsix.backend.domain.model.CalorieEstimationAIRequest
import com.sorsix.backend.domain.model.IngredientsRecipeAiRequest
import com.sorsix.backend.service.OpenAIService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin
@RestController
@RequestMapping("/api/openai")
class OpenAIController(
    private val openAIService: OpenAIService
) {
    @PostMapping("/suggest")
    fun suggestRecipes(@RequestBody request: IngredientsRecipeAiRequest): ResponseEntity<String>{
        val response = this.openAIService.suggestRecipes(request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/cook")
    fun createAIRecipe(@RequestBody request: IngredientsRecipeAiRequest): ResponseEntity<RecipeAddDto >{
        val response = this.openAIService.createAiRecipeJson(request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/nutrition-info")
    fun estimateCalories(@RequestBody request: CalorieEstimationAIRequest): ResponseEntity<String>{
        val response = this.openAIService.estimateCalories(request)
        return ResponseEntity.ok(response)
    }
}