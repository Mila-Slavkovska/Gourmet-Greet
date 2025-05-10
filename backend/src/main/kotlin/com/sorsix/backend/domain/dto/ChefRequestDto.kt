package com.sorsix.backend.domain.dto

data class ChefRequestDto(
    val id: Long,
    val userEmail: String,
    val message: String,
    val timeStamp: String,
    val status: String
)