package com.sorsix.backend.service

import com.sorsix.backend.domain.dto.TopIngredientDto
import com.sorsix.backend.domain.model.IngredientIndex
import com.sorsix.backend.domain.model.Recipe
import com.sorsix.backend.repository.IngredientIndexRepository
import org.springframework.stereotype.Service

@Service
class IngredientIndexService(
    private val ingredientIndexRepository: IngredientIndexRepository
) {
    fun updateIndex(recipe: Recipe) {
        recipe.ingredients.forEach { ingredient ->
            val indexEntry = ingredientIndexRepository.findById(ingredient)
                .orElse(IngredientIndex(ingredient))
            indexEntry.recipeIds.add(recipe.id)
            ingredientIndexRepository.save(indexEntry)
        }
    }
    fun getTop10Ingredients(): List<TopIngredientDto> = ingredientIndexRepository.findTop10Ingredients()
}
