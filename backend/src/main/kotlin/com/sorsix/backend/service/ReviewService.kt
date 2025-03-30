package com.sorsix.backend.service


import com.sorsix.backend.domain.dto.ReviewDto
import com.sorsix.backend.domain.exceptions.UsersDoNotMatchException
import com.sorsix.backend.domain.model.Review
import com.sorsix.backend.domain.model.User
import com.sorsix.backend.repository.RecipeRepository
import com.sorsix.backend.repository.ReviewRepository
import com.sorsix.backend.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ReviewService(
    private val _reviewRepository: ReviewRepository,
    private val _userRepository: UserRepository,
    private val _recipeRepository: RecipeRepository,

    ) {

    @Transactional
    fun save(reviewDto: ReviewDto): Review {
        val author = _userRepository.findById(reviewDto.authorId)
            .orElseThrow { RuntimeException("User not found") }
        val recipe = _recipeRepository.findById(reviewDto.recipeId)
            .orElseThrow { RuntimeException("Recipe not found") }

        val review = Review(
            grade = reviewDto.grade,
            author = author,
            recipe = recipe,
            comment = reviewDto.comment,
            date = reviewDto.date
        )
        val currentReview: Review = _reviewRepository.save(review)

        val currenRating: Double = recipe.reviews.sumOf { it.grade } / recipe.reviews.size
        val currentNumberOfReviews: Int = recipe.reviews.size

        _recipeRepository.save(recipe.copy(rating = currenRating, numberOfReviews = currentNumberOfReviews))

        return currentReview
    }

    fun findById(id: Long): Review? = _reviewRepository.findByIdOrNull(id)

    fun findAll(): List<Review> = _reviewRepository.findAll()


    @Transactional
    fun update(id: Long, reviewDto: ReviewDto, currentUser: User): ReviewDto {
        val existingReview = _reviewRepository.findById(id).orElseThrow { RuntimeException("Review not found") }
        val recipe = existingReview.recipe

        if (currentUser.id != existingReview.author?.id) {
            throw UsersDoNotMatchException()
        }

        val reviewToUpdate = existingReview.copy(
            grade = reviewDto.grade,
            comment = reviewDto.comment
        )

        val currentReview: Review = _reviewRepository.save(reviewToUpdate.copy())
        val newRating = recipe.reviews.sumOf { it.grade } / recipe.reviews.size
        _recipeRepository.save(recipe.copy(rating = newRating))

        return currentReview.toDto()
    }

    @Transactional
    fun deleteById(id: Long, currentUser: User) {
        val review = _reviewRepository.findById(id).orElseThrow { RuntimeException("Review not found") }
        val recipe = review.recipe

        if (review.author?.id != currentUser.id) {
            throw UsersDoNotMatchException()
        }

        _reviewRepository.deleteById(id)

        val currenRating: Double = recipe.reviews.sumOf { it.grade } / recipe.reviews.size
        val currentNumberOfReviews: Int = recipe.reviews.size

        _recipeRepository.save(recipe.copy(rating = currenRating, numberOfReviews = currentNumberOfReviews))
    }
}
