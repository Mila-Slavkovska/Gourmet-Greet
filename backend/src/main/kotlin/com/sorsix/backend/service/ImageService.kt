package com.sorsix.backend.service

import com.sorsix.backend.domain.model.Image
import com.sorsix.backend.domain.model.Recipe
import com.sorsix.backend.repository.ImageRepository
import com.sorsix.backend.repository.RecipeRepository
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.IOException

@Service
class ImageService(
    private val _imageRepository: ImageRepository,
    private val _recipeRepository: RecipeRepository
) {
    //TODO: only owner of the recipe can add image
    @Transactional
    @Throws(IOException::class)
    fun saveImage(id: Long, file: MultipartFile): Recipe? =
        _recipeRepository.findByIdOrNull(id)?.let { r ->
            val imageBytes = file.bytes
            var imageEntity = Image(image = imageBytes)
            imageEntity = _imageRepository.save(imageEntity)

            imageEntity.id?.let { r.images.add(it) }
            return _recipeRepository.save(r)
        }

    //TODO: only owner of the recipe can add image
    @Transactional
    @Throws(IOException::class)
    fun saveBackgroundImage(id: Long, file: MultipartFile): Recipe? =
        _recipeRepository.findByIdOrNull(id)?.let { r ->
            val oldImageId = r.poster
            val imageBytes = file.bytes
            var imageEntity = Image(image = imageBytes)
            imageEntity = _imageRepository.save(imageEntity)

            val newRecipe = imageEntity.id?.let { r.copy(poster = it) }

            _imageRepository.deleteById(oldImageId)
            return newRecipe?.let { _recipeRepository.save(it) }
        }

    @Transactional
    fun getImage(id: Long, imageId: Long): ByteArray? {
        val recipe: Recipe? = _recipeRepository.findByIdOrNull(id)
        if (recipe?.poster != null && recipe.poster == imageId) {
            return _imageRepository.findByIdOrNull(recipe.poster)?.image
        }
        val newImageId = recipe?.images?.find { it == imageId }
        return _imageRepository.findByIdOrNull(newImageId)?.image
    }
}

