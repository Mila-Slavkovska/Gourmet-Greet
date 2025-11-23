package com.sorsix.backend.domain.model

data class IngredientsRecipeAiRequest(
    val ingredients: List<String>,
    val recipeType: String
) {
    fun toJson(): String {
        val ingredientsJson = ingredients.joinToString(
            separator = "\", \"",
            prefix = "[\"",
            postfix = "\"]"
        )
        return """
        {
            "ingredients": $ingredientsJson,
            "recipeType": "$recipeType"
        }
    """.trimIndent()
    }
}