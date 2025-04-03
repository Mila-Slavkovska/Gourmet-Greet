package com.sorsix.backend.repository

import com.sorsix.backend.domain.model.Recipe
import org.springframework.data.jpa.repository.JpaRepository

interface RecipeRepository : JpaRepository<Recipe, Long> {
    fun findByTitleContainsIgnoreCase(title: String): List<Recipe>
    fun findByCookingTime(cookingTimeMinutes: Int): List<Recipe>
    fun findByServings(cookingTimeMinutes: Int): List<Recipe>

}