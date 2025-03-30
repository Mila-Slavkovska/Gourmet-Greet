package com.sorsix.backend.domain.dto

data class UserAddDto (
    val firstName : String,
    val lastName : String,
    val email : String,
    val password : String,
    val phoneNumber : String,
    val userRole: String
)