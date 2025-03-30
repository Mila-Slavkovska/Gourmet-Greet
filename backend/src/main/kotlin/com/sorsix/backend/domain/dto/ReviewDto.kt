package com.sorsix.backend.domain.dto

import java.time.LocalDateTime

data class ReviewDto(
    val id: Long = 0,
    val grade: Double,
    val authorId: Long = 0,
    val authorName: String = "",
    val recipeId: Long = 0,
    val comment: String,
    val date: LocalDateTime = LocalDateTime.now()
)