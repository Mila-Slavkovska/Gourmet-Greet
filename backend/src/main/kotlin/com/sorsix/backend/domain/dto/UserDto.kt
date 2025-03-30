package com.sorsix.backend.domain.dto

data class UserDto(
    val id: Long,
    val email: String,
    val firstName: String,
    val lastName: String,
    val phoneNumber: String,
    val favorites: Set<RecipeDto>,
    val ownedRecipes: List<RecipeDto>,
    val userRole: String
)
