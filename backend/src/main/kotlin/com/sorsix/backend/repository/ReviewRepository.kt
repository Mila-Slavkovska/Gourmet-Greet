package com.sorsix.backend.repository

import com.sorsix.backend.domain.model.Recipe
import com.sorsix.backend.domain.model.Review
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository

interface ReviewRepository : JpaRepository<Review, Long> {
    @Transactional
    fun deleteByRecipe(recipe: Recipe)
}