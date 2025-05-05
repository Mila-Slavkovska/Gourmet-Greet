package com.sorsix.backend.repository

import com.sorsix.backend.domain.dto.TopIngredientDto
import com.sorsix.backend.domain.model.IngredientIndex
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IngredientIndexRepository : JpaRepository<IngredientIndex, String> {

    @Query(
        value = """
        SELECT ingredient AS ingredient, COUNT(recipe_id) AS count
        FROM ingredient_recipe_ids
        GROUP BY ingredient
        ORDER BY count DESC
        LIMIT 10
    """,
        nativeQuery = true
    )    fun findTop10Ingredients(): List<TopIngredientDto>
}
