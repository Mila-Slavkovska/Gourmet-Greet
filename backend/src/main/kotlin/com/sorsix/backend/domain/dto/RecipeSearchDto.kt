package com.sorsix.backend.domain.dto

data class RecipeSearchDto(
  val recipes: List<RecipeDto>,
  val totalResults: Int

)