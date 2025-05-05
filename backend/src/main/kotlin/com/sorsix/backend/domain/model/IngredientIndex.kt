package com.sorsix.backend.domain.model

import jakarta.persistence.*

@Entity
data class IngredientIndex(
    @Id
    val ingredient: String,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ingredient_recipe_ids", joinColumns = [JoinColumn(name = "ingredient")])
    @Column(name = "recipe_id")
    val recipeIds: MutableSet<Long> = mutableSetOf()
)
