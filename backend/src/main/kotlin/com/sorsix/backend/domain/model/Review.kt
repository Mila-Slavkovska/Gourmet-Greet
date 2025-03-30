package com.sorsix.backend.domain.model

import com.sorsix.backend.domain.dto.ReviewDto
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
data class Review(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val grade: Double,
    @ManyToOne
    val author: User?,
    @ManyToOne
    val recipe: Recipe,
    val comment: String,
    val date: LocalDateTime = LocalDateTime.now()
) {
    fun toDto(): ReviewDto {
        return ReviewDto(
            id = this.id,
            grade = this.grade,
            authorId = this.author?.id ?: -1,
            authorName = (this.author?.getFullName()) ?: "No author",
            recipeId = this.recipe.id,
            comment = this.comment,
            date = this.date
        )
    }
}
