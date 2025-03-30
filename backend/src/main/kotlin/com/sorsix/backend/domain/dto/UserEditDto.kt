package com.sorsix.backend.domain.dto

data class UserEditDto (
    val firstName : String,
    val lastName : String,
    val phoneNumber : String,
    val userRole: String
)