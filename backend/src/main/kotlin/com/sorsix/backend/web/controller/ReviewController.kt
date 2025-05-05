package com.sorsix.backend.web.controller


import com.sorsix.backend.domain.dto.ReviewDto
import com.sorsix.backend.service.ReviewService
import com.sorsix.backend.service.UserService
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@CrossOrigin
@RestController
@RequestMapping("/api/reviews")
class ReviewController(
    private val _reviewService: ReviewService,
    private val _userService: UserService
) {

    @PostMapping
    fun createReview(@RequestBody reviewDto: ReviewDto): ResponseEntity<Any> {
        try {
            val user = _userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
            val updatedReviewDto = reviewDto.copy(authorId = user.id, authorName = user.getFullName())
            val savedReview = _reviewService.save(updatedReviewDto)
            return ResponseEntity.ok(savedReview.toDto())
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @GetMapping("/{id}")
    fun getReviewById(@PathVariable id: Long): ResponseEntity<ReviewDto> {
        val review = _reviewService.findById(id)
        return if (review != null) {
            ResponseEntity.ok(review.toDto())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping
    fun getAllReviews(): ResponseEntity<List<ReviewDto>> {
        val reviews = _reviewService.findAll()
        return ResponseEntity.ok(reviews.map { it.toDto() })
    }

    @PutMapping("/{id}")
    fun updateReview(@PathVariable id: Long, @RequestBody reviewDto: ReviewDto): ResponseEntity<ReviewDto> {
        return try {
            //TODO: change the user
            //val user = userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
            val user = _userService.getAllUsers()[0]
            val updatedReview = _reviewService.update(id, reviewDto, user)
            ResponseEntity.ok(updatedReview)
        } catch (e: RuntimeException) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteReview(@PathVariable id: Long): ResponseEntity<Void> {
        //TODO: change the user
        //val user = userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
        val user = _userService.getAllUsers()[0]
        _reviewService.deleteById(id, user)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/for-user")
    fun getNumberOfReviewsForUser(): ResponseEntity<Int> {
        val user = _userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
        val numberOfReviews = _reviewService.getNumberOfReviewsForUser(user)
        return  ResponseEntity.ok(numberOfReviews)
    }
}
