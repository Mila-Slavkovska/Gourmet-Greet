package com.sorsix.backend.domain.dto


data class RecipeAddDto(
    val title: String,
    val description: String,
    val ingredients: List<String> = emptyList(),
    val categories: List<Long> = emptyList(),
    val cookingTime: Int,
    val servings: Int,
    val poster: Long = 0,
    val images: List<Long> = emptyList(),
    val steps: List<String> = emptyList()
)