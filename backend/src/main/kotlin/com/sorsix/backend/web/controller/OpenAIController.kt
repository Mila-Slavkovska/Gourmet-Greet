package com.sorsix.backend.web.controller

import com.sorsix.backend.domain.model.CalorieEstimationAIRequest
import com.sorsix.backend.domain.model.IngredientsRecipeAiRequest
import com.sorsix.backend.service.OpenAIService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
    fun createAIRecipe(@RequestBody request: IngredientsRecipeAiRequest): ResponseEntity<String>{
        val response = this.openAIService.createAIRecipe(request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/nutrition-info")
    fun estimateCalories(@RequestBody request: CalorieEstimationAIRequest): ResponseEntity<String>{
        val response = this.openAIService.estimateCalories(request)
        return ResponseEntity.ok(response)
    }
}