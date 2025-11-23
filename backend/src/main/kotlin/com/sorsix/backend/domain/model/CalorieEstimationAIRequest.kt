package com.sorsix.backend.domain.model

data class CalorieEstimationAIRequest(
    val ingredients: List<String>,
    val steps: List<String>,
    val servings: Int
) {
    fun toJson(): String {
        val stepsJson = steps.joinToString(separator = "\", \"", prefix = "[\"", postfix = "\"]")
        val ingredientsJson = ingredients.joinToString(separator = "\", \"", prefix = "[\"", postfix = "\"]")
        return """
        {
            "ingredients": "$ingredientsJson",
            "steps": $stepsJson,
            "servings": $servings
        }
    """.trimIndent()
    }
}