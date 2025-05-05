package com.sorsix.backend.domain.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.sorsix.backend.domain.dto.RecipeDto
import jakarta.persistence.*

@Entity
data class Recipe(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long = 0,

    @Column(nullable = false) val title: String,

    @Column(nullable = false, length = 1000) val description: String,

    var rating: Double = 0.0, var numberOfReviews: Int = 0,

    @ElementCollection(fetch = FetchType.EAGER) @CollectionTable(
        name = "recipe_ingredients",
        joinColumns = [JoinColumn(name = "recipe_id")]
    ) @Column(name = "ingredient", nullable = false)
    val ingredients: MutableList<String> = mutableListOf(),

    @ElementCollection(fetch = FetchType.EAGER) @CollectionTable(
        name = "recipe_steps",
        joinColumns = [JoinColumn(name = "recipe_id")]
    ) @Column(name = "steps", nullable = false)
    val steps: MutableList<String> = mutableListOf(),

    @ManyToMany(
        fetch = FetchType.EAGER,
        cascade = [CascadeType.MERGE, CascadeType.PERSIST]
    ) val categories: MutableList<Category> = mutableListOf(),

    @Column(nullable = false) val cookingTime: Int,

    @Column(nullable = false) val servings: Int,

    val poster: Long, @ElementCollection(fetch = FetchType.EAGER) val images: MutableList<Long> = mutableListOf(),

    @ManyToOne @JsonBackReference var owner: User? = null,

    @OneToMany(mappedBy = "recipe") var reviews: MutableList<Review> = mutableListOf()
) {

    fun removeOwner() {
        owner?.ownedRecipes?.remove(this)
        owner = null
    }

    fun toDto(): RecipeDto {
        return RecipeDto(
            id = this.id,
            title = this.title,
            description = this.description,
            galleryImageIds = this.images,
            posterId = this.poster,
            reviewDtos = this.reviews.map { it.toDto() },
            ownerId = this.owner?.id ?: 0,
            rating = rating,
            numberOfReviews = numberOfReviews,
            categoryIds = this.categories.map { it.id },
            ingredients = this.ingredients,
            cookingTime = this.cookingTime,
            servings = this.servings,
            steps = this.steps
        )
    }

    override fun toString(): String {
        return "Recipe(id=$id, title='$title', description='$description', rating=$rating, numberOfReviews=$numberOfReviews, cookingTime=$cookingTime, servings=$servings, poster=$poster)"
    }
}



