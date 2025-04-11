package com.sorsix.backend.service

import com.sorsix.backend.domain.dto.RecipeAddDto
import com.sorsix.backend.domain.model.Recipe
import com.sorsix.backend.repository.CategoryRepository
import com.sorsix.backend.repository.RecipeRepository
import com.sorsix.backend.repository.ReviewRepository
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class RecipeService(
    private val _recipeRepository: RecipeRepository,
    private val _categoryRepository: CategoryRepository,
    private val _reviewRepository: ReviewRepository

) {
    fun getAllRecipes(): List<Recipe> = _recipeRepository.findAll()
    fun getRecipeById(id: Long): Recipe? = _recipeRepository.findByIdOrNull(id)

    fun getTopRatedRecipes(): List<Recipe> = _recipeRepository.findTop9ByOrderByRatingDesc()
    //TODO: add the owner of the recipe
    fun createRecipe(
        recipeDto: RecipeAddDto
    ): Recipe {
        val categories = recipeDto.categories.map { category ->
            _categoryRepository.findById(category).orElseThrow {
                RuntimeException("Category Not Found")
            }
        }
        val recipe = Recipe(
            title = recipeDto.title,
            description = recipeDto.description,
            ingredients = recipeDto.ingredients.toMutableList(),
            cookingTime = recipeDto.cookingTime,
            servings = recipeDto.servings,
            categories = categories.toMutableList(),
            images = mutableListOf(),
            poster = 0,
            steps = recipeDto.steps.toMutableList(),
        )
        return _recipeRepository.save(recipe)
    }

    fun editRecipe(
        id: Long, recipeDto: RecipeAddDto
    ): Recipe {
        val recipe = _recipeRepository.findById(id).orElseThrow {
            RuntimeException("Recipe Not Found")
        }
        val categories = recipeDto.categories.map { category ->
            _categoryRepository.findById(category).orElseThrow {
                RuntimeException("Category Not Found")
            }
        }
        val updatedRecipe = recipe.copy(
            title = recipeDto.title.ifBlank { recipe.title },
            description = recipeDto.description.ifBlank { recipe.description },
            ingredients = if (recipeDto.ingredients.isNotEmpty()) recipeDto.ingredients.toMutableList() else recipe.ingredients,
            steps = if (recipeDto.steps.isNotEmpty()) recipeDto.steps.toMutableList() else recipe.steps,
            cookingTime = if (recipeDto.cookingTime > 0) recipeDto.cookingTime else recipe.cookingTime,
            servings = if (recipeDto.servings > 0) recipeDto.servings else recipe.servings,
            categories = categories.toMutableList(),
            images = if (recipeDto.images.isNotEmpty()) recipeDto.images.toMutableList() else recipe.images,
            poster = if (recipeDto.poster > 0) recipeDto.poster else recipe.poster
        )
        return _recipeRepository.save(updatedRecipe)
    }

    @Transactional
    fun deleteRecipeById(id: Long): Boolean {
        val recipe = _recipeRepository.findById(id).orElse(null) ?: return false

        recipe.removeOwner()
        _reviewRepository.deleteByRecipe(recipe)
        _recipeRepository.delete(recipe)
        return true
    }

    fun search(title: String, cookingTime: Int, servings: Int, categoryIds: List<Long>,ingredients:List<String>): List<Recipe> {
        var recipes = if (title.isNotBlank()) {
            _recipeRepository.findByTitleContainsIgnoreCase(title)
        } else {
            getAllRecipes()
        }

        cookingTime.takeIf { it > 0 }?.let { time ->
            recipes = recipes.filter { it.cookingTime == time }
        }

        servings.takeIf { it > 0 }?.let { size ->
            recipes = recipes.filter { it.servings == size }
        }

        categoryIds.takeIf { it.isNotEmpty() }?.let { ids ->
            recipes = recipes
                .filter { recipe ->
                    recipe.categories.any { it.id in ids }
                }
        }

        ingredients.takeIf { it.isNotEmpty() }?.let { inputIngredients ->
            recipes = recipes.filter { recipe ->
                inputIngredients.any { inputIng ->
                    recipe.ingredients.any { it.equals(inputIng, ignoreCase = true) }
                }
            }
        }


        return recipes.sortedBy { it.title }
    }


}
