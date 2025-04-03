package com.sorsix.backend.web.controller

import org.springframework.http.MediaType
import com.sorsix.backend.domain.dto.RecipeAddDto
import com.sorsix.backend.domain.dto.RecipeDto
import com.sorsix.backend.domain.model.Recipe
import com.sorsix.backend.service.ImageService
import com.sorsix.backend.service.RecipeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.IOException

@CrossOrigin
@RestController
@RequestMapping("/api/recipes")
class RecipeController(
    private val _recipeService: RecipeService,
    private val _imageService: ImageService,
) {
    @GetMapping
    fun getAllRecipes(): List<RecipeDto> = _recipeService.getAllRecipes().map { it.toDto() }

    @GetMapping("/{id}")
    fun getRecipeById(@PathVariable("id") id: Long): ResponseEntity<RecipeDto> =
        _recipeService.getRecipeById(id)?.let {
            ResponseEntity.ok(it.toDto())
        } ?: ResponseEntity.notFound().build()

    @PostMapping
    fun createRecipe(
        @RequestBody recipeDto: RecipeAddDto
    ): ResponseEntity<Any> {
        return try {
            val recipe = _recipeService.createRecipe(recipeDto)
            ResponseEntity.ok(recipe.toDto())
        } catch (e: RuntimeException) {
            ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to e.message))
        }
    }

    @PutMapping("/{id}")
    fun editRecipe(@PathVariable("id") id: Long, @RequestBody recipeDto: RecipeAddDto): ResponseEntity<Any> {
        return try {
            val recipe = _recipeService.editRecipe(id, recipeDto)
            ResponseEntity.ok(recipe.toDto())
        } catch (e: RuntimeException) {
            ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to e.message))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteRecipe(@PathVariable id: Long): ResponseEntity<RecipeDto> =
        if (_recipeService.deleteRecipeById(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }

    @PostMapping("/{id}/upload-image")
    @Throws(IOException::class)
    fun uploadImage(
        @PathVariable id: Long,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<Any> {
        return try {
            //            val currentUser = userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
            val recipe = _imageService.saveImage(id, file)
            ResponseEntity.ok(recipe?.toDto())
        } catch (e: IOException) {
            ResponseEntity.status(500).body("Image upload failed: ${e.message}")
        }
    }

    @PostMapping("/{id}/upload-poster-image")
    @Throws(IOException::class)
    fun uploadBackgroundImage(
        @PathVariable id: Long,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<Any> {
        return try {
//            val currentUser = userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
            val recipe = _imageService.saveBackgroundImage(id, file)
            ResponseEntity.ok(recipe?.toDto())
        } catch (e: IOException) {
            ResponseEntity.status(500).body("Image upload failed: ${e.message}")
        } catch (e: RuntimeException) {
            ResponseEntity.status(403).body(mapOf("Action forbidden: " to e.message))
        }
    }

    @GetMapping("/{id}/image/{imageId}")
    fun getImage(@PathVariable id: Long, @PathVariable imageId: Long): ResponseEntity<ByteArray> {
        val image = _imageService.getImage(id, imageId) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(image)
    }

    @GetMapping("/search")
    fun searchByAll(
        @RequestParam(required = false) title: String = "",
        @RequestParam(required = false) cookingTime: Int = 0,
        @RequestParam(required = false) servings: Int = 0,
        @RequestParam(required = false) categoryIds: List<Long> = emptyList()
    ): List<RecipeDto> {
        val filteredRecipes = _recipeService.search(title, cookingTime, servings, categoryIds).map { it.toDto() }
        return filteredRecipes
    }

}