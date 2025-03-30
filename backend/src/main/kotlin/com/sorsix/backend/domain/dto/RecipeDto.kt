package com.sorsix.backend.domain.dto

data class RecipeDto(
    val id: Long = 0,
    val title: String,
    val description: String,
    val rating: Double = 0.0,
    val numberOfReviews: Int = 0,
    val posterId: Long? = null,
    val galleryImageIds: List<Long> = emptyList(),
    val reviewDtos: List<ReviewDto> = emptyList(),
    val categoryIds: List<Long> = emptyList(),
    val cookingTime: Int = 0,
    val servings: Int = 0,
    val ownerId: Long,
    val ingredients: List<String> = emptyList(),

)