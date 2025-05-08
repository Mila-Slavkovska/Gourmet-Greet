package com.sorsix.backend.web.controller

import com.sorsix.backend.domain.model.OpenAIRequest
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
    @PostMapping
    fun suggestRecipes(@RequestBody request: OpenAIRequest): ResponseEntity<String>{
        val response = this.openAIService.suggestRecipes(request.ingredients)
        return ResponseEntity.ok(response)
    }
}