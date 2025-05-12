package com.sorsix.backend.web.controller

import com.sorsix.backend.domain.dto.CategoryAddDto
import com.sorsix.backend.domain.enum.CategoryType
import com.sorsix.backend.domain.model.Category
import com.sorsix.backend.service.CategoryService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin
@RestController
@RequestMapping("/api/categories")
class CategoryController(
    private val _categoryService: CategoryService
) {
    @GetMapping
    fun getAllCategories(): List<Category> = _categoryService.getAllCategories()

    @GetMapping("/ids")
    fun getCategoriesByIds(@RequestParam ids: List<Long>): List<Category> {
        return _categoryService.getCategoriesByIds(ids)
    }

    @GetMapping("/by-type")
    fun getCategoriesByType(@RequestParam type: CategoryType): List<Category> =  _categoryService.getCategoriesByCategoryType(type)

    @GetMapping("/{id}")
    fun getCategoryById(@PathVariable id: Long): ResponseEntity<Category> =
        _categoryService.getCategoryById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping
    fun createCategory(@RequestBody categoryDto: CategoryAddDto): ResponseEntity<Category> =
        _categoryService.createCategory(categoryDto).let { ResponseEntity.ok(it) }

    @PutMapping("/{id}")
    fun editCategory(@RequestBody categoryDto: CategoryAddDto, @PathVariable id: Long): ResponseEntity<Any> =
        _categoryService.editCategory(id, categoryDto)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Failed to edit category"))

    @DeleteMapping("/{id}")
    fun deleteCategory(@PathVariable id: Long): ResponseEntity<Category> =
        _categoryService.deleteCategoryById(id)?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @PostMapping("/{categoryId}/recipes/{recipeId}")
    fun addCategoryToRecipe(
        @PathVariable categoryId: Long,
        @PathVariable recipeId: Long
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(_categoryService.addCategoryToRecipe(recipeId, categoryId).toDto())
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @GetMapping("/types")
    fun getCategoryTypes(): ResponseEntity<List<String>> =
        ResponseEntity.ok(CategoryType.entries.map { it.name })
}
