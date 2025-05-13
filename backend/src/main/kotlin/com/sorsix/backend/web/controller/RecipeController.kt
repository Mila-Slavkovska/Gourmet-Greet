package com.sorsix.backend.web.controller

import org.springframework.http.MediaType
import com.sorsix.backend.domain.dto.RecipeAddDto
import com.sorsix.backend.domain.dto.RecipeDto
import com.sorsix.backend.domain.dto.RecipeSearchDto
import com.sorsix.backend.domain.dto.TopIngredientDto
import com.sorsix.backend.service.ImageService
import com.sorsix.backend.service.IngredientIndexService
import com.sorsix.backend.service.RecipeService
import com.sorsix.backend.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.IOException

@CrossOrigin
@RestController
@RequestMapping("/api/recipes")
class RecipeController(
    private val _recipeService: RecipeService,
    private val _imageService: ImageService,
    private val ingredientIndexService: IngredientIndexService,
    private val userService: UserService
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
        @RequestParam(required = false) numberOfServings: Int = 0,
        @RequestParam(required = false) dietaryOptions: List<Long> = emptyList(),
        @RequestParam(required = false) cuisineOptions: List<Long> = emptyList(),
        @RequestParam(required = false) skillLevels: List<Long> = emptyList(),
        @RequestParam(required = false) recipeCategories: List<Long> = emptyList(),

        @RequestParam(required = false) ingredients: List<String> = emptyList(),
        @RequestParam(required = false, defaultValue = "0") page: Int,
        @RequestParam(required = false, defaultValue = "9") pageSize: Int
    ): RecipeSearchDto {
        val allFilteredRecipes = _recipeService.search(title, cookingTime, numberOfServings, dietaryOptions,cuisineOptions, skillLevels, recipeCategories, ingredients)
        val totalCount = allFilteredRecipes.size

        val paginatedRecipes = allFilteredRecipes
            .take(pageSize)
            .map { it.toDto() }

        return RecipeSearchDto(
            recipes = paginatedRecipes,
            totalResults = totalCount
        )
    }

    @GetMapping("/top-rated")
    fun getTopRatedRecipes(): List<RecipeDto> {
        return _recipeService.getTopRatedRecipes().map { it.toDto() }
    }

    @GetMapping("/top-ingredients")
    fun getTopIngredients(): List<TopIngredientDto> = ingredientIndexService.getTop10Ingredients()

    @PostMapping("/favourites/{recipeId}")
    fun addToFavouriteRecipes(@PathVariable recipeId: Long): ResponseEntity<Unit> {
        val user = userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
        _recipeService.addRecipeToFavourites(user, recipeId)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/favourites/{recipeId}")
    fun removeFromFavouriteRecipes(@PathVariable recipeId: Long): ResponseEntity<Unit> {
        val user = userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
        _recipeService.removeFromFavourites(user, recipeId)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/is-favourite/{recipeId}")
    fun isFavouriteRecipe(@PathVariable recipeId: Long): ResponseEntity<Boolean> {
        val user = userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
        val isFavourite = _recipeService.isFavouriteRecipe(user, recipeId)
        return ResponseEntity.ok(isFavourite)
    }

}