package com.sorsix.backend.domain.dto

data class UserSimpleDto (
    val id: Long,
    val email: String,
    val firstName: String,
    val lastName: String,
    val phoneNumber: String,
    val favoriteRecipes: List<Long>,
    val ownedRecipes: List<Long>,
    val role: String
)