package com.sorsix.backend.service

import com.sorsix.backend.domain.dto.CategoryAddDto
import com.sorsix.backend.domain.dto.ReviewDto
import com.sorsix.backend.domain.enum.CategoryType
import com.sorsix.backend.domain.model.Category
import com.sorsix.backend.domain.model.Recipe
import com.sorsix.backend.repository.CategoryRepository
import com.sorsix.backend.repository.RecipeRepository
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class CategoryService(
    private val _categoryRepository: CategoryRepository,
    private val _recipeRepository: RecipeRepository

) {
    fun getAllCategories(): List<Category> = _categoryRepository.findAll()
    fun getCategoryById(id: Long): Category? = _categoryRepository.findByIdOrNull(id)
    fun createCategory(categoryDto: CategoryAddDto): Category? = Category(
        name = categoryDto.name,
        categoryType = CategoryType.valueOf(categoryDto.categoryType)
    ).let {
        _categoryRepository.save(it)
    }

    fun editCategory(id: Long, categoryDto: CategoryAddDto): Category? =
        _categoryRepository.findByIdOrNull(id)
            ?.let {
                val category = it.copy(
                    name = categoryDto.name,
                    categoryType = CategoryType.valueOf(categoryDto.categoryType)
                )
                _categoryRepository.save(category)
            }

    fun deleteCategoryById(id: Long): Category? =
        _categoryRepository.findByIdOrNull(id)?.let {
            _categoryRepository.deleteById(id)
            it
        }

    @Transactional
    fun addCategoryToRecipe(recipeId: Long, categoryId: Long): Recipe {
        val recipe = _recipeRepository.findById(recipeId)
            .orElseThrow { RuntimeException("Recipe not found") }
        val category = _categoryRepository.findById(categoryId)
            .orElseThrow { (RuntimeException("Category not found")) }
        recipe.categories.add(category)
        _recipeRepository.save(recipe)
        return recipe
    }

}
